import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {

  // Remove opacity-0 class from section elements
  for (const section of document.querySelectorAll('section')) {  
    section.classList.remove('opacity-0');
  }
  
  // Animate skill cards with batched ScrollTrigger and stagger
  ScrollTrigger.batch('.skill-card', {
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out'
    }),
    onLeave: batch => gsap.to(batch, {
      opacity: 0,
      y: 30,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.in'
    }),
    onEnterBack: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.out'
    }),
    onLeaveBack: batch => gsap.to(batch, {
      opacity: 0,
      y: 30,
      stagger: 0.05,
      duration: 0.5,
      ease: 'power2.in'
    }),
    start: 'top 90%',
    end: 'bottom 10%'
  });
  
  // Set initial state for skill cards
  gsap.set('.skill-card', { opacity: 0, y: 30 });
  
  // Animate elements with fade-up effect on scroll
  gsap.utils.toArray('.gsap-fade-up').forEach((element) => {
    
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          end: 'bottom 10%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  });

  // Animate elements with fade-up noreverse effect on scroll
  gsap.utils.toArray('.gsap-fade-up-noreverse').forEach((element) => {
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          end: 'bottom 10%',
          toggleActions: 'play none play none'
        }
      }
    );
  });

  // Animate elements with staggered delays for hero section
    gsap.fromTo('.gsap-hero-stagger',
      {
        opacity: 0,
        y: 30,
      },
      {
        stagger: 0.2,
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }
    );
}

// Initialize animations when DOM is ready
document.addEventListener('astro:page-load', () => {
  initGSAPAnimations();
});
