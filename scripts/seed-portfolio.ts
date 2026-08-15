import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { makeScrypt, Password } from '@withstudiocms/auth-kit'
import { PasswordModOptions } from '@withstudiocms/auth-kit/config'
import { makeStudioCMSSDKCoreLive } from '@withstudiocms/sdk'
import dotenv from 'dotenv'
import {
  GhostUserDefaults,
  NotificationSettingsDefaults,
} from 'studiocms/consts'
import { getDbClient } from 'studiocms/db'
import { Effect, runEffect } from 'studiocms/effect'

dotenv.config()

interface LocalizedProject {
  name: string
  url: string
  image: string
  order: number
  description: { en: string; es: string; eo: string }
  skills: Array<{ en: string; es: string; eo: string }>
}

const projectsDir = resolve(import.meta.dir, '../src/content/projects')

let files: string[] = []
try {
	files = (await readdir(projectsDir)).filter((file) => file.endsWith('.json'))
} catch {
	console.log('No legacy project JSON files found, skipping project import.')
}
files.sort()

const projectEntries: Array<{
  file: string
  project: LocalizedProject
}> = []
for (const file of files) {
  const raw = await readFile(resolve(projectsDir, file), 'utf-8')
  projectEntries.push({ file, project: JSON.parse(raw) as LocalizedProject })
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildMarkdown(project: LocalizedProject): string {
  const skills = project.skills
    .map((skill) => `- ${skill.en}`)
    .join('\n')
  return `# ${project.name}\n\n${project.description.en}\n\n## Skills\n\n${skills}\n\n[Visit project](${project.url})`
}

const program = Effect.gen(function* () {
  const db = yield* getDbClient('libsql')
  const core = yield* makeStudioCMSSDKCoreLive({
    db,
    defaults: {
      GhostUserDefaults,
      NotificationSettingsDefaults,
    },
    cache: {
      store: new Map(),
      tagIndex: new Map(),
    },
    storageManagerResolver: async (identifier: string) => identifier,
  })
  const { AUTH, GET, POST } = core

  let author = (yield* GET.users.all())[0]
  if (!author) {
    const email =
      process.env.SEED_ADMIN_EMAIL ?? 'jonas@jonasperusquia.com'
    const username = process.env.SEED_ADMIN_USERNAME ?? 'jonaspm'
    const password = process.env.SEED_ADMIN_PASSWORD
    if (!password) {
      throw new Error(
        'No users found in database. Set SEED_ADMIN_PASSWORD (and optionally SEED_ADMIN_EMAIL, SEED_ADMIN_USERNAME) and re-run.',
      )
    }
    const { hashPassword } = yield* Effect.gen(function* () {
      const passwordConfig = yield* PasswordModOptions
      const scrypt = yield* makeScrypt(passwordConfig)
      const { hashPassword } = yield* Password(scrypt)
      return { hashPassword }
    }).pipe(
      Effect.provide(
        PasswordModOptions.Live({
          CMS_ENCRYPTION_KEY: process.env.CMS_ENCRYPTION_KEY ?? '',
        }),
      ),
    )
    const hashedPassword = yield* hashPassword(password)
    const now = new Date().toISOString()
    author = yield* AUTH.user.create(
      {
        id: crypto.randomUUID(),
        name: 'Jonas Perusquia Morales',
        email,
        username,
        password: hashedPassword,
        updatedAt: now,
        createdAt: now,
        emailVerified: true,
      },
      'owner',
    )
    console.log(`Created admin user "${username}"`)
  } else {
    console.log(`Using existing user "${author.username}"`)
  }

  const existingCategories = yield* GET.categories.getAll()
  const categoryBySlug = new Map(
    existingCategories.map((category) => [category.slug, category]),
  )
  const ensureCategory = (slug: string, name: string) =>
    Effect.gen(function* () {
      if (!categoryBySlug.has(slug)) {
        const created = yield* POST.databaseEntry.categories({
          name,
          slug,
          description: '',
          meta: '{}',
        })
        categoryBySlug.set(slug, created)
        console.log(`Created category "${name}"`)
      }
      return categoryBySlug.get(slug)
    })

  yield* ensureCategory('project', 'Project')
  yield* ensureCategory('article', 'Article')

  yield* Effect.promise(async () => {
    await db.db
      .updateTable('StudioCMSPageData')
      .set({ package: 'studiocms/markdown' })
      .where('package', '=', 'default')
      .execute()

    const rows = await db.db
      .selectFrom('StudioCMSPageData')
      .select(['id', 'categories', 'tags'])
      .execute()
    for (const row of rows) {
      const categories = JSON.parse(row.categories).map(Number)
      const tags = JSON.parse(row.tags).map(Number)
      await db.db
        .updateTable('StudioCMSPageData')
        .set({
          categories: JSON.stringify(categories),
          tags: JSON.stringify(tags),
        })
        .where('id', '=', row.id)
        .execute()
    }
  })

  const existingTags = yield* GET.tags.getAll()
  const tagBySlug = new Map(existingTags.map((tag) => [tag.slug, tag]))
  const ensureTag = (name: string) =>
    Effect.gen(function* () {
      const slug = slugify(name)
      if (!tagBySlug.has(slug)) {
        const created = yield* POST.databaseEntry.tags({
          name,
          slug,
          description: '',
          meta: '{}',
        })
        tagBySlug.set(slug, created)
      }
      return tagBySlug.get(slug)
    })

  for (const { file, project } of projectEntries) {
    const tagIds: string[] = []
    for (const skill of project.skills) {
      const tag = yield* ensureTag(skill.en)
      if (tag) tagIds.push(String(tag.id))
    }

    const projectCategory = categoryBySlug.get('project')
    if (!projectCategory) throw new Error('Category "project" missing')

    const now = new Date().toISOString()
    const slug = slugify(project.name)

    const existing = yield* GET.page.bySlug(slug, true)
    if (existing) {
      console.log(`Skipping "${project.name}" (page "${slug}" exists)`)
      continue
    }

    yield* POST.databaseEntry.pages(
      {
        title: project.name,
        slug,
        description: project.description.en,
        package: 'studiocms/markdown',
        showOnNav: false,
        publishedAt: now,
        updatedAt: now,
        contentLang: 'en',
        heroImage: null,
        categories: JSON.stringify([projectCategory.id]),
        tags: JSON.stringify(tagIds.map(Number)),
        authorId: author.id,
        contributorIds: '[]',
        showAuthor: true,
        showContributors: false,
        draft: false,
        augments: '[]',
      },
      {
        contentLang: 'en',
        content: buildMarkdown(project),
      },
    )
    console.log(`Seeded page "${slug}" (${project.name})`)
  }

  console.log('Seed complete.')
})

try {
  await runEffect(program)
} catch (error) {
  console.error('Seed failed:', error)
  process.exit(1)
}
