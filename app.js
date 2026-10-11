(function () {
  'use strict';
  var ENDPOINT = 'https://formsubmit.co/ajax/thepinnaluus@gmail.com';
  var KEY = 'lyonsCampRsvp2027';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- open invite ---------- */
  var env = $('envelope');
  function openInvite() {
    env.classList.add('open');
    setTimeout(function () {
      $('when').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }, reduce ? 0 : 1150);
  }
  $('openInvite').addEventListener('click', openInvite);
  env.addEventListener('click', openInvite);

  /* ---------- scroll reveals ---------- */
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  /* ---------- desktop phone tip ---------- */
  var tip = $('phoneTip');
  var wide = window.matchMedia('(min-width: 760px) and (pointer: fine)');
  function syncTip() {
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('tipClosed') === '1'; } catch (e) {}
    tip.hidden = !wide.matches || dismissed;
  }
  syncTip();
  if (wide.addEventListener) wide.addEventListener('change', syncTip);
  $('phoneTipClose').addEventListener('click', function () {
    tip.hidden = true;
    try { sessionStorage.setItem('tipClosed', '1'); } catch (e) {}
  });

  /* ---------- RSVP ---------- */
  var form = $('rsvpForm'), idle = $('rsvpIdle'), done = $('rsvpDone'), err = $('formErr'), sendBtn = $('sendBtn');

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }

  function show(which) {
    idle.hidden = which !== 'idle';
    form.hidden = which !== 'form';
    done.hidden = which !== 'done';
    if (which === 'idle') idle.classList.add('in');
  }
  function showDone(d, fresh) {
    $('doneMsg').textContent = (fresh ? 'Got it, ' : 'You already said yes, ') + d.name + '! ♡';
    show('done');
  }

  var saved = load();
  if (saved && saved.name) showDone(saved, false);

  $('imIn').addEventListener('click', function () {
    show('form');
    setTimeout(function () { $('fName').focus({ preventScroll: true }); form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }, 60);
    confetti(14);
  });
  $('cancelForm').addEventListener('click', function () { show('idle'); });
  $('editRsvp').addEventListener('click', function () {
    var d = load() || {};
    form.elements.name.value = d.name || '';
    err.hidden = true;
    show('form');
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    err.hidden = true;
    var nameEl = form.elements.name;
    var name = nameEl.value.trim();
    if (!name) {
      nameEl.classList.remove('bad'); void nameEl.offsetWidth; nameEl.classList.add('bad');
      err.textContent = 'oops! we need your name so we know who\'s coming 🙈';
      err.hidden = false; nameEl.focus(); return;
    }
    nameEl.classList.remove('bad');
    if (form.elements._honey.value) { return; }

    var d = { name: name };
    var payload = {
      _subject: 'Lyons camping RSVP: ' + name,
      _template: 'table',
      _captcha: 'false',
      Name: d.name,
      Trip: 'LaVern M. Johnson Park, Lyons · Fri Sept 10 – Sun Sept 12, 2027 · sites 14-18 & 20'
    };

    sendBtn.disabled = true;
    var label = sendBtn.textContent;
    sendBtn.textContent = 'sending… 🐌';

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || ('HTTP ' + r.status));
      });
    }).then(function () {
      d.at = new Date().toISOString();
      save(d);
      showDone(d, true);
      confetti(80);
    }).catch(function (e) {
      if (window.console) console.warn('RSVP failed:', e);
      err.textContent = 'eep, the carrier pigeon got lost 🕊️ check your connection and tap send again? (or just text Chanel!)';
      err.hidden = false;
    }).then(function () {
      sendBtn.disabled = false;
      sendBtn.textContent = label;
    });
  });

  /* ---------- confetti ---------- */
  function confetti(n) {
    if (reduce) return;
    var box = $('confetti');
    var bits = ['⭐', '💖', '🌼', '⛺', '✨', '🌲', '💛', '🦋', '☀️', '🍦'];
    var colors = ['#ffb4a2', '#c9b6f2', '#a8dcc3', '#ffe7a8', '#bde0fe', '#ff8fab'];
    for (var i = 0; i < n; i++) {
      var el = document.createElement('i');
      if (Math.random() < 0.55) {
        el.textContent = bits[Math.floor(Math.random() * bits.length)];
        el.style.fontSize = (16 + Math.random() * 18) + 'px';
      } else {
        el.style.width = el.style.height = (8 + Math.random() * 8) + 'px';
        el.style.background = colors[i % colors.length];
        el.style.borderRadius = Math.random() < 0.5 ? '50%' : '3px';
        el.style.border = '2px solid #5b4a6b';
      }
      el.style.left = (Math.random() * 100) + 'vw';
      el.style.setProperty('--t', (1.8 + Math.random() * 1.8) + 's');
      el.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
      el.style.animationDelay = (Math.random() * 0.5) + 's';
      box.appendChild(el);
      (function (node) { setTimeout(function () { node.remove(); }, 4500); })(el);
    }
  }
})();
