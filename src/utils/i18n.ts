import type { MediaValue } from 'emdash'

export type Language = 'en' | 'es' | 'eo'

export interface NavigationItem {
	id: string
	label: string
	href?: string
}

export interface PostViewModel {
	slug: string
	title: string
	category: 'project' | 'article'
	url?: string
	// EmDash media shape; rendered through `PostImage` (never a raw URL here).
	media?: MediaValue | null
	date?: string
	summary: string
	body: string
	skills: string[]
}

export interface ProjectViewModel {
	/** Bare post slug; joined into `/portfolio/{slug}` via `portfolioDetailPath`. */
	slug: string
	name: string
	url: string
	media: MediaValue | null
	description: string
	skills: string[]
}

export interface Translations {
	language: Language
	locale: string
	navigation: {
		brand: string
		items: NavigationItem[]
		ariaLabel: string
		languageLabel: string
	}
	home: {
		title: string
		role: string
		subtitle: string
		description: string
		ctaPrimary: string
		ctaSecondary: string
		scrollToBioLabel: string
	}
	bio: {
		title: string
		paragraphs: string[]
	}
	skills: {
		title: string
	}
	experience: {
		title: string
		present: string
	}
	credentials: {
		title: string
		certifications: string
		education: string
		honors: string
		languages: string
		community: string
	}
	projects: {
		title: string
		external: string
	}
	portfolio: {
		title: string
		description: string
		filterAll: string
		filterProjects: string
		filterArticles: string
		empty: string
		backToHome: string
		readMore: string
	}
	contact: {
		title: string
		fallbackIntro: string
		emailLabel: string
		bookingLabel: string
		embedError: string
	}
	footer: string
	seo: {
		home: {
			title: string
			description: string
			keywords: string[]
			structuredDescription: string
		}
	}
}

const translations: Record<Language, Translations> = {
	en: {
		language: 'en',
		locale: 'en_US',
		navigation: {
			brand: 'Jonas PM',
			items: [
				{ id: 'home', label: 'Home' },
				{ id: 'bio', label: 'About' },
				{ id: 'skills', label: 'Skills' },
				{ id: 'experience', label: 'Experience' },
				{ id: 'credentials', label: 'Credentials' },
				{ id: 'portfolio', label: 'Portfolio', href: '/portfolio' },
				{ id: 'contact', label: 'Contact' },
			],
			ariaLabel: 'Main navigation',
			languageLabel: 'Language',
		},
		home: {
			title: 'Jonás Perusquía Morales',
			role: 'ServiceNow Developer & Technical Lead',
			subtitle: 'Chief Technology Officer @ Blueway Group',
			description:
				'I lead IT and ServiceNow consulting at Blueway Group — architecture, implementation and advisory — backed by 8+ years of full-stack development, cloud projects, and an MSc in Applied Data Science.',
			ctaPrimary: 'Get in Touch',
			ctaSecondary: 'View Portfolio',
			scrollToBioLabel: 'Scroll to About Section',
		},
		bio: {
			title: 'About Me',
			paragraphs: [
				"ServiceNow developer and technical leader with hands-on ServiceNow custom development and consulting experience since 2018. Today I'm the Chief Technology Officer at Blueway Group, leading IT and ServiceNow consulting — architecture, implementation and advisory — across client engagements.",
				'Before Blueway I built ServiceNow customizations and plugins for enterprise clients at Concentrix Catalyst, ProKarma and Gamma Partners, and later led delivery and hired ServiceNow developers at Enerlinq Innovations. Along the way: 8+ years of full-stack web development, cloud projects spanning web, mobile and desktop, and an MSc in Applied Data Science.',
				'Self-taught and problem-solving by nature, I set technical direction, manage projects end to end, and build collaborative teams where knowledge sharing is the norm.',
				'Beyond the screen, I find balance in music, sports, and quality time with my family.',
			],
		},
		skills: {
			title: 'Skills & Expertise',
		},
		experience: {
			title: 'Experience',
			present: 'Present',
		},
		credentials: {
			title: 'Credentials',
			certifications: 'Certifications',
			education: 'Education',
			honors: 'Honors & Awards',
			languages: 'Languages',
			community: 'Community & Speaking',
		},
		projects: {
			title: 'Featured Projects',
			external: 'Live site',
		},
		portfolio: {
			title: 'Portfolio',
			description:
				'A collection of projects, articles, and experiments I have worked on.',
			filterAll: 'All',
			filterProjects: 'Projects',
			filterArticles: 'Articles',
			empty: 'No posts found for this category.',
			backToHome: 'Back to Home',
			readMore: 'Read more',
		},
		contact: {
			title: 'Get in Touch',
			fallbackIntro: 'Or reach me directly — happy to chat over email:',
			emailLabel: 'Email me',
			bookingLabel: 'Book a 15-minute meeting',
			embedError:
				"The scheduling widget couldn't load. Use the links below instead.",
		},
		footer: 'Made with love from Chihuahua, Mexico.',
		seo: {
			home: {
				title:
					'Jonás Perusquía Morales — ServiceNow Developer & Technical Lead',
				description:
					'Portfolio of Jonás Perusquía Morales, ServiceNow Developer & Technical Lead and CTO at Blueway Group: ServiceNow architecture, implementation and advisory, full-stack development, and technical leadership.',
				keywords: [
					'Jonás Perusquía Morales',
					'Jonas Perusquia Morales',
					'ServiceNow',
					'ServiceNow Developer',
					'ServiceNow CSA',
					'Technical Lead',
					'CTO',
					'Blueway Group',
					'Solution Architecture',
					'Full-Stack Development',
					'TypeScript',
					'Cloudflare',
					'Portfolio',
					'Chihuahua',
				],
				structuredDescription:
					'ServiceNow Developer & Technical Lead and Chief Technology Officer at Blueway Group, specializing in ServiceNow architecture, implementation and advisory since 2018.',
			},
		},
	},
	es: {
		language: 'es',
		locale: 'es_MX',
		navigation: {
			brand: 'Jonas PM',
			items: [
				{ id: 'home', label: 'Inicio' },
				{ id: 'bio', label: 'Sobre mí' },
				{ id: 'skills', label: 'Habilidades' },
				{ id: 'experience', label: 'Experiencia' },
				{ id: 'credentials', label: 'Credenciales' },
				{
					id: 'portfolio',
					label: 'Portafolio',
					href: '/es/portfolio',
				},
				{ id: 'contact', label: 'Contacto' },
			],
			ariaLabel: 'Navegacion principal',
			languageLabel: 'Idioma',
		},
		home: {
			title: 'Jonás Perusquía Morales',
			role: 'Desarrollador de ServiceNow y Líder Técnico',
			subtitle: 'Director de Tecnología (CTO) @ Blueway Group',
			description:
				'Lidero la consultoría de TI y ServiceNow en Blueway Group — arquitectura, implementación y asesoría — con más de 8 años de desarrollo full-stack, proyectos en la nube y una maestría en Ciencia de Datos Aplicada.',
			ctaPrimary: 'Ponte en contacto',
			ctaSecondary: 'Ver portafolio',
			scrollToBioLabel: 'Ir a la seccion de bio',
		},
		bio: {
			title: 'Sobre mi',
			paragraphs: [
				'Desarrollador de ServiceNow y líder técnico con experiencia práctica en desarrollo personalizado y consultoría de ServiceNow desde 2018. Hoy soy Director de Tecnología (CTO) en Blueway Group, donde lidero la consultoría de TI y ServiceNow — arquitectura, implementación y asesoría — para diversos clientes.',
				'Antes de Blueway desarrollé personalizaciones y plugins de ServiceNow para clientes empresariales en Concentrix Catalyst, ProKarma y Gamma Partners, y más tarde lideré la entrega y contraté desarrolladores de ServiceNow en Enerlinq Innovations. En el camino: más de 8 años de desarrollo web full-stack, proyectos en la nube para web, móvil y escritorio, y una maestría en Ciencia de Datos Aplicada.',
				'Autodidacta y resolutivo por naturaleza, fijo la dirección técnica, gestiono proyectos de principio a fin y construyo equipos colaborativos donde compartir conocimiento es la norma.',
				'Fuera de la pantalla, encuentro equilibrio en la música, el deporte y el tiempo de calidad con mi familia.',
			],
		},
		skills: {
			title: 'Habilidades y experiencia',
		},
		experience: {
			title: 'Experiencia',
			present: 'Actualidad',
		},
		credentials: {
			title: 'Credenciales',
			certifications: 'Certificaciones',
			education: 'Educación',
			honors: 'Honores y Premios',
			languages: 'Idiomas',
			community: 'Comunidad y Charlas',
		},
		projects: {
			title: 'Proyectos destacados',
			external: 'Sitio en vivo',
		},
		portfolio: {
			title: 'Portafolio',
			description:
				'Una coleccion de proyectos, articulos y experimentos en los que he trabajado.',
			filterAll: 'Todos',
			filterProjects: 'Proyectos',
			filterArticles: 'Articulos',
			empty: 'No hay publicaciones para esta categoria.',
			backToHome: 'Volver al inicio',
			readMore: 'Leer mas',
		},
		contact: {
			title: 'Ponte en contacto',
			fallbackIntro: 'O escríbeme directamente — con gusto platico por correo:',
			emailLabel: 'Envíame un correo',
			bookingLabel: 'Agenda una reunión de 15 minutos',
			embedError:
				'No se pudo cargar el widget de agenda. Usa los enlaces de abajo.',
		},
		footer: 'Hecho con amor desde Chihuahua, Mexico.',
		seo: {
			home: {
				title:
					'Jonás Perusquía Morales — Desarrollador de ServiceNow y Líder Técnico',
				description:
					'Portafolio de Jonás Perusquía Morales, Desarrollador de ServiceNow y Líder Técnico y CTO de Blueway Group: arquitectura, implementación y asesoría de ServiceNow, desarrollo full-stack y liderazgo técnico.',
				keywords: [
					'Jonás Perusquía Morales',
					'Jonas Perusquia Morales',
					'ServiceNow',
					'Desarrollador de ServiceNow',
					'ServiceNow CSA',
					'Líder Técnico',
					'CTO',
					'Blueway Group',
					'Arquitectura de soluciones',
					'Desarrollo Full-Stack',
					'TypeScript',
					'Cloudflare',
					'Portafolio',
					'Chihuahua',
				],
				structuredDescription:
					'Desarrollador de ServiceNow y Líder Técnico, Director de Tecnología (CTO) de Blueway Group, especializado en arquitectura, implementación y asesoría de ServiceNow desde 2018.',
			},
		},
	},
	eo: {
		language: 'eo',
		locale: 'eo',
		navigation: {
			brand: 'Jonas PM',
			items: [
				{ id: 'home', label: 'Hejmo' },
				{ id: 'bio', label: 'Pri mi' },
				{ id: 'skills', label: 'Kapabloj' },
				{ id: 'experience', label: 'Sperto' },
				{ id: 'credentials', label: 'Kvalifikoj' },
				{ id: 'portfolio', label: 'Portfolio', href: '/eo/portfolio' },
				{ id: 'contact', label: 'Kontakto' },
			],
			ariaLabel: 'Cxefa navigado',
			languageLabel: 'Lingvo',
		},
		home: {
			title: 'Jonás Perusquía Morales',
			role: 'ServiceNow-Disvolvisto kaj Teknika Gvidanto',
			subtitle: 'Ĉefo pri Teknologio (CTO) @ Blueway Group',
			description:
				'Mi gvidas IT- kaj ServiceNow-konsultadon ĉe Blueway Group — arkitekturo, efektivigo kaj konsilado — kun pli ol 8 jaroj da plen-staka disvolvigo, nubaj projektoj kaj magistro pri Aplika Datumscienco.',
			ctaPrimary: 'Kontaktu min',
			ctaSecondary: 'Vidi portfolion',
			scrollToBioLabel: 'Rulumu al Biografio',
		},
		bio: {
			title: 'Pri mi',
			paragraphs: [
				'ServiceNow-disvolvisto kaj teknika gvidanto kun praktika sperto pri ServiceNow-personaligita disvolvigo kaj konsultado depost 2018. Hodiaŭ mi estas Ĉefo pri Teknologio (CTO) ĉe Blueway Group, gvidante IT- kaj ServiceNow-konsultadon — arkitekturo, efektivigo kaj konsilado — por klientoj.',
				'Antaŭ Blueway mi konstruis ServiceNow-personaĵojn kaj kromaĵojn por entreprenaj klientoj ĉe Concentrix Catalyst, ProKarma kaj Gamma Partners, kaj poste gvidis liveradon kaj dungis ServiceNow-disvolvistojn ĉe Enerlinq Innovations. Dumvoje: pli ol 8 jaroj da plen-staka reteja disvolvigo, nubaj projektoj por reto, poŝaparatoj kaj labortablo, kaj magistro pri Aplika Datumscienco.',
				'Memlerna kaj nature problem-solvanta, mi fiksas teknikan direkton, estras projektojn de komenco ĝis fino kaj konstruas kunlaborajn teamojn, kie dividi scion estas la kutimo.',
				'Ekster la ekrano, mi trovas ekvilibron en muziko, sportoj kaj kvalita tempo kun mia familio.',
			],
		},
		skills: {
			title: 'Kapabloj & Sperto',
		},
		experience: {
			title: 'Sperto',
			present: 'Nun',
		},
		credentials: {
			title: 'Kvalifikoj',
			certifications: 'Atestoj',
			education: 'Eduko',
			honors: 'Honoroj kaj Premioj',
			languages: 'Lingvoj',
			community: 'Komunumo kaj Paroladoj',
		},
		projects: {
			title: 'Elstaraj Projektoj',
			external: 'Retejo',
		},
		portfolio: {
			title: 'Portfolio',
			description:
				'Kolekto de projektoj, artikoloj kaj eksperimentoj, kiujn mi faris.',
			filterAll: 'Ĉiuj',
			filterProjects: 'Projektoj',
			filterArticles: 'Artikoloj',
			empty: 'Neniu publikaĵo por ĉi tiu kategorio.',
			backToHome: 'Reen al Hejmo',
			readMore: 'Legi pli',
		},
		contact: {
			title: 'Kontaktu min',
			fallbackIntro: 'Aŭ skribu al mi rekte — mi volonte babilas retpoŝte:',
			emailLabel: 'Retpoŝtu min',
			bookingLabel: 'Rezervu 15-minutan renkontiĝon',
			embedError:
				'La programeto por planado ne ŝarĝiĝis. Uzu la ligilojn sube.',
		},
		footer: 'Farita kun amo el Chihuahua, Meksiko.',
		seo: {
			home: {
				title:
					'Jonás Perusquía Morales — ServiceNow-Disvolvisto kaj Teknika Gvidanto',
				description:
					'Portfolio de Jonás Perusquía Morales, ServiceNow-Disvolvisto kaj Teknika Gvidanto kaj CTO ĉe Blueway Group: ServiceNow-arkitekturo, efektivigo kaj konsilado, plen-staka disvolvigo kaj teknika gvidado.',
				keywords: [
					'Jonás Perusquía Morales',
					'Jonas Perusquia Morales',
					'ServiceNow',
					'ServiceNow-Disvolvisto',
					'ServiceNow CSA',
					'Teknika Gvidanto',
					'CTO',
					'Blueway Group',
					'Solva Arkitekturo',
					'Plen-Staka Disvolvigo',
					'TypeScript',
					'Cloudflare',
					'Portfolio',
					'Chihuahua',
				],
				structuredDescription:
					'ServiceNow-Disvolvisto kaj Teknika Gvidanto, Ĉefo pri Teknologio (CTO) ĉe Blueway Group, specialiĝinta pri ServiceNow-arkitekturo, efektivigo kaj konsilado depost 2018.',
			},
		},
	},
}

export function getTranslations(language: Language): Translations {
	return translations[language]
}
