/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@studiocms/markdown-remark/dist/integration/virtual" />

declare module 'studiocms:sdk' {
	export * from 'studiocms/sdk/base'
}

declare module 'studiocms:renderer' {
	export const StudioCMSRenderer: typeof import('studiocms/Renderer').default
}
