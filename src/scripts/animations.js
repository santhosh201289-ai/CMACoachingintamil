// ← CUSTOMIZE THIS FILE FOR EACH PROJECT
// CMA Coaching landing page scroll timeline.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Define scroll-driven animations tied to the 3D scene and content.
 *
 * @param {import('./core/index.js').Engine} engine
 * @param {Array} components — components returned from setupWorld
 * @returns {() => void} cleanup function that kills all ScrollTriggers
 */
export function setupAnimations(engine, components) {
  const hero = components[0];

  // --- Camera journey: drift the centrepiece across the funnel ---
  // Why CMA — ease back, slide the core toward centre.
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '#why',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
    .to(engine.camera.position, { z: 6.5 }, 0)
    .to(hero?.group?.position ?? {}, { x: 0 }, 0);

  // Courses — pull closer for emphasis.
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '#courses',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
    .to(engine.camera.position, { z: 5 });

  // Results — push the core away so the stats own the screen.
  gsap
    .timeline({
      scrollTrigger: {
        trigger: '#results',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
    .to(engine.camera.position, { z: 8 }, 0)
    .to(hero?.group?.position ?? {}, { x: -1.6 }, 0);

  // --- Section content reveal ---
  const reveal = gsap.utils.toArray(
    '.feature-card, .course-card, .faculty-card, .benefit-item, .testimonial-card, .stat'
  );
  reveal.forEach((el) => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // --- Animated stat counters ---
  gsap.utils.toArray('.stat-number').forEach((el) => {
    const target = Number(el.dataset.count) || 0;
    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = Math.round(counter.value).toLocaleString();
      },
    });
  });

  return () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
}
