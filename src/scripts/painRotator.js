// Auto-advancing announcement bar for the hero pain points.
// Shows one card at a time in the same space, sliding to the next.

/**
 * Wire up the hero pain-point rotator.
 * @param {object} [opts]
 * @param {number} [opts.interval] — ms between slides
 * @returns {() => void} cleanup function
 */
export function setupPainRotator({ interval = 3200 } = {}) {
  const rotator = document.querySelector('.pain-rotator');
  if (!rotator) return () => {};

  const slides = Array.from(rotator.querySelectorAll('.pain-card'));
  if (slides.length < 2) return () => {};

  let index = 0;
  let timer = null;

  const advance = () => {
    const outgoing = slides[index];
    outgoing.classList.remove('is-active');
    outgoing.classList.add('is-prev');

    const leaving = index;
    index = (index + 1) % slides.length;

    const incoming = slides[index];
    incoming.classList.remove('is-prev');
    incoming.classList.add('is-active');

    // Reset the just-left slide to its waiting position once it's off-screen.
    window.setTimeout(() => slides[leaving].classList.remove('is-prev'), 600);
  };

  const start = () => {
    stop();
    timer = window.setInterval(advance, interval);
  };
  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  // Pause on hover so users can read.
  rotator.addEventListener('mouseenter', stop);
  rotator.addEventListener('mouseleave', start);

  start();

  return () => {
    stop();
    rotator.removeEventListener('mouseenter', stop);
    rotator.removeEventListener('mouseleave', start);
  };
}
