document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------
  // 1. Dark / light mode (saved in localStorage)
  // -------------------------------------------------------
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-btn');
  const saved = localStorage.getItem('theme') || 'light';

  root.dataset.theme = saved;
  themeBtn.textContent = saved === 'dark' ? '☀' : '☾';

  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
    themeBtn.textContent = next === 'dark' ? '☀' : '☾';
  });

  // -------------------------------------------------------
  // 2. Mobile navigation
  // -------------------------------------------------------
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.getElementById('nav');

  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  // -------------------------------------------------------
  // 3. Active nav link (scroll-spy for the one-page layout)
  // -------------------------------------------------------
  const links = document.querySelectorAll('nav a');
  const secs = document.querySelectorAll('main section');

  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a =>
          a.classList.toggle(
            'active',
            a.getAttribute('href') === '#' + e.target.id
          )
        );
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  secs.forEach(s => spy.observe(s));
  links.forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('open'))
  );

  // -------------------------------------------------------
  // 4. Scroll-to-top button
  // -------------------------------------------------------
  const topBtn = document.getElementById('top');

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 400);
  });

  topBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // -------------------------------------------------------
  // 5. Typing effect (home page)
  // -------------------------------------------------------
  const typed = document.getElementById('typed');

  if (typed) {
    const words = ['Information Technology'];
    let w = 0;
    let c = 0;
    let deleting = false;

    (function tick() {
      const word = words[w];
      typed.textContent = word.slice(0, c);

      if (!deleting && c === word.length) {
        deleting = true;
        return setTimeout(tick, 1400);
      }

      if (deleting && c === 0) {
        deleting = false;
        w = (w + 1) % words.length;
      }

      c += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 50 : 110);
    })();
  }

  // -------------------------------------------------------
  // 6. Skill bars animate when scrolled into view
  // -------------------------------------------------------
  const fills = document.querySelectorAll('.fill');

  if (fills.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.level + '%';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });

    fills.forEach(f => io.observe(f));
  }

  // -------------------------------------------------------
  // 7. Project filtering
  // -------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filters button');

  filterBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');

      document.querySelectorAll('.project').forEach(p => {
        p.classList.toggle(
          'hide',
          btn.dataset.filter !== 'all' &&
          p.dataset.type !== btn.dataset.filter
        );
      });
    })
  );

  // -------------------------------------------------------
  // 8. Image modal
  // -------------------------------------------------------
  const modal = document.getElementById('modal');

  if (modal) {
    const big = modal.querySelector('img');

    document.querySelectorAll('.project img').forEach(img =>
      img.addEventListener('click', () => {
        big.src = img.src;
        big.alt = img.alt;
        modal.classList.add('open');
      })
    );

    modal.addEventListener('click', () => modal.classList.remove('open'));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') modal.classList.remove('open');
    });
  }

  // -------------------------------------------------------
  // 9. Accordion (resume page)
  // -------------------------------------------------------
  document.querySelectorAll('.acc-head').forEach(head =>
    head.addEventListener('click', () => {
      const body = head.nextElementSibling;
      const open = head.getAttribute('aria-expanded') === 'true';

      head.setAttribute('aria-expanded', !open);
      body.classList.toggle('open', !open);
      body.style.maxHeight = open ? 0 : body.scrollHeight + 'px';
    })
  );

  // First item starts open
  document.querySelector('.acc-head')?.click();

  // -------------------------------------------------------
  // 10. Contact form validation
  // -------------------------------------------------------
  const form = document.getElementById('contact-form');

  if (form) {
    const rules = {
      name:    v => v.trim().length >= 2  || 'Enter your name (at least 2 characters).',
      email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email like name@example.com.',
      subject: v => v.trim().length >= 3  || 'Enter a subject (at least 3 characters).',
      message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
    };

    const check = field => {
      const result = rules[field.name](field.value);
      field.classList.toggle('bad', result !== true);
      field.nextElementSibling.textContent = result === true ? '' : result;
      return result === true;
    };

    form.querySelectorAll('input,textarea').forEach(f =>
      f.addEventListener('blur', () => check(f))
    );

    form.addEventListener('submit', e => {
      e.preventDefault();

      const allValid = [...form.querySelectorAll('input,textarea')]
        .map(check)
        .every(Boolean);

      const ok = document.getElementById('ok');

      if (allValid) {
        ok.textContent = 'Thanks! Your message passed validation. (Connect a form service to actually send it.)';
        form.reset();
      } else {
        ok.textContent = '';
      }
    });
  }

});