'use strict';

(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];


  // Subtle shadow when the premium sticky header has been scrolled.
  const pageHeader = $('header');
  if (pageHeader) {
    const updateHeaderState = () => pageHeader.classList.toggle('header-scrolled', window.scrollY > 14);
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, {passive:true});
  }

  // Navigation disclosures use the same state for visibility and accessibility.
  const menu = $('#menu');
  const nav = $('#nav');
  const navGroups = $$('.nav-group');

  function setGroupOpen(group, open) {
    group.classList.toggle('expanded', open);
    $('.nav-expand', group)?.setAttribute('aria-expanded', String(open));
  }

  function closeMenus(except = null) {
    navGroups.forEach(group => {
      if (group !== except) setGroupOpen(group, false);
    });
  }

  function setNavigationOpen(open) {
    if (!nav || !menu) return;
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    if (!open) closeMenus();
  }

  menu?.addEventListener('click', () => {
    if (nav) setNavigationOpen(!nav.classList.contains('open'));
  });

  navGroups.forEach((group, index) => {
    const button = $('.nav-expand', group);
    const submenu = $('.submenu', group);
    if (!button || !submenu) return;
    submenu.id ||= `navigation-section-${index + 1}`;
    button.type = 'button';
    button.setAttribute('aria-controls', submenu.id);
    // These are ordinary navigation links, not an application-style menu.
    button.removeAttribute('aria-haspopup');
    button.addEventListener('click', () => {
      const open = !group.classList.contains('expanded');
      closeMenus();
      setGroupOpen(group, open);
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-group')) closeMenus();
  });

  document.addEventListener('focusin', event => {
    closeMenus(event.target.closest('.nav-group'));
  });

  document.addEventListener('keydown', event => {
    const ageGate = $('#age');
    if (event.key !== 'Escape' || (ageGate && !ageGate.hidden)) return;
    const openGroups = navGroups.filter(group => group.classList.contains('expanded'));
    if (openGroups.length) {
      const group = openGroups.find(item => item.contains(document.activeElement)) || openGroups[0];
      closeMenus();
      $('.nav-expand', group)?.focus();
      event.preventDefault();
    } else if (nav?.classList.contains('open')) {
      setNavigationOpen(false);
      menu?.focus();
      event.preventDefault();
    }
  });

  // Preserve the existing manual carousel and its supplied artwork.
  const hero = $('.hero');
  const slides = $$('.slide', hero || document);
  const slideButtons = $$('[data-slide]', hero || document);
  let currentSlide = 0;
  let slideStatus = null;
  let autoSlideTimer = null;
  const AUTO_SLIDE_MS = 4800;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let heroIsVisible = true;
  const ageGateForCarousel = $('#age');
  const carouselCanPlay = () => hero && slides.length > 1 && !document.hidden &&
    heroIsVisible && !hero.matches(':hover') && !hero.contains(document.activeElement) &&
    !reduceMotion?.matches && (!ageGateForCarousel || ageGateForCarousel.hidden);
  function stopAutoSlide() {
    if (autoSlideTimer !== null) { window.clearInterval(autoSlideTimer); autoSlideTimer = null; }
  }
  function startAutoSlide() {
    stopAutoSlide();
    if (!carouselCanPlay()) return;
    autoSlideTimer = window.setInterval(() => {
      if (!carouselCanPlay()) { stopAutoSlide(); return; }
      showSlide(currentSlide + 1);
    }, AUTO_SLIDE_MS);
  }
  function manualSlide(index) { showSlide(index); startAutoSlide(); }


  if (hero && slides.length) {
    hero.setAttribute('role', 'region');
    hero.setAttribute('aria-roledescription', 'carousel');
    hero.setAttribute('aria-label', 'Image carousel');
    slides.forEach((slide, index) => {
      slide.id ||= `hero-slide-${index + 1}`;
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
    });
    slideButtons.forEach(button => {
      const slide = slides[Number(button.dataset.slide)];
      button.type = 'button';
      if (slide) button.setAttribute('aria-controls', slide.id);
    });
    slideStatus = document.createElement('p');
    slideStatus.className = 'sr-only';
    slideStatus.setAttribute('aria-live', 'polite');
    slideStatus.setAttribute('aria-atomic', 'true');
    hero.append(slideStatus);
  }

  function showSlide(index) {
    if (!slides.length || !Number.isInteger(index)) return;
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== currentSlide; });
    slideButtons.forEach(button => {
      const selected = Number(button.dataset.slide) === currentSlide;
      button.textContent = selected ? '●' : '○';
      button.setAttribute('aria-current', String(selected));
    });
    if (slideStatus) slideStatus.textContent = `Slide ${currentSlide + 1} of ${slides.length}`;
  }

  $('#prev')?.addEventListener('click', () => manualSlide(currentSlide - 1));
  $('#next')?.addEventListener('click', () => manualSlide(currentSlide + 1));
  slideButtons.forEach(button => {
    button.addEventListener('click', () => manualSlide(Number(button.dataset.slide)));
  });
  hero?.addEventListener('keydown', event => {
    if (!event.target.closest('button')) return;
    const actions = {
      ArrowLeft: currentSlide - 1,
      ArrowRight: currentSlide + 1,
      Home: 0,
      End: slides.length - 1
    };
    if (Object.prototype.hasOwnProperty.call(actions, event.key)) {
      event.preventDefault();
      manualSlide(actions[event.key]);
    }
  });
  showSlide(0);
  if (hero) {
    hero.addEventListener('mouseenter', stopAutoSlide);
    hero.addEventListener('mouseleave', startAutoSlide);
    hero.addEventListener('focusin', stopAutoSlide);
    hero.addEventListener('focusout', () => window.setTimeout(startAutoSlide, 0));
    document.addEventListener('visibilitychange', startAutoSlide);
    reduceMotion?.addEventListener?.('change', startAutoSlide);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { heroIsVisible = entries[0]?.isIntersecting ?? true; startAutoSlide(); }, {threshold:0.13}).observe(hero);
    }
    if (ageGateForCarousel) {
      new MutationObserver(startAutoSlide).observe(ageGateForCarousel,{attributes:true,attributeFilter:['hidden']});
    }
    startAutoSlide();
  }


  // Retain the original Featured panel so returning to it never loses images.
  const tabSets = [
    ['Full Kits', 'Disposables', 'E-Liquids', 'Nicotine Salts'],
    ['New In', 'Accessories', 'Chargers', 'Batteries'],
    ['Vaporizers', 'Pod Devices', 'Fruit Flavors', 'Tanks']
  ];
  const tabs = $$('[data-tab]');
  const tabContent = $('#tab-content');
  const initialFeaturedNodes = tabContent
    ? [...tabContent.childNodes].map(node => node.cloneNode(true))
    : [];

  function placeholderCards(names) {
    const grid = document.createElement('div');
    grid.className = 'tiles';
    names.forEach(name => {
      const link = document.createElement('a');
      link.className = 'tile';
      link.href = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
      const imagery = {
        'New In': 'assets/starter-kits/uwell-caliburn-g5-pod-kit/01.webp',
        'Accessories': 'assets/starter-kits/oxva-xlim-go-pod-kit/01.webp',
        'Chargers': 'assets/starter-kits/uwell-caliburn-g3-pro-pod-kit/01.webp',
        'Batteries': 'assets/starter-kits/vaporesso-luxe-xr-max-2-pod-kit/01.webp',
        'Vaporizers': 'assets/starter-kits/uwell-caliburn-air-pod-kit/01.webp',
        'Pod Devices': 'assets/starter-kits/oxva-xlim-pro-3-pod-kit/01.webp',
        'Fruit Flavors': 'assets/reference-images/030_SM1.webp',
        'Tanks': 'assets/starter-kits/geekvape-obelisk-u-pod-system-kit-950mah-20w/01.webp'
      };
      const artwork = document.createElement('img');
      artwork.src = imagery[name] || 'assets/reference-images/029_SM2.webp';
      artwork.className = 'tile-art';
      artwork.loading = 'lazy';
      artwork.alt = `Representative imagery for ${name}`;
      const heading = document.createElement('h3');
      heading.textContent = name;
      const description = document.createElement('span');
      description.textContent = 'View information →';
      link.append(artwork, heading, description);
      grid.append(link);
    });
    return grid;
  }

  function selectTab(button, moveFocus = false) {
    if (!tabContent) return;
    const index = Number(button.dataset.tab);
    if (!tabSets[index]) return;
    tabs.forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('selected', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    tabContent.setAttribute('aria-labelledby', button.id);
    if (index === 0) {
      tabContent.replaceChildren(...initialFeaturedNodes.map(node => node.cloneNode(true)));
    } else {
      tabContent.replaceChildren(placeholderCards(tabSets[index]));
    }
    if (moveFocus) button.focus();
  }

  if (tabContent && tabs.length) {
    tabContent.setAttribute('role', 'tabpanel');
    tabContent.tabIndex = 0;
    tabs.forEach((button, index) => {
      button.id ||= `featured-tab-${index + 1}`;
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', tabContent.id);
      button.addEventListener('click', () => selectTab(button));
      button.addEventListener('keydown', event => {
        let target = index;
        if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') target = 0;
        else if (event.key === 'End') target = tabs.length - 1;
        else return;
        event.preventDefault();
        selectTab(tabs[target], true);
      });
    });
    selectTab(tabs.find(tab => tab.dataset.tab === '0') || tabs[0]);
  }

  // GitHub Pages enquiry delivery is handled by FormSubmit, not by PHP.
  // Acceptance by FormSubmit never guarantees inbox receipt until activation.
  $$('.contact').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const status = $('.status', form);
      if (!form.checkValidity()) {
        if (status) { status.textContent = 'Please complete the required fields.'; status.dataset.state = 'error'; }
        form.reportValidity(); return;
      }
      if (form.dataset.mailContact !== 'true') return;
      const data = Object.fromEntries(new FormData(form));
      const submit = form.querySelector('[type="submit"]');
      const config = window.VAPECO_EMAIL_DEMO;
      const subject = config?.subjectEnquiry || '[VapeCo] General website enquiry / test';
      const recipient = config?.recipient || 'officework00011113@gmail.com';
      const body = `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\n\nMessage:\n${data.message}\n\nThis is a general website enquiry, not an order.`;
      if (location.protocol === 'file:') {
        const mailto = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        if (status) { status.textContent = 'Local file preview: your email app draft is opening. Click Send there. For direct website emails, publish to GitHub Pages and activate the inbox.'; status.dataset.state = ''; }
        window.location.href = mailto; return;
      }
      if (submit) submit.disabled = true;
      if (status) { status.textContent = 'Sending enquiry to email service…'; status.dataset.state = ''; }
      try {
        const response = await fetch(config?.ajaxEndpoint || 'https://formsubmit.co/ajax/officework00011113@gmail.com', {
          method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify({...data, _subject:subject, _template:'table', _replyto:data.email})
        });
        const reply=await response.json().catch(()=>({}));
        if (!response.ok || reply.success === false || reply.success === 'false') throw new Error(reply.message || 'Email service rejected the submission.');
        if (status) { status.textContent = 'Enquiry accepted by the email service. Check Gmail inbox (and first-time activation email if this is a new setup). Inbox delivery is not yet confirmed.'; status.dataset.state = 'success'; }
        form.reset();
      } catch(error) {
        if (status) { status.textContent = `Could not submit automatically: ${error.message || 'Network error'}. Use the Open Email Draft option, or check hosting and FormSubmit activation.`; status.dataset.state = 'error'; }
      } finally { if (submit) submit.disabled = false; }
    });
  });

  // Explicit manual fallback on static or local previews.
  const draftButton = $('#open-contact-draft');
  draftButton?.addEventListener('click', () => {
    const form = draftButton.closest('form');
    const config = window.VAPECO_EMAIL_DEMO;
    const data = Object.fromEntries(new FormData(form));
    const lines = [`Name: ${data.name || 'Demo Customer'}`,`Email: ${data.email || 'demo@example.com'}`,`Phone: ${data.phone || 'Not supplied'}`,'',data.message || 'General website enquiry preview'];
    const recipient = config?.recipient || 'officework00011113@gmail.com';
    window.location.href=`mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(config?.subjectEnquiry || '[VapeCo] General website enquiry')}&body=${encodeURIComponent(lines.join('\n'))}`;
    const status=$('.status',form);
    if(status) {status.textContent='Email draft requested. Your mail app must open and you must click Send manually.';status.dataset.state='';}
  });

  // Stakeholder demo: fill a safe, obviously fictional general enquiry.
  // The real Send button uses the same PHP endpoint and never fakes receipt.
  const sampleEnquiryButton = document.getElementById('fill-sample-enquiry');
  if (sampleEnquiryButton) {
    sampleEnquiryButton.addEventListener('click', () => {
      const form = sampleEnquiryButton.closest('form');
      if (!form) return;
      const fields = {
        name: 'Vape Co Demo Client',
        email: 'demo@example.com',
        phone: '',
        message: 'This is a sample general website enquiry to demonstrate that the contact form sends an email. This is not an order or purchase.'
      };
      for (const [key, value] of Object.entries(fields)) {
        const field = form.elements.namedItem(key);
        if (field) field.value = value;
      }
      const status = form.querySelector('.status');
      if (status) {
        status.dataset.state = '';
        status.textContent = 'Sample details filled. Click “Send Enquiry to Gmail” to make a real email submission.';
      }
    });
  }

  // Query text is only inserted as text, never interpreted as HTML.
  const results = $('#results');
  if (results) {
    const query = (new URLSearchParams(location.search).get('q') || '').trim();
    const queryInput = $('#query');
    if (queryInput) queryInput.value = query;
    const pages = Array.isArray(window.VAPECO_PAGES) ? window.VAPECO_PAGES : [];
    if (!query) {
      const prompt = document.createElement('p');
      prompt.textContent = 'Enter a keyword to search the local page directory.';
      results.replaceChildren(prompt);
    } else {
      const matches = pages.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()));
      const heading = document.createElement('h2');
      heading.textContent = matches.length
        ? `${matches.length} page result${matches.length === 1 ? '' : 's'} for “${query}”`
        : `No results for “${query}”`;
      results.replaceChildren(heading);
      if (matches.length) {
        const list = document.createElement('ul');
        list.className = 'result-list';
        matches.forEach(([name, href]) => {
          const item = document.createElement('li');
          const link = document.createElement('a');
          link.href = href;
          link.textContent = `${name} →`;
          item.append(link);
          list.append(item);
        });
        results.append(list);
      } else {
        const help = document.createElement('p');
        help.textContent = 'Try a different term. Search covers page titles, not full article or product content.';
        results.append(help);
      }
    }
  }

  // A storage restriction must not bypass or break the existing confirmation.
  const age = $('#age');
  const adult = $('#adult');
  const minor = $('#minor');
  if (age && adult && minor) {
    let confirmed = false;
    try {
      confirmed = sessionStorage.getItem('vapeco-adult') === '1';
    } catch {
      // Continue with an on-page confirmation when session storage is unavailable.
    }
    const previousFocus = document.activeElement;
    const background = [...document.body.children]
      .filter(element => element !== age && !['SCRIPT', 'STYLE', 'LINK'].includes(element.tagName))
      .map(element => ({element, wasInert: element.hasAttribute('inert')}));

    function setBackgroundInert(blocked) {
      background.forEach(({element, wasInert}) => {
        element.toggleAttribute('inert', blocked || wasInert);
      });
    }

    age.hidden = confirmed;
    if (!confirmed) {
      document.body.classList.add('modal-open');
      setBackgroundInert(true);
      adult.focus();
    }

    adult.addEventListener('click', () => {
      try {
        sessionStorage.setItem('vapeco-adult', '1');
      } catch {
        // The confirmation applies to this page; reloading will ask again.
      }
      age.hidden = true;
      document.body.classList.remove('modal-open');
      setBackgroundInert(false);
      const restore = previousFocus instanceof HTMLElement &&
        previousFocus !== document.body && previousFocus.isConnected &&
        !age.contains(previousFocus) && !previousFocus.closest('[inert]')
        ? previousFocus : $('#main');
      if (restore instanceof HTMLElement) {
        if (!restore.hasAttribute('tabindex') && restore.tagName === 'MAIN') {
          restore.tabIndex = -1;
          restore.addEventListener('blur', () => restore.removeAttribute('tabindex'), {once: true});
        }
        restore.focus({preventScroll: true});
      }
    });

    minor.addEventListener('click', () => {
      const message = $('#age-msg');
      if (message) message.textContent = 'Access is restricted to adults. This page will remain blocked.';
    });

    document.addEventListener('focusin', event => {
      if (!age.hidden && !age.contains(event.target)) adult.focus();
    });

    age.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = $$('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', age)
        .filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && (document.activeElement === first || !age.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !age.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    });
  }
})();
