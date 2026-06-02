(() => {
  const root = document.documentElement;
  const rolePalettes = {
    production: ['#2175d9', '#9dd7ff'],
    warehouse: ['#0b153f', '#7cc7ff'],
    warehousing: ['#0b153f', '#7cc7ff'],
    logistics: ['#146c94', '#8fe3cf'],
    construction: ['#f4b23b', '#2175d9'],
    default: ['#2175d9', '#0b153f']
  };

  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char]);
  }

  function roleKey(title, category) {
    const text = `${title} ${category}`.toLowerCase();
    if (text.includes('construction') || text.includes('site') || text.includes('road') || text.includes('ground') || text.includes('demolition')) return 'construction';
    if (text.includes('warehouse') || text.includes('picker') || text.includes('packer') || text.includes('sorter') || text.includes('stock') || text.includes('dispatch')) return 'warehouse';
    if (text.includes('logistics') || text.includes('forklift') || text.includes('loader') || text.includes('pallet')) return 'logistics';
    if (text.includes('production') || text.includes('assembly') || text.includes('machine') || text.includes('manufacturing') || text.includes('quality') || text.includes('line')) return 'production';
    return 'default';
  }

  function iconPath(key) {
    if (key === 'construction') {
      return '<path d="M204 286h232" stroke="#fff" stroke-width="18" stroke-linecap="round"/><path d="M238 286l52-112h60l52 112" fill="none" stroke="#fff" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M264 232h112" stroke="#fff" stroke-width="14" stroke-linecap="round"/>';
    }
    if (key === 'warehouse') {
      return '<path d="M214 190h212v128H214z" fill="none" stroke="#fff" stroke-width="18" stroke-linejoin="round"/><path d="M214 230h212M282 190v128M358 190v128" stroke="#fff" stroke-width="14" stroke-linecap="round"/>';
    }
    if (key === 'logistics') {
      return '<path d="M178 242h232v72H178zM410 266h46l34 48h-80z" fill="none" stroke="#fff" stroke-width="18" stroke-linejoin="round"/><circle cx="232" cy="326" r="20" fill="#fff"/><circle cx="434" cy="326" r="20" fill="#fff"/>';
    }
    return '<path d="M204 236h232v74H204z" fill="none" stroke="#fff" stroke-width="18" stroke-linejoin="round"/><circle cx="260" cy="236" r="40" fill="none" stroke="#fff" stroke-width="16"/><circle cx="380" cy="236" r="40" fill="none" stroke="#fff" stroke-width="16"/><path d="M260 196v80M220 236h80M380 196v80M340 236h80" stroke="#fff" stroke-width="12" stroke-linecap="round"/>';
  }

  function generatedThumb(title, category) {
    const key = roleKey(title, category);
    const [start, end] = rolePalettes[key] || rolePalettes.default;
    const safeTitle = escapeXml(title || 'Open role');
    const safeCategory = escapeXml(category || 'Recruitment');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${safeTitle} generated advert image"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${start}"/><stop offset="1" stop-color="${end}"/></linearGradient><filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0b153f" flood-opacity=".22"/></filter></defs><rect width="640" height="360" rx="28" fill="#f8fbff"/><rect x="34" y="34" width="572" height="292" rx="28" fill="url(#g)"/><circle cx="92" cy="78" r="72" fill="#fff" opacity=".14"/><circle cx="560" cy="312" r="120" fill="#fff" opacity=".12"/><g filter="url(#s)">${iconPath(key)}</g><rect x="54" y="52" width="138" height="34" rx="17" fill="#fff" opacity=".92"/><text x="76" y="75" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="#0b153f">${safeCategory}</text><text x="54" y="310" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#fff">${safeTitle}</text></svg>`;
    return `data:image/png;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function cardInfo(card) {
    const title = card.querySelector('h3')?.textContent?.trim()
      || document.querySelector('.job-hero-detail h1')?.textContent?.trim()
      || 'Open role';
    const category = card.querySelector('.badge')?.textContent?.trim()
      || document.querySelector('.job-hero-detail .lead')?.textContent?.split('•')?.[2]?.trim()
      || 'Recruitment';
    return { title, category };
  }

  function applyGeneratedThumb(img, title, category) {
    if (!img || img.dataset.generatedThumb === 'true') return;
    img.dataset.generatedThumb = 'true';
    img.src = generatedThumb(title, category);
    img.alt = `${title} generated advert image`;
    img.classList.add('generated-job-thumb');
  }

  function ensureJobThumbnails() {
    document.querySelectorAll('.job-card').forEach((card) => {
      const { title, category } = cardInfo(card);
      let thumb = card.querySelector('.job-thumb');
      if (!thumb) {
        thumb = document.createElement('img');
        thumb.className = 'job-thumb generated-job-thumb';
        card.prepend(thumb);
        applyGeneratedThumb(thumb, title, category);
      } else {
        thumb.addEventListener('error', () => applyGeneratedThumb(thumb, title, category), { once: true });
        if (!thumb.getAttribute('src')) applyGeneratedThumb(thumb, title, category);
      }
    });

    document.querySelectorAll('.job-hero-image').forEach((img) => {
      const { title, category } = cardInfo(document);
      img.addEventListener('error', () => applyGeneratedThumb(img, title, category), { once: true });
      if (!img.getAttribute('src')) applyGeneratedThumb(img, title, category);
    });
  }

  function ensureAdditionalJobCards() {
    const grid = document.querySelector('.job-grid');
    if (!grid) return;

    const jobs = [
      {
        href: '/jobs/job-26-pracownik-produkcji-prefabrykatow.html',
        image: '/assets/images/jobs/bud6.png',
        title: 'Precast Concrete Production Worker',
        category: 'Production',
        metaEn: 'Tilburg, Eindhoven, Haga • Full-time • 20,06 €/hour',
        metaPl: 'Tilburg, Eindhoven, Haga • Full-time • 20,06 €/hour'
      },
      {
        href: '/jobs/job-27-pracownik-robot-ziemnych.html',
        image: '/assets/images/jobs/bud1.png',
        title: 'Earthworks Laborer',
        category: 'Construction',
        metaEn: 'Netherlands • Full-time • 18,65 €/hour',
        metaPl: 'Netherlands • Full-time • 18,65 €/hour'
      },
      {
        href: '/jobs/job-28-monter-konstrukcji-stalowych.html',
        image: '/assets/images/jobs/bud2.png',
        title: 'Steel Structure Installer',
        category: 'Construction',
        metaEn: 'Netherlands • Full-time • 22,54 €/hour',
        metaPl: 'Netherlands • Full-time • 22,54 €/hour'
      },
      {
        href: '/jobs/job-29-pracownik-budowy-mostow.html',
        image: '/assets/images/jobs/bud3.png',
        title: 'Bridge Construction Worker',
        category: 'Construction',
        metaEn: 'Netherlands • Full-time • 21,35 €/hour',
        metaPl: 'Netherlands • Full-time • 21,35 €/hour'
      },
      {
        href: '/jobs/job-30-monter-zabudowy-suchej.html',
        image: '/assets/images/jobs/bud4.png',
        title: 'Drywall Installer',
        category: 'Construction',
        metaEn: 'Netherlands • Full-time • 19,20 €/hour',
        metaPl: 'Netherlands • Full-time • 19,20 €/hour'
      },
      {
        href: '/jobs/job-31-pracownik-dekarski.html',
        image: '/assets/images/jobs/bud5.png',
        title: 'Roofing Worker',
        category: 'Construction',
        metaEn: 'Netherlands • Full-time • 20,75 €/hour',
        metaPl: 'Netherlands • Full-time • 20,75 €/hour'
      },
      {
        href: '/jobs/job-32-brukarz.html',
        image: '/assets/images/jobs/bud7.png',
        title: 'Paver',
        category: 'Construction',
        metaEn: 'Netherlands • Full-time • 19,85 €/hour',
        metaPl: 'Netherlands • Full-time • 19,85 €/hour'
      },
      {
        href: '/jobs/job-33-monter-rur-kanalizacyjnych.html',
        image: '/assets/images/jobs/bud8.png',
        title: 'Sewer Pipe Installer',
        category: 'Construction',
        metaEn: 'Netherlands • Full-time • 21,90 €/hour',
        metaPl: 'Netherlands • Full-time • 21,90 €/hour'
      }
    ];

    jobs.forEach((job) => {
      if (document.querySelector(`[data-href="${job.href}"]`)) return;
      const card = document.createElement('article');
      card.className = 'job-card';
      card.dataset.href = job.href;
      card.tabIndex = 0;
      card.role = 'link';
      card.setAttribute('aria-label', `View details for ${job.title}`);
      card.innerHTML = `<img class="job-thumb" loading="eager" decoding="async" src="${job.image}" alt="${job.title} thumbnail"/><span class="badge">${job.category}</span><h3>${job.title}</h3><p><span class="lang-copy lang-en">${job.metaEn}</span><span class="lang-copy lang-nl">${job.metaEn}</span><span class="lang-copy lang-pl">${job.metaPl}</span><span class="lang-copy lang-ro">${job.metaEn}</span></p><a class="link" href="${job.href}"><span class="lang-copy lang-en">View details</span><span class="lang-copy lang-nl">View details</span><span class="lang-copy lang-pl">View details</span><span class="lang-copy lang-ro">View details</span></a>`;
      grid.append(card);
    });
  }

  function ensureJobCardNavigation() {
    document.querySelectorAll('.job-card[data-href]').forEach((card) => {
      card.addEventListener('click', (event) => {
        if (event.target.closest('a, button, input, select, textarea')) return;
        window.location.href = card.dataset.href;
      });
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.href = card.dataset.href;
      });
    });
  }

  function ensureRegistrationRedirect() {
    document.querySelectorAll('.registration-form').forEach((form) => {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        window.location.href = '/application-success.html';
      });
    });
  }

  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang;
    localStorage.setItem('vrb-lang', lang);
    document.querySelectorAll('[data-set-lang]').forEach((button) => {
      button.classList.toggle('active', button.dataset.setLang === lang);
      button.setAttribute('aria-pressed', String(button.dataset.setLang === lang));
    });
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-set-lang]');
    if (button) setLang(button.dataset.setLang);
  });
  ensureAdditionalJobCards();
  ensureJobThumbnails();
  ensureJobCardNavigation();
  ensureRegistrationRedirect();
  setLang(localStorage.getItem('vrb-lang') || 'en');
})();
