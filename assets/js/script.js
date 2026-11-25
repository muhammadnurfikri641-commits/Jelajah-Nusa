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
  const iconNames = {
    pin: ['fa-solid', 'fa-location-dot'],
    clock: ['fa-regular', 'fa-clock'],
    tag: ['fa-solid', 'fa-tag'],
    close: ['fa-solid', 'fa-xmark']
  };
  const icon = (id) => `<i class="icon ${iconNames[id].join(' ')}" aria-hidden="true"></i>`;
  const makeIcon = (id) => {
    const element = document.createElement('i');
    element.className = `icon ${iconNames[id].join(' ')}`;
    element.setAttribute('aria-hidden', 'true');
    return element;
  };
  const rupiah = (item) => Number(item.price.replace(/\D/g, ''));
  const mailLink = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
  /* Paket: memuat / kosong / galat */
  const list = $('#listPaket');
  const status = $('#statusPaket');

  function showState(html, isError = false) {
    list.hidden = true;
    status.hidden = false;
    status.className = isError ? 'status text-body' : 'status';
    status.innerHTML = html;
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
          <button class="btn btn-garis" type="button" data-booking-package="${item.id}">Pesan paket</button>
        </div>
      </li>`).join('');
    status.hidden = true;
    list.hidden = false;

    // Harga hero dihitung dari data yang sama
    const cheapest = items.reduce((min, item) => (rupiah(item) < rupiah(min) ? item : min));
    const hargaMulai = $('#hargaMulai');

    hargaMulai.innerHTML = `Paket mulai dari <strong>${cheapest.price}</strong> per orang.`;
    hargaMulai.hidden = false;
  }

  try {
    renderPackages(packages);
  } catch (error) {
    console.error(error);
    showState(`Daftar paket belum bisa ditampilkan. Muat ulang halaman atau hubungi ${mailLink}.`, true);
  }

  /* Detail paket hanya dibuka dari tombol di Destinasi. */
  const modalEl = $('#modalDest');
  const modal = bs && new bs.Modal(modalEl);
  let selected = null;

  const keDestinasi = () => $('#destinasi').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-package]');

    if (!button) return;

    selected = packages.find((item) => item.id === button.dataset.package);

    if (!selected) return;

    $('#fotoDest').src = selected.image;
    $('#fotoDest').alt = selected.alt;
    $('#lokasiDest').textContent = selected.destination;
    $('#judulDest').textContent = selected.name;
    $('#durasiDest').textContent = selected.duration;
    $('#hargaDest').textContent = selected.price;
    $('#infoDest').textContent = selected.description;

    if (modal) modal.show();
    else keDestinasi();
  });

  const modalPesanEl = $('#modalPesan');
  const modalPesan = bs && new bs.Modal(modalPesanEl);
  const formKontak = $('#formKontak');
  const formPesan = $('#formPesan');
  const bookSelect = $('#pilihPaket');
  const namaPesan = $('#namaPesan');
  const people = $('#jmlOrang');
  const kurangOrang = $('#kurangOrang');
  const tambahOrang = $('#tambahOrang');
  const departure = $('#tglBerangkat');
  const summary = $('#ringkasPaket');
  const hasilPesan = $('#hasilPesan');
  const minPeople = Number(people.min);
  const maxPeople = Number(people.max);

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

  $('#errOrang').textContent = `Jumlah orang harus bilangan bulat antara ${minPeople} dan ${maxPeople}.`;

  packages.forEach((item) => bookSelect.append(new Option(item.name, item.name)));

  const peopleCount = () => Number(people.value);
  const peopleValid = () => people.value.trim() !== '' && Number.isInteger(peopleCount()) && peopleCount() >= minPeople && peopleCount() <= maxPeople;
  const formatRupiah = (value) => `Rp${value.toLocaleString('id-ID')}`;

  function updateBooking() {
    const item = packages.find((pkg) => pkg.name === bookSelect.value);

    kurangOrang.disabled = !(peopleCount() > minPeople);
    tambahOrang.disabled = !(peopleCount() < maxPeople);
    people.classList.toggle('is-invalid', !peopleValid());
    people.setAttribute('aria-invalid', String(!peopleValid()));
    people.setAttribute('aria-describedby', 'errOrang');
    summary.hidden = !item;

    if (!item) return;

    summary.replaceChildren();
    const duration = document.createElement('span');
    duration.append(makeIcon('clock'), item.duration);
    const price = document.createElement('span');
    price.append(makeIcon('tag'), `${item.price} per orang`);
    summary.append(duration, price);

    if (peopleValid()) {
      const total = document.createElement('span');
      total.className = 'total-paket';
      const totalPrice = document.createElement('strong');
      totalPrice.textContent = formatRupiah(rupiah(item) * peopleCount());
      total.append(`Perkiraan total (${peopleCount()} orang): `, totalPrice);
      summary.append(total);
    }
  }

  [bookSelect, people].forEach((field) => field.addEventListener('input', updateBooking));
  namaPesan.addEventListener('input', () => {
    if (namaPesan.value.trim().length < 3) return;
    namaPesan.classList.remove('is-invalid');
    namaPesan.setAttribute('aria-invalid', 'false');
  });
  bookSelect.addEventListener('change', () => {
    if (!packages.some((item) => item.name === bookSelect.value)) return;
    bookSelect.classList.remove('is-invalid');
    bookSelect.setAttribute('aria-invalid', 'false');
  });
  formPesan.addEventListener('reset', () => setTimeout(() => {
    departure.min = localDateString();
    formPesan.hidden = false;
    hasilPesan.hidden = true;
    hasilPesan.replaceChildren();
    [bookSelect, namaPesan, people, departure].forEach((field) => {
      field.classList.remove('is-invalid');
      field.removeAttribute('aria-invalid');
    });
    updateBooking();
  }));

  document.querySelectorAll('.atur-orang [data-step]').forEach((button) => button.addEventListener('click', () => {
    const next = (peopleValid() ? peopleCount() : minPeople) + Number(button.dataset.step);

    people.value = Math.min(maxPeople, Math.max(minPeople, next));
    people.dispatchEvent(new Event('input', { bubbles: true }));
  }));

  updateBooking();

  function openBooking(choice = null) {
    formPesan.reset();
    if (choice) bookSelect.value = choice.name;
    bookSelect.classList.remove('is-invalid');
    bookSelect.setAttribute('aria-invalid', 'false');
    updateBooking();
    modalPesan?.show();
    const firstField = choice ? namaPesan : bookSelect;
    setTimeout(() => firstField.focus({ preventScroll: true }), calm ? 0 : 450);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-booking-package], [data-booking-open]');
    if (!button) return;

    const choice = button.dataset.bookingPackage
      ? packages.find((item) => item.id === button.dataset.bookingPackage)
      : null;
    openBooking(choice);
  });

  $('#pesanDest').addEventListener('click', () => {
    if (!selected) return;

    const choice = selected;

    if (modal) {
      // Bootstrap hanya menampilkan satu modal; tunggu detail tertutup sebelum membuka form.
      modalEl.addEventListener('hidden.bs.modal', () => openBooking(choice), { once: true });
      modal.hide();
    } else {
      openBooking(choice);
    }
  });

  const kolomKontak = ['name', 'email', 'subject', 'message'].map((id) => $(`#${id}`));

  function contactFieldValid(field) {
    const text = field.value.trim();

    return field.type === 'email' ? EMAIL_RE.test(text) : text !== '';
  }

  kolomKontak.forEach((field) => field.addEventListener('input', () => {
    field.classList.remove('is-invalid');
    field.setAttribute('aria-invalid', 'false');
    $('#statusKontak').hidden = true;
  }));

  formKontak.addEventListener('submit', (event) => {
    event.preventDefault();

    const invalid = kolomKontak.filter((field) => !contactFieldValid(field));

    kolomKontak.forEach((field) => {
      const bad = invalid.includes(field);

      field.classList.toggle('is-invalid', bad);
      field.setAttribute('aria-invalid', String(bad));
    });

    if (invalid.length) {
      invalid[0].focus();

      return;
    }

    $('#statusKontak').textContent = 'Terima kasih, pesanmu sudah terkirim, tunggu tim kami membalas melalui email yaaa.';
    $('#statusKontak').hidden = false;
    formKontak.reset();
  });

  formPesan.addEventListener('submit', (event) => {
    event.preventDefault();

    const validName = namaPesan.value.trim().length >= 3;
    const validPackage = packages.some((item) => item.name === bookSelect.value);
    const validPeople = peopleValid();
    const validDeparture = departureValid();
    const fields = [
      [namaPesan, validName],
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
    const invoiceHeader = document.createElement('div');
    invoiceHeader.className = 'hasil-kepala';
    const invoiceTitle = document.createElement('h3');
    invoiceTitle.id = 'judulHasil';
    invoiceTitle.textContent = 'Ringkasan pemesanan';
    const invoiceStatus = document.createElement('span');
    invoiceStatus.className = 'hasil-status';
    invoiceStatus.textContent = 'Ringkasan saja';
    invoiceHeader.append(invoiceTitle, invoiceStatus);

    const invoiceMessage = document.createElement('p');
    invoiceMessage.className = 'hasil-catatan';
    invoiceMessage.textContent = 'Data ini hanya ditampilkan di halaman dan tidak dikirim atau disimpan.';

    const invoiceSummary = document.createElement('div');
    invoiceSummary.className = 'hasil-ringkas';
    const customer = document.createElement('strong');
    customer.textContent = namaPesan.value.trim();
    const packageName = document.createElement('strong');
    packageName.textContent = item.name;
    const departureDate = document.createElement('strong');
    departureDate.textContent = date.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    invoiceSummary.append('Atas nama ', customer, ' memesan ', packageName, ', berangkat tanggal ', departureDate, '.');

    const rows = document.createElement('dl');
    rows.className = 'hasil-rincian';
    const rowData = [
      ['Durasi', item.duration],
      ['Jumlah peserta', `${peopleCount()} orang`],
      ['Harga per orang', item.price]
    ];
    rowData.forEach(([labelText, valueText]) => {
      const row = document.createElement('div');
      const label = document.createElement('dt');
      label.textContent = labelText;
      const value = document.createElement('dd');
      value.textContent = valueText;
      row.append(label, value);
      rows.append(row);
    });

    const total = document.createElement('div');
    total.className = 'hasil-total';
    const totalLabel = document.createElement('span');
    totalLabel.textContent = 'Perkiraan total';
    const totalValue = document.createElement('strong');
    totalValue.textContent = formatRupiah(rupiah(item) * peopleCount());
    total.append(totalLabel, totalValue);

    const again = document.createElement('button');
    Object.assign(again, { type: 'button', className: 'btn btn-garis w-100 mt-3', id: 'pesanUlang', textContent: 'Booking Lagi' });
    hasilPesan.replaceChildren(invoiceHeader, invoiceMessage, invoiceSummary, rows, total, again);
    formPesan.hidden = true;
    hasilPesan.hidden = false;
  });

  hasilPesan.addEventListener('click', (event) => {
    if (event.target.closest('#pesanUlang')) formPesan.reset();
  });

  const menuNav = [...document.querySelectorAll('#menuNav a.nav-link')];

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        menuNav.forEach((link) => link.removeAttribute('aria-current'));
        menuNav.find((link) => link.getAttribute('href') === `#${entry.target.id}`)?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    document.querySelectorAll('main > section[id]').forEach((section) => spy.observe(section));
  }

  const header = $('.header-situs');
  let scrolled = false;
  let queued = false;

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

  const wa = $('.wa');
  const phone = matchMedia('(max-width: 767.98px)');

  if (wa && 'IntersectionObserver' in window) {
    let heroButtonsVisible = false;
    const tuck = () => wa.classList.toggle('is-tucked', phone.matches && heroButtonsVisible);

    new IntersectionObserver(([entry]) => {
      heroButtonsVisible = entry.isIntersecting;
      tuck();
    }).observe($('.aksi-hero'));
    phone.addEventListener('change', tuck);
  }

  document.querySelectorAll('#navUtama a').forEach((link) => link.addEventListener('click', () => {
    const nav = $('#navUtama');

    if (nav.classList.contains('show')) bs?.Collapse.getOrCreateInstance(nav).hide();
  }));
})();
