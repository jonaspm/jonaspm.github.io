import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.config({
	force3D: true,
	nullTargetWarn: false,
})

let mm = null

export function initGSAPAnimations() {
	mm = gsap.matchMedia()

	mm.add('(prefers-reduced-motion: reduce)', () => {
		for (const section of document.querySelectorAll('section')) {
			section.classList.remove('opacity-0')
		}
		gsap.set(
			[
				'.skill-card',
				'.gsap-fade-up',
				'.gsap-fade-up-noreverse',
				'.gsap-hero-stagger',
			],
			{
				opacity: 1,
				y: 0,
				clearProps: 'all',
			},
		)
	})

	mm.add('(prefers-reduced-motion: no-preference)', () => {
		for (const section of document.querySelectorAll('section')) {
			section.classList.remove('opacity-0')
		}

		gsap.set('.skill-card', {
			opacity: 0,
			y: 20,
			force3D: true,
		})

		ScrollTrigger.batch('.skill-card', {
			preventOverlaps: true,
			onEnter: (batch) =>
				gsap.to(batch, {
					opacity: 1,
					y: 0,
					stagger: 0.08,
					duration: 0.4,
					ease: 'power1.out',
					force3D: true,
					overwrite: 'auto',
				}),
			onLeave: (batch) =>
				gsap.to(batch, {
					opacity: 0,
					duration: 0.2,
					overwrite: 'auto',
				}),
			onEnterBack: (batch) =>
				gsap.to(batch, {
					opacity: 1,
					y: 0,
					duration: 0.3,
					ease: 'power1.out',
					overwrite: 'auto',
				}),
			onLeaveBack: (batch) =>
				gsap.to(batch, {
					opacity: 0,
					duration: 0.2,
					overwrite: 'auto',
				}),
			start: 'top 90%',
			end: 'bottom 10%',
		})

		gsap.utils.toArray('.gsap-fade-up').forEach((element) => {
			gsap.fromTo(
				element,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power1.out',
					force3D: true,
					scrollTrigger: {
						trigger: element,
						start: 'top 85%',
						end: 'bottom 15%',
						toggleActions: 'play reverse play reverse',
						fastScrollEnd: true,
					},
				},
			)
		})

		gsap.utils.toArray('.gsap-fade-up-noreverse').forEach((element) => {
			gsap.fromTo(
				element,
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power1.out',
					force3D: true,
					scrollTrigger: {
						trigger: element,
						start: 'top 85%',
						end: 'bottom 15%',
						toggleActions: 'play none play none',
						fastScrollEnd: true,
					},
				},
			)
		})

		gsap.fromTo(
			'.gsap-hero-stagger',
			{ opacity: 0, y: 20 },
			{
				stagger: 0.12,
				opacity: 1,
				y: 0,
				duration: 0.5,
				ease: 'power1.out',
				force3D: true,
				clearProps: 'transform',
			},
		)
	})
}

export function cleanupGSAPAnimations() {
	if (mm) {
		mm.revert()
		mm = null
	}
}

document.addEventListener('astro:page-load', () => {
	cleanupGSAPAnimations()
	initGSAPAnimations()
})
