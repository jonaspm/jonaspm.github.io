import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Configure GSAP for optimal performance
gsap.config({
  force3D: true,
  nullTargetWarn: false
});

export function initGSAPAnimations() {

  // Remove opacity-0 class from section elements
  for (const section of document.querySelectorAll('section')) {  
    section.classList.remove('opacity-0');
  }
  
  // Set initial state for skill cards with hardware acceleration
  gsap.set('.skill-card', { 
    opacity: 0, 
    y: 20,
    force3D: true
  });
  
  // Animate skill cards with batched ScrollTrigger and stagger
  ScrollTrigger.batch('.skill-card', {
    preventOverlaps: true, // Prevents animations from overlapping
    onEnter: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.4,
      ease: 'power1.out',
      force3D: true,
      overwrite: 'auto'
    }),
    onLeave: batch => gsap.to(batch, {
      opacity: 0,
      overwrite: 'auto'
    }),
    onEnterBack: batch => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power1.out',
      overwrite: 'auto'
    }),
    onLeaveBack: batch => gsap.to(batch, {
      opacity: 0,
      overwrite: 'auto'
    }),
    start: 'top 90%',
    end: 'bottom 10%'
  });
  
  // Animate elements with fade-up effect on scroll
  gsap.utils.toArray('.gsap-fade-up').forEach((element) => {
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 20
      },
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
          fastScrollEnd: true // Speeds up ending for fast scrolls
        }
      }
    );
  });

  // Animate elements with fade-up noreverse effect on scroll
  gsap.utils.toArray('.gsap-fade-up-noreverse').forEach((element) => {
    gsap.fromTo(element, 
      {
        opacity: 0,
        y: 20
      },
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
          fastScrollEnd: true
        }
      }
    );
  });

  // Animate elements with staggered delays for hero section
  gsap.fromTo('.gsap-hero-stagger',
    {
      opacity: 0,
      y: 20,
    },
    {
      stagger: 0.12,
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power1.out',
      force3D: true,
      clearProps: 'transform' // Clears transform after animation
    }
  );
}

// Cleanup function to kill all animations and ScrollTriggers
export function cleanupGSAPAnimations() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.globalTimeline.clear();
}

// Initialize animations when DOM is ready
document.addEventListener('astro:page-load', () => {
  // Clean up any existing animations first
  cleanupGSAPAnimations();
  initGSAPAnimations();
});
