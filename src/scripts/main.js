import { Engine, Loader } from './core/index.js';
import { setupWorld } from './world.js';
import { setupAnimations } from './animations.js';
import { setupPainRotator } from './painRotator.js';

async function init() {
  const engine = new Engine('webgl');
  const loader = new Loader();

  const loaderEl = document.getElementById('loader');
  const fillEl = document.querySelector('.loader-bar-fill');

  // No assets yet — empty manifest. Progress still reports 0 → 1.
  const manifest = {};
  const assets = await loader.loadManifest(manifest, (progress) => {
    if (fillEl) fillEl.style.width = `${Math.round(progress * 100)}%`;
  });

  // Build the scene and wire up scroll animations.
  const components = await setupWorld(engine, assets);
  setupAnimations(engine, components);

  // Rotating hero announcement bar (pain points).
  setupPainRotator();

  // Enquiry form → Google Sheets (Apps Script Web App). Posts the fields and
  // shows a thank-you message without navigating away.
  const enquiry = document.querySelector('.enquiry-form');
  if (enquiry) {
    const status = enquiry.querySelector('.form-status');
    const submitBtn = enquiry.querySelector('.enquiry-submit');

    // --- Live validation for phone + email ---
    const phoneInput = enquiry.querySelector('#enq-phone');
    const emailInput = enquiry.querySelector('#enq-email');
    const errPhone = enquiry.querySelector('#err-phone');
    const errEmail = enquiry.querySelector('#err-email');

    const showFieldError = (input, errEl, message) => {
      input.setCustomValidity(message);
      input.classList.toggle('is-invalid', !!message);
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errEl) errEl.textContent = message;
    };

    const validatePhone = () => {
      const value = phoneInput.value.trim();
      if (value === '') return showFieldError(phoneInput, errPhone, '');
      // strip spaces, dashes and a leading +; accept optional 0 / 91 prefix
      const digits = value.replace(/[\s-]/g, '').replace(/^\+/, '');
      const ok = /^(0|91)?[6-9]\d{9}$/.test(digits);
      showFieldError(
        phoneInput,
        errPhone,
        ok ? '' : 'Enter a valid 10-digit mobile number.'
      );
    };

    const validateEmail = () => {
      const value = emailInput.value.trim();
      if (value === '') return showFieldError(emailInput, errEmail, '');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      showFieldError(
        emailInput,
        errEmail,
        ok ? '' : 'Enter a valid email address.'
      );
    };

    if (phoneInput) {
      phoneInput.addEventListener('input', validatePhone);
      phoneInput.addEventListener('blur', validatePhone);
    }
    if (emailInput) {
      emailInput.addEventListener('input', validateEmail);
      emailInput.addEventListener('blur', validateEmail);
    }
    const setStatus = (text, success = false) => {
      if (!status) return;
      status.textContent = text;
      status.classList.toggle('is-success', success);
    };

    enquiry.addEventListener('submit', async (event) => {
      event.preventDefault();
      validatePhone();
      validateEmail();
      if (!enquiry.checkValidity()) {
        enquiry.reportValidity();
        return;
      }
      const endpoint = enquiry.getAttribute('action');
      if (!endpoint || endpoint === 'GOOGLE_SHEET_WEBAPP_URL') {
        setStatus('Form is not connected yet. Please call or WhatsApp us.');
        return;
      }
      if (submitBtn) submitBtn.disabled = true;
      setStatus('Sending…');
      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors', // Apps Script doesn't send CORS headers
          body: new FormData(enquiry),
        });
        enquiry.reset();
        setStatus("Thank you! We'll call you back soon.", true);
        // Meta Pixel conversion
        if (window.fbq) window.fbq('track', 'Lead');
      } catch (err) {
        setStatus('Something went wrong. Please call or WhatsApp us.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Hide the floating "Book a call" CTA while the hero is on screen
  // (the hero already shows that button); reveal it for the other sections.
  const bookFab = document.querySelector('.book-fab');
  const heroEl = document.getElementById('hero');
  if (bookFab && heroEl && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([entry]) => bookFab.classList.toggle('is-hidden', entry.isIntersecting),
      { threshold: 0.35 }
    );
    io.observe(heroEl);
  }

  // Enforce a minimum loader display so it doesn't flash.
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (loaderEl) loaderEl.classList.add('loaded');

  engine.start();

  // Optional performance overlay: append ?debug to the URL.
  if (new URLSearchParams(window.location.search).has('debug')) {
    const { Debug } = await import('./core/Debug.js');
    const debug = new Debug(engine);
    debug.show();
    engine.components.push({ update: () => debug.update() });
  }
}

init();
