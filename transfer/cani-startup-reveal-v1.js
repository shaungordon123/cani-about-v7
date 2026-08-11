/*
 * <cani-startup-reveal> -- VERSION V1
 * CANI HOMEPAGE STARTUP ANIMATION -- "THE SIGNAL i"
 * Contract: CANI_HOMEPAGE_STARTUP_ANIMATION_CONTRACT_20260810.md
 * (11,567 B, SHA-256 A4D3043A5DFCEBD38B234F43EEB286E56BB5DFC375BBA42F23806B24B1CD9F75)
 *
 * One temporary startup overlay above the approved homepage. Charcoal cover,
 * rolling 000->100 counter, centre track compressing into the EXACT magenta
 * "i" of the approved Cani master wordmark (canilogovectormaster-v2.svg,
 * SHA-256 D31CAD44A293015307034E0B36B22E461B244859B4C97E7E2A9482491B331B45 --
 * paths embedded verbatim below, never a font glyph), one restrained
 * silver-to-magenta specular pass, then the two cover planes part vertically
 * while the existing hero starts from frame zero.
 *
 * Guarantees:
 *  - fail-open at 4.5 s from connection, and on any exception
 *  - progress is monotonic; holds at 92 until the real hero reports canplay
 *  - plays once per browser session (sessionStorage, defensively)
 *  - Escape / Enter / Space / pointer / touch skips immediately
 *  - prefers-reduced-motion: homepage immediately visible and usable
 *  - shadow DOM, aria-hidden, no focusables, zero external requests
 *  - scroll locked ONLY while the cover is visibly active
 *  - after completion: overlay fully inert and hidden (host wrapper too),
 *    every timer/listener/observer disconnected,
 *    dispatches "cani:intro-complete" {reason}
 */
(function () {
  'use strict';
  var TAG = 'cani-startup-reveal';
  if (window.customElements && customElements.get(TAG)) return;

  // ---- approved master vector (verbatim from CANI_VECTOR_MASTER.pink) ------
  var I_DOT = 'M1640 355Q1640 413 1611.0 453.0Q1582 493 1541 493V479Q1541 422 1570.0 381.5Q1599 341 1640 341Z';
  var I_STEM = 'M1641 722Q1641 779 1611.5 819.5Q1582 860 1541 860V619Q1541 562 1570.5 521.5Q1600 481 1641 481Z';
  var MAGENTA = '#FF0D7E';
  var COVER = '#0c0d12';
  var EASE = 'cubic-bezier(.22,1,.36,1)';

  var CSS = '' +
    ':host{position:fixed;inset:0;z-index:2147483000;display:block;pointer-events:auto;}' +
    ':host([data-done]){display:none!important;pointer-events:none!important;}' +
    '.plane{position:absolute;left:0;width:100%;height:50.5%;background:' + COVER + ';transition:transform 820ms ' + EASE + ';will-change:transform;}' +
    '.plane--top{top:-0.5%;}' +
    '.plane--bot{bottom:-0.5%;}' +
    ':host([data-parting]) .plane--top{transform:translateY(-101%);}' +
    ':host([data-parting]) .plane--bot{transform:translateY(101%);}' +
    '.stage{position:absolute;inset:0;display:grid;place-items:center;transition:opacity 300ms ' + EASE + ',transform 640ms ' + EASE + ';}' +
    ':host([data-parting]) .stage{opacity:0;transform:scale(.92);}' +
    '.mark{position:relative;width:clamp(34px,4.6vw,64px);}' +
    '.mark svg{display:block;width:100%;height:auto;overflow:visible;}' +
    // track -> stem: the white track compresses to the stem axis; the exact
    // vector fades in matched. One critically damped run (single transition,
    // decelerating family curve, no overshoot keyframes anywhere).
    '.track{position:absolute;top:74%;left:50%;width:clamp(150px,16vw,216px);height:3px;border-radius:2px;background:rgba(255,255,255,.92);transform:translate(-50%,-50%);transform-origin:50% 50%;transition:transform 530ms ' + EASE + ',opacity 380ms ' + EASE + ' 150ms;will-change:transform;}' +
    ':host([data-form]) .track{transform:translate(-50%,-50%) rotate(90deg) scaleX(.34);opacity:0;}' +
    '.ivec{opacity:0;transform:translateY(10px);transition:opacity 420ms ' + EASE + ' 240ms,transform 520ms ' + EASE + ' 240ms;will-change:transform;}' +
    ':host([data-form]) .ivec{opacity:1;transform:none;}' +
    '.idot{opacity:0;transform:translateY(-14px);transition:opacity 380ms ' + EASE + ' 400ms,transform 500ms ' + EASE + ' 400ms;}' +
    ':host([data-form]) .idot{opacity:1;transform:none;}' +
    // one bounded specular pass: masked band crossing the mark once
    '.glass{position:absolute;inset:-30% -60%;pointer-events:none;opacity:0;background:linear-gradient(115deg,transparent 40%,rgba(233,236,241,.34) 47%,rgba(255,255,255,.55) 50%,rgba(255,13,126,.30) 53%,transparent 60%);transform:translateX(-70%);}' +
    ':host([data-glass]) .glass{opacity:1;transition:transform 460ms ' + EASE + ',opacity 200ms linear;transform:translateX(70%);}' +
    ':host([data-glass-done]) .glass{opacity:0;}' +
    '.halo{position:absolute;inset:-45%;pointer-events:none;opacity:0;background:radial-gradient(closest-side,rgba(255,13,126,.16),transparent 70%);transition:opacity 380ms ' + EASE + ';}' +
    ':host([data-glass]) .halo{opacity:1;}' +
    ':host([data-glass-done]) .halo{opacity:0;}' +
    // rolling counter, bottom-left; decorative (aria-hidden on host)
    '.count{position:absolute;left:clamp(18px,3.2vw,46px);bottom:clamp(16px,3vw,42px);display:flex;color:rgba(255,255,255,.9);font:600 clamp(15px,1.5vw,21px)/1 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;letter-spacing:.06em;}' +
    '.dcol{height:1em;overflow:hidden;}' +
    '.dstrip{display:block;transition:transform 300ms ' + EASE + ';will-change:transform;}' +
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

    // ---- completion path (single, idempotent, always reachable) ------------
    function finish(reason) {
      if (finished) return;
      finished = true;
      safe(function () { host.setAttribute('data-done', ''); });
      safe(function () { host.style.display = 'none'; host.style.pointerEvents = 'none'; host.style.visibility = 'hidden'; });
      // the Wix pinned wrapper must never keep intercepting the viewport
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

    // ---- reduced motion: homepage immediately, nothing else ----------------
    var reduced = safe(function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; });
    if (reduced) { finish('reduced-motion'); return; }

    // ---- session-once (defensive storage) ----------------------------------
    var KEY = 'caniIntroPlayed-v1';
    var played = safe(function () { return sessionStorage.getItem(KEY) === '1'; });
    if (played) {
      // internal navigation / repeat visit this session: no full entrance.
      // 180 ms opacity settle is permitted; keep it simpler and instant-safe.
      finish('session-repeat');
      return;
    }
    safe(function () { sessionStorage.setItem(KEY, '1'); });

    // ---- scroll lock only while the cover is active ------------------------
    var prevOverflow = null;
    function lockScroll() { safe(function () { prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden'; }); }
    function unlockScroll() { safe(function () { if (prevOverflow !== null) { document.documentElement.style.overflow = prevOverflow; prevOverflow = null; } }); }
    lockScroll();

    // ---- shadow DOM ---------------------------------------------------------
    var root = this.attachShadow({ mode: 'open' });
    host.setAttribute('aria-hidden', 'true');
    var strip = '<span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>0</span>';
    root.innerHTML = '<style>' + CSS + '</style>' +
      '<div class="plane plane--top"></div>' +
      '<div class="plane plane--bot"></div>' +
      '<div class="stage">' +
        '<div class="mark">' +
          '<svg viewBox="1521 321 140 559" aria-hidden="true">' +
            '<path class="ivec" d="' + I_STEM + '" fill="' + MAGENTA + '"></path>' +
            '<path class="idot" d="' + I_DOT + '" fill="' + MAGENTA + '"></path>' +
          '</svg>' +
          '<div class="halo"></div>' +
          '<div class="track"></div>' +
          '<div class="glass"></div>' +
        '</div>' +
      '</div>' +
      '<div class="count"><span class="dcol"><span class="dstrip" data-d="0">' + strip + '</span></span>' +
      '<span class="dcol"><span class="dstrip" data-d="1">' + strip + '</span></span>' +
      '<span class="dcol"><span class="dstrip" data-d="2">' + strip + '</span></span><span class="pct">%</span></div>';

    var strips = root.querySelectorAll('.dstrip');
    var stage = root.querySelector('.stage');

    // ---- monotonic progress model ------------------------------------------
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    function now() { return ((window.performance && performance.now) ? performance.now() : Date.now()) - t0; }
    var progress = 0;          // 0..100, never decreases
    var heroVideo = null;
    var heroSeen = false;
    var heroReady = false;
    var timings = { connect: 0, progress100: null, overlayClear: null, heroPlay: null, reason: null };

    function setDigits(v) {
      var s = ('00' + Math.max(0, Math.min(100, Math.round(v)))).slice(-3);
      if (v >= 100) s = '100';
      for (var i = 0; i < 3; i++) {
        safe(function () { strips[i].style.transform = 'translateY(' + (-1 * Number(s[i])) + 'em)'; });
      }
    }

    function bump(target) { if (target > progress) { progress = Math.min(100, target); setDigits(progress); } }

    // phase attribute helpers on the shadow container (styles key off host)
    function attr(name) { safe(function () { root.host.toggleAttribute ? host.setAttribute(name, '') : host.setAttribute(name, ''); }); }

    // ---- hero discovery + readiness ----------------------------------------
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

    var pollTimer = setInterval(function () {
      safe(function () {
        var t = now();
        // 0-70: time-smoothed while Wix initialises (~1.5 s ramp)
        if (t < 1500) bump(Math.min(70, (t / 1500) * 70));
        else bump(70);
        var v = findHero();
        if (v && !heroSeen) { heroSeen = true; heroVideo = v; prepareHero(v); bump(78); }
        if (v) {
          heroVideo = v;
          if (v.readyState >= 1) bump(84);
          if (v.readyState >= 2) { heroReady = true; bump(92); }
          if (v.readyState >= 3) heroReady = true;
          if (!v.__caniPrepared && v.readyState >= 1) { v.__caniPrepared = true; prepareHero(v); }
        }
        if (heroSeen && !heroReady) bump(Math.min(92, progress)); // hold at 92 max pre-ready
        // choreography phases (time-based, one-way)
        if (t >= 820) attr('data-form');
        if (t >= 1180) attr('data-glass');
        if (t >= 1700) attr('data-glass-done');
        // handoff: hero ready AND minimum entrance elapsed
        if (heroReady && t >= 1550) beginHandoff('hero-ready');
      });
    }, 90);
    cleanupFns.push(function () { clearInterval(pollTimer); });

    // canplay listener as the principal readiness signal
    var canplayHandler = function (ev) {
      safe(function () { heroReady = true; heroVideo = ev.target; bump(92); });
    };
    var attachTimer = setInterval(function () {
      safe(function () {
        var v = findHero();
        if (v && !v.__caniCanplayHooked) {
          v.__caniCanplayHooked = true;
          v.addEventListener('canplay', canplayHandler);
          cleanupFns.push(function () { safe(function () { v.removeEventListener('canplay', canplayHandler); }); });
        }
      });
    }, 250);
    cleanupFns.push(function () { clearInterval(attachTimer); });

    // ---- handoff ------------------------------------------------------------
    var parting = false;
    function beginHandoff(reason) {
      if (parting || finished) return;
      parting = true;
      timings.reason = reason;
      bump(100);
      timings.progress100 = Math.round(now());
      safe(function () { host.setAttribute('data-parting', ''); });
      startHero();
      unlockScroll(); // cover is no longer visually blocking once planes part
      var doneTimer = setTimeout(function () {
        timings.overlayClear = Math.round(now());
        safe(function () { try { window.__caniIntroTimings = timings; } catch (e) {} });
        finish(reason);
      }, 860);
      cleanupFns.push(function () { clearTimeout(doneTimer); });
    }

    // ---- hard fail-open at 4.5 s -------------------------------------------
    var failTimer = setTimeout(function () { beginHandoff('fail-open-4500'); }, 4500);
    cleanupFns.push(function () { clearTimeout(failTimer); });

    // ---- skip inputs --------------------------------------------------------
    var skip = function (e) {
      if (e && e.type === 'keydown' && ['Escape', 'Enter', ' ', 'Spacebar'].indexOf(e.key) < 0) return;
      beginHandoff('skipped');
    };
    window.addEventListener('keydown', skip, true);
    host.addEventListener('pointerdown', skip, true);
    host.addEventListener('touchstart', skip, true);
    cleanupFns.push(function () {
      window.removeEventListener('keydown', skip, true);
      safe(function () { host.removeEventListener('pointerdown', skip, true); host.removeEventListener('touchstart', skip, true); });
    });

    setDigits(0);
  };

  Object.setPrototypeOf(CaniStartup, HTMLElement);
  customElements.define(TAG, CaniStartup);
})();
