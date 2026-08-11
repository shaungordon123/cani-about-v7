/*
 * <cani-startup-reveal> -- VERSION V2.1 (V2 + absolute-clock fail-open)
 * V2.1: fail-open deadline anchored to navigation start (performance.now()),
 * FAIL_AT = min(4550, max(0, 4800 - connectOffset)) so the overlay is fully
 * absent <= 5.2 s wall-clock even when the served bundle connects late;
 * timings.absoluteClear stamps ms-since-navigation at finish.
 * Contract: CANI_STARTUP_V2_PREMIUM_REWORK_20260811.md
 * (8,488 B, SHA-256 FB489487A59F53DF537FF9DABB4B7B42FCA7B8F85233D449341AF02F1D9F548B)
 * V1 (52FA95DB...9090) is the frozen rollback source; this file replaces its
 * timing, counter engine, mark scale, glass pass and exit behaviour.
 *
 * Locked cold-session choreography (total clear 4.1-4.4 s):
 *   0.00-0.25 quiet cover        | 0.25-1.65 honest progress (rAF odometer)
 *   1.25-2.20 track->mark        | 2.20-2.85 brand settle (still)
 *   2.80-3.35 one glass pass     | 3.35-3.65 100% hold
 *   3.65-4.35 seam + parting     | hero starts frame-zero at the handoff
 *
 * Engineering guarantees:
 *  - counter: continuous rAF odometer (no per-write CSS transitions, no
 *    collisions, capped at 100, monotonic)
 *  - progress: eased 0->88, drift to 92 while awaiting the hero, then a
 *    deliberate 380 ms resolve 92->100 (never a 70->100 leap)
 *  - delayed/failed hero: fast-exit so the overlay is FULLY ABSENT <= 5.2 s
 *  - skip (Escape/Enter/Space/pointer/touch): cover gone + input restored
 *    within 250 ms
 *  - reduced motion, denied storage, deep link or restored scroll: immediate
 *    homepage, no cover
 *  - once per session; review-only replay flag ?caniIntroReview=1 (documented,
 *    to be disabled at final acceptance)
 *  - exact master-vector i (canilogovectormaster-v2.svg, D31CAD44...), scaled
 *    clamp(72px,7vw,108px) desktop / clamp(64px,17vw,80px) mobile
 */
(function () {
  'use strict';
  var TAG = 'cani-startup-reveal';
  if (window.customElements && customElements.get(TAG)) return;

  var I_DOT = 'M1640 355Q1640 413 1611.0 453.0Q1582 493 1541 493V479Q1541 422 1570.0 381.5Q1599 341 1640 341Z';
  var I_STEM = 'M1641 722Q1641 779 1611.5 819.5Q1582 860 1541 860V619Q1541 562 1570.5 521.5Q1600 481 1641 481Z';
  var MAGENTA = '#FF0D7E';
  var COVER = '#0c0d12';
  var EASE = 'cubic-bezier(.22,1,.36,1)';

  var CSS = '' +
    ':host{position:fixed;inset:0;z-index:2147483000;display:block;pointer-events:auto;}' +
    ':host([data-done]){display:none!important;pointer-events:none!important;}' +
    ':host([data-skip]){transition:opacity 150ms linear;opacity:0;pointer-events:none!important;}' +
    '.plane{position:absolute;left:0;width:100%;height:50.5%;background:' + COVER + ';transition:transform 640ms ' + EASE + ';will-change:transform;}' +
    '.plane--top{top:-0.5%;}' +
    '.plane--bot{bottom:-0.5%;}' +
    ':host([data-parting]) .plane--top{transform:translateY(-101%);}' +
    ':host([data-parting]) .plane--bot{transform:translateY(101%);}' +
    '.seam{position:absolute;left:50%;top:12%;bottom:12%;width:2px;transform:translateX(-50%) scaleY(0);transform-origin:50% 50%;background:linear-gradient(180deg,transparent,rgba(255,255,255,.75) 30%,rgba(255,13,126,.8) 50%,rgba(255,255,255,.75) 70%,transparent);opacity:0;transition:transform 340ms ' + EASE + ',opacity 180ms linear;}' +
    ':host([data-seam]) .seam{opacity:1;transform:translateX(-50%) scaleY(1);}' +
    ':host([data-parting]) .seam{opacity:0;transition:opacity 200ms linear;}' +
    '.stage{position:absolute;inset:0;display:grid;place-items:center;transition:opacity 360ms ' + EASE + ';}' +
    ':host([data-parting]) .stage{opacity:0;}' +
    '.mark{position:relative;width:clamp(72px,7vw,108px);}' +
    '@media (max-width:767px){.mark{width:clamp(64px,17vw,80px);}}' +
    '.mark svg{display:block;width:100%;height:auto;overflow:visible;}' +
    // track -> exact vector: one assured 900 ms formation inside 1.25-2.20 s
    '.track{position:absolute;top:74%;left:50%;width:clamp(170px,17vw,240px);height:3px;border-radius:2px;background:rgba(255,255,255,.92);transform:translate(-50%,-50%);transform-origin:50% 50%;transition:transform 780ms ' + EASE + ',opacity 520ms ' + EASE + ' 220ms;will-change:transform;}' +
    ':host([data-form]) .track{transform:translate(-50%,-50%) rotate(90deg) scaleX(.30);opacity:0;}' +
    '.ivec{opacity:0;transform:translateY(12px);transition:opacity 620ms ' + EASE + ' 320ms,transform 760ms ' + EASE + ' 320ms;will-change:transform;}' +
    ':host([data-form]) .ivec{opacity:1;transform:none;}' +
    '.idot{opacity:0;transform:translateY(-16px);transition:opacity 560ms ' + EASE + ' 520ms,transform 720ms ' + EASE + ' 520ms;}' +
    ':host([data-form]) .idot{opacity:1;transform:none;}' +
    // one restrained polished-glass pass: narrow highlight, subtle falloff,
    // finishes before the seam appears
    '.glassclip{position:absolute;inset:-14% -30%;overflow:hidden;pointer-events:none;}' +
    '.glass{position:absolute;inset:0;opacity:0;background:linear-gradient(112deg,transparent 44.5%,rgba(255,255,255,.16) 47.5%,rgba(255,255,255,.38) 50%,rgba(255,13,126,.14) 52.5%,transparent 55.5%);transform:translateX(-85%);}' +
    ':host([data-glass]) .glass{opacity:1;transition:transform 540ms cubic-bezier(.33,.0,.2,1),opacity 160ms linear;transform:translateX(85%);}' +
    ':host([data-glass-done]) .glass{opacity:0;}' +
    '.halo{position:absolute;inset:-40%;pointer-events:none;opacity:0;background:radial-gradient(closest-side,rgba(255,13,126,.09),transparent 72%);transition:opacity 420ms ' + EASE + ';}' +
    ':host([data-glass]) .halo{opacity:1;}' +
    ':host([data-glass-done]) .halo{opacity:0;}' +
    // rAF odometer counter (transforms written every frame; no CSS transitions)
    '.count{position:absolute;left:clamp(18px,3.2vw,46px);bottom:clamp(16px,3vw,42px);display:flex;align-items:baseline;color:rgba(255,255,255,.9);font:600 clamp(15px,1.5vw,21px)/1 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;letter-spacing:.06em;font-variant-numeric:tabular-nums;}' +
    '.dcol{height:1em;overflow:hidden;}' +
    '.dstrip{display:block;will-change:transform;}' +
    '.dstrip span{display:block;height:1em;}' +
    '.pct{opacity:.55;margin-left:.35em;}' +
    '@media (prefers-reduced-motion:reduce){:host{display:none!important;}}';

  function CaniStartup() {
    var self = Reflect.construct(HTMLElement, [], CaniStartup);
    return self;
  }
  CaniStartup.prototype = Object.create(HTMLElement.prototype);
  CaniStartup.prototype.constructor = CaniStartup;

  CaniStartup.prototype.connectedCallback = function () {
    if (this.__init) return;
    this.__init = true;
    var host = this;
    var cleanupFns = [];
    var finished = false;

    function safe(fn) { try { return fn(); } catch (e) { return undefined; } }

    var timings = { connect: 0, form: null, glass: null, seam: null, parting: null, progress100: null, overlayClear: null, heroPlay: null, reason: null };
    safe(function () { window.__caniIntroTimings = timings; });

    function finish(reason) {
      if (finished) return;
      finished = true;
      safe(function () { if (!timings.reason) timings.reason = reason; if (timings.overlayClear === null) timings.overlayClear = Math.round(((window.performance && performance.now) ? performance.now() : Date.now()) - (window.__caniT0 || 0)); timings.absoluteClear = Math.round((window.performance && performance.now) ? performance.now() : 0); });
      safe(function () { host.setAttribute('data-done', ''); });
      safe(function () { host.style.display = 'none'; host.style.pointerEvents = 'none'; host.style.visibility = 'hidden'; });
      safe(function () {
        var w = host.parentElement;
        for (var i = 0; i < 4 && w; i++) {
          if (w.id && /^comp-/.test(w.id)) { w.style.pointerEvents = 'none'; w.style.visibility = 'hidden'; break; }
          w = w.parentElement;
        }
      });
      safe(unlockScroll);
      for (var i = 0; i < cleanupFns.length; i++) safe(cleanupFns[i]);
      cleanupFns.length = 0;
      safe(function () {
        host.dispatchEvent(new CustomEvent('cani:intro-complete', { bubbles: true, composed: true, detail: { reason: reason } }));
      });
    }

    // ---- immediate-bypass conditions -------------------------------------
    var reduced = safe(function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; });
    if (reduced) { finish('reduced-motion'); return; }
    // deep link or restored scroll: never hijack; homepage immediately
    var deep = safe(function () { return (window.scrollY || 0) > 40 || (location.hash && location.hash.length > 1); });
    if (deep) { finish('deep-entry'); return; }

    var KEY = 'caniIntroPlayed-v2';
    // review-only replay flag (documented; disable before final acceptance)
    var review = safe(function () { return /[?&]caniIntroReview=1/.test(location.search); });
    var played = safe(function () { return sessionStorage.getItem(KEY) === '1'; });
    if (played && !review) { finish('session-repeat'); return; }
    safe(function () { sessionStorage.setItem(KEY, '1'); });

    var prevOverflow = null;
    function lockScroll() { safe(function () { prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; }); }
    function unlockScroll() { safe(function () { if (prevOverflow !== null) { document.documentElement.style.overflow = prevOverflow; prevOverflow = null; } }); }
    lockScroll();

    var root = this.attachShadow({ mode: 'open' });
    host.setAttribute('aria-hidden', 'true');
    var strip = '<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>';
    root.innerHTML = '<style>' + CSS + '</style>' +
      '<div class="plane plane--top"></div>' +
      '<div class="plane plane--bot"></div>' +
      '<div class="seam"></div>' +
      '<div class="stage">' +
        '<div class="mark">' +
          '<svg viewBox="1521 321 140 559" aria-hidden="true">' +
            '<path class="ivec" d="' + I_STEM + '" fill="' + MAGENTA + '"></path>' +
            '<path class="idot" d="' + I_DOT + '" fill="' + MAGENTA + '"></path>' +
          '</svg>' +
          '<div class="halo"></div>' +
          '<div class="track"></div>' +
          '<div class="glassclip"><div class="glass"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="count"><span class="dcol"><span class="dstrip" data-d="h">' + strip + '</span></span>' +
      '<span class="dcol"><span class="dstrip" data-d="t">' + strip + '</span></span>' +
      '<span class="dcol"><span class="dstrip" data-d="o">' + strip + '</span></span><span class="pct">%</span></div>';

    var stripH = root.querySelector('[data-d="h"]');
    var stripT = root.querySelector('[data-d="t"]');
    var stripO = root.querySelector('[data-d="o"]');

    // ---- timing ----------------------------------------------------------
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    safe(function () { window.__caniT0 = t0; });
    function now() { return ((window.performance && performance.now) ? performance.now() : Date.now()) - t0; }
    // V2.1: fail-open anchored to absolute page time (navigation start), so a
    // late-connecting served bundle cannot push absence past the 5.2 s wall.
    // fastExit needs ~320 ms (150 fade + 170 finish); 4800 leaves ~400 ms slop.
    var FAIL_AT = Math.min(4550, Math.max(0, 4800 - t0));
    // ---- progress model (monotonic, eased, resolves deliberately) --------
    var displayed = 0;       // odometer value actually shown
    var resolveStart = null; // when the 92->100 resolve began
    var heroReady = false;
    var heroVideo = null;

    function targetProgress(t) {
      if (resolveStart !== null) {
        var k = Math.min(1, (t - resolveStart) / 380);
        var e = 1 - Math.pow(1 - k, 3);
        return 92 + 8 * e;
      }
      if (t <= 250) return 0;
      if (t <= 1650) {
        var u = (t - 250) / 1400;
        var eu = 1 - Math.pow(1 - u, 3);
        return 88 * eu;
      }
      // drift 88 -> 92 while awaiting readiness (slow, honest)
      return Math.min(92, 88 + (t - 1650) / 350);
    }

    function renderOdometer(v) {
      v = Math.max(displayed, Math.min(100, v)); // monotonic, capped at 100
      displayed = v;
      // true odometer carry: a column rolls ONLY while the column below wraps
      // 9 -> 0. The leading digits stay planted on their value - never a
      // continuous drift that can read as an impossible percentage.
      var ones = v % 10;
      var tens = Math.floor(v / 10) % 10 + Math.max(0, ones - 9);
      var hund = Math.floor(v / 100) % 10 + Math.max(0, tens - 9);
      if (v >= 100) { ones = 0; tens = 0; hund = 1; }
      safe(function () {
        stripO.style.transform = 'translateY(' + (-ones) + 'em)';
        stripT.style.transform = 'translateY(' + (-tens) + 'em)';
        stripH.style.transform = 'translateY(' + (-hund) + 'em)';
      });
    }

    // ---- hero coordination ----------------------------------------------
    function findHero() {
      return safe(function () {
        var c = document.getElementById('comp-mrwen3im');
        var v = c ? c.querySelector('video') : null;
        if (!v) v = document.querySelector('video');
        return v || null;
      }) || null;
    }
    function prepareHero(v) {
      safe(function () { v.muted = true; });
      safe(function () { v.pause(); });
      safe(function () { if (v.currentTime > 0.05) v.currentTime = 0; });
    }
    function startHero() {
      var v = heroVideo || findHero();
      if (!v) return;
      safe(function () { if (v.currentTime > 0.05) v.currentTime = 0; });
      safe(function () { v.muted = true; var p = v.play(); if (p && p.catch) p.catch(function () {}); });
      timings.heroPlay = Math.round(now());
    }

    var canplayHandler = function (ev) { safe(function () { heroReady = true; heroVideo = ev.target; }); };
    var attachTimer = setInterval(function () {
      safe(function () {
        var v = findHero();
        if (!v) return;
        heroVideo = v;
        if (!v.__caniPrepared && v.readyState >= 1) { v.__caniPrepared = true; prepareHero(v); }
        if (v.readyState >= 2) heroReady = true;
        if (!v.__caniCanplayHooked) {
          v.__caniCanplayHooked = true;
          v.addEventListener('canplay', canplayHandler);
          cleanupFns.push(function () { safe(function () { v.removeEventListener('canplay', canplayHandler); }); });
        }
      });
    }, 200);
    cleanupFns.push(function () { clearInterval(attachTimer); });

    // ---- exits ------------------------------------------------------------
    var parting = false;
    function beginParting(reason) {
      if (parting || finished) return;
      parting = true;
      timings.reason = reason;
      timings.parting = Math.round(now());
      safe(function () { host.setAttribute('data-parting', ''); });
      startHero();
      unlockScroll();
      var doneTimer = setTimeout(function () {
        timings.overlayClear = Math.round(now());
        finish(reason);
      }, 640);
      cleanupFns.push(function () { clearTimeout(doneTimer); });
    }
    function fastExit(reason) {
      // delayed/failed hero or skip: cover gone quickly, input restored NOW
      if (parting || finished) return;
      parting = true;
      timings.reason = reason;
      unlockScroll();
      safe(function () { host.setAttribute('data-skip', ''); host.style.pointerEvents = 'none'; });
      startHero();
      var doneTimer = setTimeout(function () {
        timings.overlayClear = Math.round(now());
        finish(reason);
      }, 170);
      cleanupFns.push(function () { clearTimeout(doneTimer); });
    }

    // ---- master rAF driver ------------------------------------------------
    var raf = 0;
    function frame() {
      if (finished || parting) return;
      var t = now();
      renderOdometer(targetProgress(t));
      if (t >= 1250 && !host.hasAttribute('data-form')) { safe(function () { host.setAttribute('data-form', ''); }); timings.form = Math.round(t); }
      if (t >= 2800 && !host.hasAttribute('data-glass')) { safe(function () { host.setAttribute('data-glass', ''); }); timings.glass = Math.round(t); }
      if (t >= 3400 && !host.hasAttribute('data-glass-done')) safe(function () { host.setAttribute('data-glass-done', ''); });
      // deliberate 92->100 resolve once the hero is ready (and we are past the
      // brand settle), timed so 100 lands within the completion hold
      if (resolveStart === null && heroReady && t >= 2950) { resolveStart = t; }
      if (displayed >= 99.9 && timings.progress100 === null) timings.progress100 = Math.round(t);
      if (t >= 3650 && !host.hasAttribute('data-seam') && heroReady && displayed >= 99.9) { safe(function () { host.setAttribute('data-seam', ''); }); timings.seam = Math.round(t); }
      // handoff: seam shown ~150 ms, then part. Total clear 4.1-4.4 s.
      if (heroReady && displayed >= 99.9 && t >= 3720) { beginParting('hero-ready'); return; }
      // delayed hero: overlay must be FULLY ABSENT by 5.2 s
      if (t >= FAIL_AT) { renderOdometer(100); fastExit('fail-open-' + Math.round(FAIL_AT)); return; }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    cleanupFns.push(function () { cancelAnimationFrame(raf); });

    // absolute guard in case rAF is throttled/broken
    var guardTimer = setTimeout(function () { fastExit('guard-' + Math.round(FAIL_AT + 150)); }, FAIL_AT + 150);
    cleanupFns.push(function () { clearTimeout(guardTimer); });

    // ---- skip (fully clear + input restored within 250 ms) ---------------
    var skip = function (e) {
      if (e && e.type === 'keydown' && ['Escape', 'Enter', ' ', 'Spacebar'].indexOf(e.key) < 0) return;
      fastExit('skipped');
    };
    window.addEventListener('keydown', skip, true);
    host.addEventListener('pointerdown', skip, true);
    host.addEventListener('touchstart', skip, true);
    cleanupFns.push(function () {
      window.removeEventListener('keydown', skip, true);
      safe(function () { host.removeEventListener('pointerdown', skip, true); host.removeEventListener('touchstart', skip, true); });
    });

    renderOdometer(0);
  };

  Object.setPrototypeOf(CaniStartup, HTMLElement);
  customElements.define(TAG, CaniStartup);
})();
