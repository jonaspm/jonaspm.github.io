export type Language = 'en' | 'es' | 'eo'

export interface NavigationItem {
	id: string
	label: string
}

export interface ProjectViewModel {
	name: string
	url: string
	image: string
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
		scrollToBioLabel: string
	}
	bio: {
		title: string
		paragraphs: string[]
	}
	skills: {
		title: string
	}
	projects: {
		title: string
	}
	contact: {
		title: string
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
				{ id: 'bio', label: 'Bio' },
				{ id: 'skills', label: 'Skills' },
				{ id: 'projects', label: 'Projects' },
				{ id: 'contact', label: 'Contact' },
			],
			ariaLabel: 'Main navigation',
			languageLabel: 'Language',
		},
		home: {
			title: 'Jonas Perusquia Morales',
			role: 'Msc. Data Science & Software Engineer',
			subtitle: 'Chief Technology Officer',
			description:
				'Innovative tech leader with a passion for building scalable solutions and fostering high-performing teams.',
			scrollToBioLabel: 'Scroll to Bio Section',
		},
		bio: {
			title: 'About Me',
			paragraphs: [
				"With a passion for technology and over eight years of experience in web development, I've dedicated myself to adopting and implementing the latest industry trends and tools. My portfolio includes a diverse range of cloud projects spanning websites, mobile applications, and desktop software.",
				'As a self-taught perfectionist and natural leader, I bring strong problem-solving abilities to every project I undertake. My consistently positive, motivating, and inclusive approach enables me to thrive in collaborative environments where knowledge sharing is valued.',
				'Beyond the professional realm, I find balance through music, sports, and quality time with family.',
			],
		},
		skills: {
			title: 'Skills & Expertise',
		},
		projects: {
			title: 'Featured Projects',
		},
		contact: {
			title: 'Get in Touch',
		},
		footer: 'Made with love from Chihuahua, Mexico.',
		seo: {
			home: {
				title:
					'Jonas Perusquia Morales - Msc. Data Science & Software Engineer',
				description:
					'Welcome to the portfolio of Jonas Perusquia Morales, a Msc. Data Science & Software Engineer and Chief Technology Officer specializing in full-stack development, cloud architecture, and leading high-performing engineering teams.',
				keywords: [
					'Jonas Perusquia Morales',
					'CTO',
					'Chief Technology Officer',
					'Msc',
					'Data Science',
					'Msc. Data Science',
					'Software Engineer',
					'Web Developer',
					'Full Stack Developer',
					'Cloud Architecture',
					'Team Leadership',
					'JavaScript',
					'TypeScript',
					'React',
					'Node.js',
					'Astro',
					'Portfolio',
					'Personal Website',
					'Technology Leadership',
					'Software Development',
				],
				structuredDescription:
					'Msc. Data Science & Software Engineer and Chief Technology Officer with expertise in full-stack development, cloud architecture, and team leadership.',
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
				{ id: 'bio', label: 'Bio' },
				{ id: 'skills', label: 'Habilidades' },
				{ id: 'projects', label: 'Proyectos' },
				{ id: 'contact', label: 'Contacto' },
			],
			ariaLabel: 'Navegacion principal',
			languageLabel: 'Idioma',
		},
		home: {
			title: 'Jonas Perusquia Morales',
			role: 'MSc. en Ciencia de Datos e Ingeniero de Software',
			subtitle: 'Chief Technology Officer',
			description:
				'Lider tecnologico enfocado en construir soluciones escalables y en impulsar equipos de alto desempeno.',
			scrollToBioLabel: 'Ir a la seccion de bio',
		},
		bio: {
			title: 'Sobre mi',
			paragraphs: [
				'Con una fuerte pasion por la tecnologia y mas de ocho anos de experiencia en desarrollo web, me he dedicado a adoptar e implementar las tendencias y herramientas mas recientes de la industria. Mi portafolio incluye una amplia variedad de proyectos en la nube que abarcan sitios web, aplicaciones moviles y software de escritorio.',
				'Como perfeccionista autodidacta y lider natural, aporto una gran capacidad de resolucion de problemas a cada proyecto en el que participo. Mi enfoque positivo, motivador e inclusivo me permite rendir bien en entornos colaborativos donde compartir conocimiento es parte del trabajo.',
				'Fuera del trabajo, encuentro equilibrio en la musica, el deporte y el tiempo de calidad con mi familia.',
			],
		},
		skills: {
			title: 'Habilidades y experiencia',
		},
		projects: {
			title: 'Proyectos destacados',
		},
		contact: {
			title: 'Ponte en contacto',
		},
		footer: 'Hecho con amor desde Chihuahua, Mexico.',
		seo: {
			home: {
				title:
					'Jonas Perusquia Morales - MSc. en Ciencia de Datos e Ingeniero de Software',
				description:
					'Bienvenido al portafolio de Jonas Perusquia Morales, MSc. en Ciencia de Datos e Ingeniero de Software y Chief Technology Officer enfocado en desarrollo full stack, arquitectura en la nube y liderazgo de equipos de alto desempeno.',
				keywords: [
					'Jonas Perusquia Morales',
					'CTO',
					'Chief Technology Officer',
					'MSc',
					'Ciencia de Datos',
					'MSc. Ciencia de Datos',
					'Ingeniero de Software',
					'Desarrollador Web',
					'Desarrollador Full Stack',
					'Arquitectura en la nube',
					'Liderazgo tecnico',
					'JavaScript',
					'TypeScript',
					'React',
					'Node.js',
					'Astro',
					'Portafolio',
					'Sitio personal',
					'Liderazgo tecnologico',
					'Desarrollo de software',
				],
				structuredDescription:
					'MSc. en Ciencia de Datos e Ingeniero de Software y Chief Technology Officer con experiencia en desarrollo full stack, arquitectura en la nube y liderazgo de equipos.',
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
				{ id: 'bio', label: 'Biografio' },
				{ id: 'skills', label: 'Kapabloj' },
				{ id: 'projects', label: 'Projektoj' },
				{ id: 'contact', label: 'Kontakto' },
			],
			ariaLabel: 'Cxefa navigado',
			languageLabel: 'Lingvo',
		},
		home: {
			title: 'Jonas Perusquia Morales',
			role: 'MSc. Datumscienco & Programara Ingeniero',
			subtitle: 'Chief Technology Officer',
			description:
				'Nova teknologia gvidanto kun pasio por konstrui skaleblajn solvojn kaj kreskigi alt-efikecajn teamojn.',
			scrollToBioLabel: 'Rulumu al Biografio',
		},
		bio: {
			title: 'Pri mi',
			paragraphs: [
				'Kun pasio por teknologio kaj pli ol ok jaroj da sperto en reteja disvolvigo, mi dedicxis min al adoptado kaj efektivigado de la plej novaj industriaj tendencoj kaj iloj. Mia portfolio inkluzivas diversan gamon da nubaj projektoj, inkluzive de retejoj, moveblaj aplikaĵoj kaj labortabla programaro.',
				'Kiel memlernanta perfektisto kaj natura gvidanto, mi alportas fortajn problem-solvantajn kapablojn al ĉiu projekto. Mia konstante pozitiva, motiviga kaj inkluziva aliro ebligas min prosperi en kunlaboraj medioj kie dividi scion estas aprezata.',
				'Ekster la profesia sfero, mi trovas ekvilibron per muziko, sporto kaj kvalita tempo kun familio.',
			],
		},
		skills: {
			title: 'Kapabloj & Sperto',
		},
		projects: {
			title: 'Elstaraj Projektoj',
		},
		contact: {
			title: 'Kontaktu min',
		},
		footer: 'Farita kun amo el Chihuahua, Meksiko.',
		seo: {
			home: {
				title:
					'Jonas Perusquia Morales - MSc. Datumscienco & Programara Ingeniero',
				description:
					'Bonvenon al la portfolio de Jonas Perusquia Morales, MSc. Datumscienco & Programara Ingeniero kaj Chief Technology Officer specialigxanta pri plen-staka disvolvigo, nuba arkitekturo kaj gvidado de alt-efikecaj ingenieraj teamoj.',
				keywords: [
					'Jonas Perusquia Morales',
					'CTO',
					'Chief Technology Officer',
					'MSc',
					'Datumscienco',
					'MSc. Datumscienco',
					'Programara Ingeniero',
					'Reteja Disvolvisto',
					'Plen-Staka Disvolvisto',
					'Nuba Arkitekturo',
					'Teama Gvidado',
					'JavaScript',
					'TypeScript',
					'React',
					'Node.js',
					'Astro',
					'Portfolio',
					'Persona Retejo',
					'Teknologia Gvidado',
					'Programara Disvolvigo',
				],
				structuredDescription:
					'MSc. Datumscienco & Programara Ingeniero kaj Chief Technology Officer kun sperto pri plen-staka disvolvigo, nuba arkitekturo kaj teama gvidado.',
			},
		},
	},
}

export function getTranslations(language: Language): Translations {
	return translations[language]
}
