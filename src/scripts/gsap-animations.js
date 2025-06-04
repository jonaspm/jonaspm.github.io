// src/scripts/gsap-animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  
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
  });  // Animate sections with a slight scale effect
  gsap.utils.toArray('.gsap-section').forEach((element) => {
    // Check if the element has id="contact" to avoid reversing animation
    const isContactSection = element.id === 'contact';
    const toggleActions = isContactSection ? 'play none play none' : 'play reverse play reverse';
    
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
          toggleActions: toggleActions
        }
      }
    );
  });
}

// Initialize animations when DOM is ready
document.addEventListener('astro:page-load', () => {
  initGSAPAnimations();
});
