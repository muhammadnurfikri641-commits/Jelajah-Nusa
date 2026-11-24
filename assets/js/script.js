(() => {
  'use strict';

  const EMAIL = 'hello@jelajahnusa.id';

  const packages = [
    {
      id: 'bali',
      name: 'Bali Escape',
      destination: 'Bali, Indonesia',
      duration: '3 Hari 2 Malam',
      price: 'Rp2.450.000',
      highlight: 'Pantai, budaya, dan sunset',
      description: 'Temukan sisi terbaik Bali dalam perjalanan santai yang memadukan pantai tropis, tradisi lokal, dan matahari terbenam yang tak terlupakan.',
      image: 'assets/images/bali.jpg',
      alt: 'Lanskap hijau Bali'
    },
    {
      id: 'bromo',
      name: 'Bromo Sunrise Trip',
      destination: 'Jawa Timur, Indonesia',
      duration: '2 Hari 1 Malam',
      price: 'Rp1.350.000',
      highlight: 'Sunrise dan lautan pasir',
      description: 'Saksikan matahari terbit dari sudut pandang terbaik, lalu jelajahi lautan pasir dan lanskap vulkanik Taman Nasional Bromo Tengger Semeru.',
      image: 'assets/images/bromo.jpg',
      alt: 'Gunung Bromo saat matahari terbit'
    },
    {
      id: 'raja-ampat',
      name: 'Raja Ampat Discovery',
      destination: 'Papua Barat Daya, Indonesia',
      duration: '4 Hari 3 Malam',
      price: 'Rp5.750.000',
      highlight: 'Island hopping dan snorkeling',
      description: 'Jelajahi gugusan pulau yang menawan, nikmati waktu di atas air sebening kristal, dan temukan kehidupan bawah laut Raja Ampat.',
      image: 'assets/images/raja-ampat.jpg',
      alt: 'Gugusan pulau karst dan laut biru Raja Ampat'
    },
    {
      id: 'labuan-bajo',
      name: 'Labuan Bajo Explorer',
      destination: 'Nusa Tenggara Timur, Indonesia',
      duration: '3 Hari 2 Malam',
      price: 'Rp3.950.000',
      highlight: 'Pulau Komodo dan sailing',
      description: 'Berlayar melintasi pulau-pulau eksotis, mengunjungi habitat komodo, dan menikmati panorama laut Labuan Bajo yang istimewa.',
      image: 'assets/images/labuan-bajo.jpg',
      alt: 'Pulau tropis di Indonesia'
    }
  ];

  const $ = (selector) => document.querySelector(selector);
  const bs = window.bootstrap;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const rupiah = (item) => Number(item.price.replace(/\D/g, ''));
  const mailLink = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
  const resultModalEl = $('#formResultModal');
  const resultModal = bs && new bs.Modal(resultModalEl);

  function showPopup({ title, message }) {
    $('#formResultTitle').textContent = title;
    $('#formResultMessage').textContent = message;

    if (resultModal) resultModal.show();
    else window.alert(`${title}\n\n${message}`);
  }

  /* Paket: memuat / kosong / galat */
  const list = $('#packageList');
  const state = $('#packageState');

  function showState(html, isError = false) {
    list.hidden = true;
    state.hidden = false;
    state.className = isError ? 'state text-body' : 'state';
    state.innerHTML = html;
  }

  function renderPackages(items) {
    if (!items.length) {
      showState(`Belum ada paket yang tersedia. Hubungi kami di ${mailLink} untuk rencana perjalanan khusus.`);

      return;
    }

    list.innerHTML = items.map((item) => `
      <li class="ticket">
        <img class="ticket-photo" src="${item.image}" alt="${item.alt}" loading="lazy" width="520" height="390">
        <div class="ticket-body">
          <h3>${item.name}</h3>
          <p class="ticket-meta"><span>${icon('pin')}${item.destination}</span><span>${icon('clock')}${item.duration}</span></p>
          <p class="ticket-highlight">${item.highlight}</p>
        </div>
        <div class="ticket-stub">
          <p class="ticket-price"><small>Harga per orang</small><strong>${item.price}</strong></p>
          <button class="btn btn-outline-ink" type="button" data-package="${item.id}">Detail Paket</button>
        </div>
      </li>`).join('');
    state.hidden = true;
    list.hidden = false;

    // Harga hero dihitung dari data yang sama
    const cheapest = items.reduce((min, item) => (rupiah(item) < rupiah(min) ? item : min));
    const heroPrice = $('#heroPrice');

    heroPrice.innerHTML = `Paket mulai dari <strong>${cheapest.price}</strong> per orang.`;
    heroPrice.hidden = false;
  }

  try {
    renderPackages(packages);
  } catch (error) {
    console.error(error);
    showState(`Daftar paket belum bisa ditampilkan. Muat ulang halaman atau hubungi ${mailLink}.`, true);
  }

  /* Modal detail paket (tombol di destinasi, daftar paket, dan footer) */
  const modalEl = $('#packageModal');
  const modal = bs && new bs.Modal(modalEl);
  let selected = null;

  const toContact = () => $('#contact').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // DOM: satu listener di document menangkap klik semua tombol [data-package] (event delegation)
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-package]');

    if (!button) return;

    selected = packages.find((item) => item.id === button.dataset.package);

    if (!selected) return;

    // DOM: isi elemen modal dari data paket (src/alt lewat properti, teks lewat textContent)
    $('#modalImage').src = selected.image;
    $('#modalImage').alt = selected.alt;
    $('#modalLocation').textContent = selected.destination;
    $('#modalTitle').textContent = selected.name;
    $('#modalDuration').textContent = selected.duration;
    $('#modalPrice').textContent = selected.price;
    $('#modalDescription').textContent = selected.description;

    if (modal) modal.show();
    else toContact(); // Bootstrap gagal dimuat
  });

  /* Formulir: tab Tanya tim / Pesan paket */
  const contactForm = $('#contactForm');
  const bookingForm = $('#bookingForm');
  const bookSelect = $('#bookPackageSelect');
  const bookName = $('#bookName');
  const people = $('#bookPeople');
  const peopleMinus = $('#peopleMinus');
  const peoplePlus = $('#peoplePlus');
  const departure = $('#bookDeparture');
  const summary = $('#bookingSummary');
  const minPeople = Number(people.min);
  const maxPeople = Number(people.max); // batas jumlah orang dibaca dari atribut max di HTML

  const localDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const departureValid = () => departure.value !== '' && departure.value >= localDateString();

  departure.min = localDateString();
  departure.addEventListener('input', () => {
    const valid = departureValid();
    departure.classList.toggle('is-invalid', !valid);
    departure.setAttribute('aria-invalid', String(!valid));
  });

  // Pesan batas jumlah orang hanya ditampilkan saat nilainya tidak valid
  $('#peopleErr').textContent = `Jumlah orang harus bilangan bulat antara ${minPeople} dan ${maxPeople}.`;

  // DOM: pilihan paket dibuat dari array packages (createElement lewat new Option), jadi selalu sama dengan daftar paket
  packages.forEach((item) => bookSelect.append(new Option(item.name, item.name)));

  const peopleCount = () => Number(people.value);
  const peopleValid = () => people.value.trim() !== '' && Number.isInteger(peopleCount()) && peopleCount() >= minPeople && peopleCount() <= maxPeople;
  const formatRupiah = (value) => `Rp${value.toLocaleString('id-ID')}`;

  // Ringkasan paket + total, dan status tombol - / + mengikuti pilihan dan jumlah orang
  function updateBooking() {
    const item = packages.find((pkg) => pkg.name === bookSelect.value);

    peopleMinus.disabled = !(peopleCount() > minPeople);
    peoplePlus.disabled = !(peopleCount() < maxPeople);
    people.classList.toggle('is-invalid', !peopleValid());
    people.setAttribute('aria-invalid', String(!peopleValid()));
    people.setAttribute('aria-describedby', 'peopleErr');
    summary.hidden = !item;

    if (!item) return;

    const total = peopleValid() ? `<span class="booking-total">Perkiraan total (${peopleCount()} orang): <strong>${formatRupiah(rupiah(item) * peopleCount())}</strong></span>` : '';

    summary.innerHTML = `<span>${icon('clock')}${item.duration}</span><span>${icon('tag')}${item.price} per orang</span>${total}`;
  }

  [bookSelect, people].forEach((field) => field.addEventListener('input', updateBooking));
  bookName.addEventListener('input', () => {
    if (bookName.value.trim().length < 3) return;
    bookName.classList.remove('is-invalid');
    bookName.setAttribute('aria-invalid', 'false');
  });
  bookSelect.addEventListener('change', () => {
    if (!packages.some((item) => item.name === bookSelect.value)) return;
    bookSelect.classList.remove('is-invalid');
    bookSelect.setAttribute('aria-invalid', 'false');
  });
  bookingForm.addEventListener('reset', () => setTimeout(() => {
    departure.min = localDateString();
    bookingForm.hidden = false;
    $('#bookingInvoice').hidden = true;
    [bookSelect, bookName, people, departure].forEach((field) => {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
    });
    updateBooking();
  }));

  document.querySelectorAll('.people-stepper [data-step]').forEach((button) => button.addEventListener('click', () => {
    const next = (peopleValid() ? peopleCount() : minPeople) + Number(button.dataset.step);

    people.value = Math.min(maxPeople, Math.max(minPeople, next));
    people.dispatchEvent(new Event('input', { bubbles: true })); // memicu hapus galat + perbarui ringkasan
  }));

  updateBooking();

  // Tombol "Pesan paket" di modal: tutup modal, buka tab pemesanan, isi nama paket, lalu fokus ke kolom nama
  $('#bookPackage').addEventListener('click', () => {
    if (!selected) return;

    const choice = selected;
    const goBooking = () => {
      bs?.Tab.getOrCreateInstance($('#tabBooking')).show();
      bookSelect.value = choice.name;
      bookSelect.classList.remove('is-invalid');
      bookSelect.setAttribute('aria-invalid', 'false');
      updateBooking();
      toContact();
      setTimeout(() => bookName.focus({ preventScroll: true }), calm ? 0 : 450);
      bs?.Toast.getOrCreateInstance($('#bookingToast'), { delay: 5000 }).show();
    };

    if (modal) {
      // Tunggu modal benar-benar tertutup supaya scroll ke form tidak terkunci oleh modal
      modalEl.addEventListener('hidden.bs.modal', goBooking, { once: true });
      modal.hide();
    } else {
      goBooking();
    }
  });

  const contactFields = ['name', 'email', 'subject', 'message'].map((id) => $(`#${id}`));

  function contactFieldValid(field) {
    const text = field.value.trim();

    return field.type === 'email' ? EMAIL_RE.test(text) : text !== '';
  }

  contactFields.forEach((field) => field.addEventListener('input', () => {
    field.classList.remove('is-invalid');
    field.setAttribute('aria-invalid', 'false');
  }));

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalid = contactFields.filter((field) => !contactFieldValid(field));

    contactFields.forEach((field) => {
      const bad = invalid.includes(field);

      field.classList.toggle('is-invalid', bad);
      field.setAttribute('aria-invalid', String(bad));
    });

    if (invalid.length) {
      invalid[0].focus();

      return;
    }

    showPopup({
      title: 'Pesan berhasil disimulasikan',
      message: 'Terima kasih, pesanmu sudah tervalidasi. Ini simulasi tanpa backend, jadi pesan tidak dikirim atau disimpan.'
    });
    contactForm.reset();
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const validName = bookName.value.trim().length >= 3;
    const validPackage = packages.some((item) => item.name === bookSelect.value);
    const validPeople = peopleValid();
    const validDeparture = departureValid();
    const fields = [
      [bookName, validName],
      [bookSelect, validPackage],
      [people, validPeople],
      [departure, validDeparture]
    ];

    fields.forEach(([field, valid]) => {
      field.classList.toggle('is-invalid', !valid);
      field.setAttribute('aria-invalid', String(!valid));
    });

    const firstInvalid = fields.find(([, valid]) => !valid)?.[0];
    if (firstInvalid) {
      firstInvalid.focus();

      return;
    }

    const item = packages.find((pkg) => pkg.name === bookSelect.value);
    const date = new Date(`${departure.value}T00:00:00`);
    $('#bookingInvoiceName').textContent = bookName.value.trim();
    $('#bookingInvoicePackage').textContent = item.name;
    $('#bookingInvoiceDeparture').textContent = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    $('#bookingInvoiceDuration').textContent = item.duration;
    $('#bookingInvoicePeople').textContent = `${peopleCount()} orang`;
    $('#bookingInvoicePrice').textContent = item.price;
    $('#bookingInvoiceTotal').textContent = formatRupiah(rupiah(item) * peopleCount());
    bookingForm.hidden = true;
    $('#bookingInvoice').hidden = false;
  });

  $('#bookingAgain').addEventListener('click', () => bookingForm.reset());

  /* Tandai menu sesuai bagian yang sedang dibaca */
  const navLinks = [...document.querySelectorAll('#navLinks a.nav-link')];

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => link.removeAttribute('aria-current'));
        navLinks.find((link) => link.getAttribute('href') === `#${entry.target.id}`)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    // Semua section ikut diamati; galeri tidak punya menu, jadi tidak ada yang ditandai saat galeri terbaca
    document.querySelectorAll('main > section[id]').forEach((section) => spy.observe(section));
  }

  /* Navbar: normal di posisi atas; setelah di-scroll berubah jadi pill semi transparan */
  const header = $('.site-header');
  let scrolled = false;
  let queued = false;

  // Dua ambang (masuk > 56px, keluar < 16px) supaya tidak bolak-balik kalau scroll berhenti di sekitar satu titik
  const syncHeader = () => {
    queued = false;

    const y = window.scrollY;

    if (!scrolled && y > 56) scrolled = true;
    else if (scrolled && y < 16) scrolled = false;

    header.classList.toggle('is-scrolled', scrolled);
  };

  window.addEventListener('scroll', () => {
    if (queued) return;

    queued = true;
    requestAnimationFrame(syncHeader);
  }, { passive: true });
  syncHeader();

  /* Di HP, tombol WhatsApp disembunyikan selagi tombol hero terlihat agar tidak menutupinya */
  const wa = $('.wa');
  const phone = matchMedia('(max-width: 767.98px)');

  if (wa && 'IntersectionObserver' in window) {
    let heroButtonsVisible = false;
    const tuck = () => wa.classList.toggle('is-tucked', phone.matches && heroButtonsVisible);

    new IntersectionObserver(([entry]) => {
      heroButtonsVisible = entry.isIntersecting;
      tuck();
    }).observe($('.hero-actions'));
    phone.addEventListener('change', tuck);
  }

  /* Tutup menu habis milih tautan */
  document.querySelectorAll('#mainNav a').forEach((link) => link.addEventListener('click', () => {
    const nav = $('#mainNav');

    if (nav.classList.contains('show')) bs?.Collapse.getOrCreateInstance(nav).hide();
  }));
})();
