import '@/styles/MainBody.css'
import Box from '@/components/Box.tsx'
import { useEffect, useState } from 'react'
import type { GetImageResult } from 'astro'

type Project = {
	name: string
	description: string
	image: GetImageResult
	url: string
}

function MainBody({ projects }: { projects: Project[] }) {

	const skills = [
		'HTML-CSS-JavaScript',
		'TypeScript',
		'Svelte',
		'React',
		'AngularJS',
		'Next.js',
		'Astro',
		'Node.js',
		'Express',
		'SQL Databases',
		'MongoDB',
		'ServiceNOW',
		'Version Control',
		'Agile Methodologies',
		'Project Management',
		'Cloud Computing',
	]

	const aboutText =
		'Software Engineer whose passion for technology and web development drives him to constantly learn and use the latest tools and trends in the industry. Has strong leadership, self-learning, problem-solving and perfectionism skills, as well as a positive, motivating and integrative attitude. He enjoys working in a team and sharing my knowledge and experiences with other professionals. In addition to technology, he has interests in music, sports, family, friends, movies, tv series and video games. Feel free to contact him if it is your desire to know more about his projects.'
	const backgroundText =
		'With over 7 years of work experience enhancing the digital experience of people through innovative & cutting-edge technology solutions. Has collaborated with various clients and delivered cloud-based technology projects, including web, mobile and desktop applications.'
	const [delays, setDelays] = useState([1, 2, 3, 4])

	useEffect(() => {
		const boxes = document.querySelectorAll('.body')
		const observer = new IntersectionObserver(
			(entries) => {
				const intersectingEntries = entries.filter(
					(entry) => entry.isIntersecting,
				)
				if (intersectingEntries.length < 2) setDelays([0, 0, 0, 0])
				for (const entry of intersectingEntries) {
					entry.target.classList.add('animate-fade-in')
					observer.unobserve(entry.target)
				}
			},
			{ threshold: 0.5, root: null, rootMargin: '0px' },
		)
		for (const box of boxes) observer.observe(box)
		return () => {
			observer.disconnect()
		}
	}, [])

	return (
		<div className="mainBody max-w-7xl">
			<Box
				style={{ '--delay-index': delays[0] }}
				className="body opacity-0 flex flex-col mt-6 items-center shadow-lg hover:bg-secondary/60 transition-all duration-700"
			>
				<h2 className="text-center text-xl font-bold">About me</h2>
				<div className="text-justify m-4">{aboutText}</div>
			</Box>

			<Box
				style={{ '--delay-index': delays[1] }}
				className="body opacity-0 flex flex-col items-center shadow-lg hover:bg-secondary/60 transition-all duration-700"
			>
				<h2 className="text-center text-xl font-bold">Background</h2>
				<div className="m-4 text-justify">{backgroundText}</div>
			</Box>

			<Box
				style={{ '--delay-index': delays[2] }}
				className="body opacity-0 flex flex-col shadow-lg hover:bg-secondary/60 transition-all duration-700"
			>
				<h2 className="text-center text-xl font-bold">Projects</h2>
				<div className="m-4">
					<ul className="flex justify-center gap-8 flex-row flex-wrap">
						{
							projects.map((project, index) => (
									<li key={index} className="project flex w-5/6 xs:w-48 flex-col align-center">
										<a
											className="link flex flex-col items-center text-center p-4 shadow-md rounded-md tra transition-transform duration-200 bg-secondary/30"
											href={project.url}
										>
											<span>{project.name}</span>
											<img
												className="w-full rounded-[4px] object-contain transition-transform duration-200 delay-150 my-2"
												src={project.image.src}
												alt={project.name}
											/>
											<span className="text-sm">{project.description}</span>
										</a>
									</li>
								)
							)
						}
					</ul>
				</div>
			</Box>

			<Box
				style={{ '--delay-index': delays[3] }}
				className="body opacity-0 flex flex-col mb-6 items-center shadow-lg hover:bg-secondary/60 transition-all duration-700"
			>
				<h2 className="text-center text-xl font-bold">Skills</h2>
				<div className="m-4">
					<ul className="flex flex-row list items-center justify-center gap-8 flex-wrap">
						{skills.map((skill, index) => {
							return (
								<li key={index} className="flex flex-col align-center">
									{skill}
								</li>
							)
						})}
					</ul>
				</div>
			</Box>
		</div>
	)
}

export default MainBody
