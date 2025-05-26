// src/scripts/gsap-animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  if (typeof window === 'undefined') return;
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
          start: 'top 80%',
          end: 'bottom 10%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  });

  // Animate elements with staggered delays for hero section
  gsap.utils.toArray('.gsap-hero-stagger').forEach((element, index) => {
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
        delay: index * 0.2
      }
    );
  });
  // Animate sections with a slight scale effect
  gsap.utils.toArray('.gsap-section').forEach((element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.95
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  });
}

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initGSAPAnimations();
});
