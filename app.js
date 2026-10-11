(function () {
  'use strict';
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

  /* ---------- text Chanel ---------- */
  $('textMe').addEventListener('click', function () {
    confetti(50);
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
