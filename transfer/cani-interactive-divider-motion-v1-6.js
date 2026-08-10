/*
 * <cani-interactive-divider>
 * MOTION-V1-1, 2026-08-07 - one-shot viewport-triggered entrance reveal.
 * Corrects two defects in MOTION-V1:
 *   D-MOTION-01 the page-load watchdog completed the reveal before the
 *               visitor scrolled. Replaced with a proximity-gated watchdog.
 *   D-MOTION-02 transitions were declared on the armed state, so arming
 *               animated visible -> hidden. Replaced with a four-state model
 *               (static/armed/revealing/revealed) and a committed paint
 *               boundary between armed and revealing.
 * Additive only: no existing rule, selector, string or behaviour is modified.
 * Built from Velo baseline 9021 B / 3D38E198... by build-divider-motion-v1-1.mjs.
 *
 * Local-review divider V1.3, 2026-07-30.
 *
 * Near-black Cani strip with a pointer-following Cani-pink circle, placed
 * between protected Mobile Analytics V5 and 8x8 Work V4 components.
 */
(function () {
  'use strict';

  // Cross-section rhythm gate (shared page-level, keyed per section): when a
  // DIFFERENT section began its entrance less than 65% of its main duration
  // ago, this one waits for the remainder, capped at 400ms so nothing ever
  // feels stuck. Same-key calls never wait (a section must not delay
  // itself). Any failure -> zero delay (fail-open).
  function rvGate(key, mainMs) {
    try {
      var now = Date.now();
      var g = window.__caniRvGate || (window.__caniRvGate = { until: 0, key: '' });
      var wait = (g.key && g.key !== key) ? Math.min(Math.max(0, g.until - now), 400) : 0;
      g.key = key; g.until = now + wait + Math.round(mainMs * 0.65);
      return wait;
    } catch (e) { return 0; }
  }


  var TAG = 'cani-interactive-divider';
  if (!window.customElements || customElements.get(TAG)) return;

  var TEMPLATE =
    '<style>' +
      ':host{display:block;position:relative;width:min(1426px,calc(100% - 32px));height:clamp(150px,17.8vw,254px);margin:0 auto;contain:layout style paint;}' +
      '.strip{box-sizing:border-box;position:relative;width:100%;height:100%;overflow:hidden;background:#19191d;border:3px solid #fff;box-shadow:0 0 0 1px rgba(10,10,12,.08);isolation:isolate;touch-action:pan-y;}' +
      'svg{position:absolute;inset:0;width:100%;height:100%;z-index:0;}' +
      '.blob{fill:#ff1478;}' +
      '.content{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;gap:clamp(12px,1.3vw,22px);padding:18px 24px;color:#fff;}' +
      '.label{font-family:Arial,Helvetica,sans-serif;font-size:clamp(18px,4.25vw,61px);font-weight:900;line-height:.95;letter-spacing:-.055em;text-transform:uppercase;white-space:nowrap;}' +
      '.action{box-sizing:border-box;display:grid;place-items:center;flex:0 0 auto;width:clamp(58px,6.5vw,86px);height:clamp(34px,3.7vw,50px);color:#fff;background:transparent;border:2px solid #fff;border-radius:999px;text-decoration:none;transition:transform .22s cubic-bezier(.22,1,.36,1),background-color .22s ease,color .22s ease;}' +
      '.action svg{position:static;width:18px;height:18px;overflow:visible;}' +
      '.action path{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}' +
      '.action:hover,.action:focus-visible{transform:scale(1.055);color:#ff1478;background:#fff;outline:none;}' +
      '.action:focus-visible{box-shadow:0 0 0 4px rgba(255,255,255,.45);}' +
      '@media(max-width:880px){.action{height:44px;}}@media(max-width:600px){:host{width:calc(100% - 20px);height:150px}.strip{border-width:2px}.content{gap:12px;padding:16px;justify-content:space-between}.rv-mask{flex:1 1 auto;min-width:0}.label{font-size:clamp(19px,5.6vw,24px);letter-spacing:-.04em;white-space:normal;line-height:1.04;text-align:left}.action{width:52px;height:44px;flex:0 0 auto}.action svg{width:15px;height:15px}}' +
      '@media(max-width:360px){.content{gap:10px;padding:16px}.label{font-size:19px;letter-spacing:-.035em}.action{width:44px;height:44px;flex:0 0 auto}.action svg{width:14px;height:14px}}' +
      '@media(prefers-reduced-motion:reduce){.action{transition:none!important}}' +
      ':host{--rv-ease:cubic-bezier(0.22,1,0.36,1);--rv-ease-soft:cubic-bezier(0.22,1,0.36,1);--rv-band:850ms;--rv-label:700ms;--rv-action:650ms;--rv-travel:26px;}:host([data-rv="armed"]) .strip{clip-path:inset(0 0 100% 0);transition:none!important;}:host([data-rv="armed"]) .label{transform:translateY(var(--rv-travel));opacity:0;transition:none!important;}:host([data-rv="armed"]) .rv-pop{transform:scale(.92);opacity:0;transition:none!important;}:host([data-rv="revealing"]) .strip{clip-path:inset(0 0 0 0);transition:clip-path var(--rv-band) var(--rv-ease);}:host([data-rv="revealing"]) .label{transform:translateY(0);opacity:1;transition:transform var(--rv-label) var(--rv-ease) 90ms,opacity var(--rv-label) var(--rv-ease) 90ms;}:host([data-rv="revealing"]) .rv-pop{transform:scale(1);opacity:1;transition:transform var(--rv-action) var(--rv-ease-soft) 180ms,opacity var(--rv-action) var(--rv-ease-soft) 180ms;}:host([data-rv="revealed"]) .strip{clip-path:inset(0 0 0 0);}:host([data-rv="revealed"]) .label{transform:translateY(0);opacity:1;}:host([data-rv="revealed"]) .rv-pop{transform:scale(1);opacity:1;}.rv-mask{display:flex;align-items:center;clip-path:inset(0 -2px);min-width:0;}.rv-pop{display:flex;flex:0 0 auto;align-items:center;}@media(prefers-reduced-motion:reduce){:host([data-rv]) .strip,:host([data-rv]) .label,:host([data-rv]) .rv-pop{transition:none!important;clip-path:none!important;transform:none!important;opacity:1!important;}}' +
    '</style>' +
    '<div class="strip">' +
      '<svg viewBox="0 0 1426 254" preserveAspectRatio="none" aria-hidden="true">' +
        '<path class="blob" d="M1100 127Z"/>' +
      '</svg>' +
      '<div class="content">' +
        '<span class="rv-mask"><span class="label">All connections in one place</span></span>' +
        '<span class="rv-pop">' +
          '<a class="action" href="/contact" aria-label="All connections in one place">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>' +
        '</a>' +
        '</span>' +
      '</div>' +
    '</div>';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function Divider() {
    var self = Reflect.construct(HTMLElement, [], Divider);
    self._path = null;
    self._strip = null;
    self._raf = 0;
    self._x = 1100;
    self._y = 127;
    self._targetX = 1100;
    self._targetY = 127;
    self._vx = 0;
    self._vy = 0;
    self._radius = 0;
    self._radiusVelocity = 0;
    self._targetRadius = 0;
    self._active = false;
    self._visible = false;
    self._reduced = false;
    self._observer = null;
    self._rvObserver = null;
    self._rvGrace = 0;
    self._rvFinish = 0;
    self._rvRafGuard = 0;
    self._rvTick = 0;
    self._rvOnScroll = null;
    self._rvDone = false;
    self._onPointerMove = null;
    self._onPointerEnter = null;
    self._onPointerLeave = null;
    self._onVisibility = null;
    return self;
  }

  Divider.prototype = Object.create(HTMLElement.prototype);
  Divider.prototype.constructor = Divider;
  Object.setPrototypeOf(Divider, HTMLElement);

  Divider.prototype.connectedCallback = function () {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = TEMPLATE;
    this._path = this.shadowRoot.querySelector('.blob');
    this._strip = this.shadowRoot.querySelector('.strip');
    this._reduced = Boolean(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this._wire();
    this._render();
    this._armReveal();
  };

  Divider.prototype.disconnectedCallback = function () {
    if (this._observer) this._observer.disconnect();
    if (this._rvObserver) this._rvObserver.disconnect();
    if (this._rvGrace) clearTimeout(this._rvGrace);
    if (this._rvFinish) clearTimeout(this._rvFinish);
    if (this._rvRafGuard) clearTimeout(this._rvRafGuard);
    if (this._rvTick) cancelAnimationFrame(this._rvTick);
    if (this._rvOnScroll) {
      window.removeEventListener('scroll', this._rvOnScroll);
      window.removeEventListener('resize', this._rvOnScroll);
    }
    if (this._strip) {
      this._strip.removeEventListener('pointerenter', this._onPointerEnter);
      this._strip.removeEventListener('pointermove', this._onPointerMove);
      this._strip.removeEventListener('pointerleave', this._onPointerLeave);
    }
    document.removeEventListener('visibilitychange', this._onVisibility);
    if (this._raf) cancelAnimationFrame(this._raf);
    this._raf = 0;
  };

  Divider.prototype._wire = function () {
    var self = this;
    this._onPointerEnter = function (event) {
      var rect = self._strip.getBoundingClientRect();
      self._active = true;
      self._targetRadius = 205;
      self._targetX = clamp(((event.clientX - rect.left) / Math.max(1, rect.width)) * 1426, -40, 1466);
      self._targetY = clamp(((event.clientY - rect.top) / Math.max(1, rect.height)) * 254, -20, 274);
      if (self._radius < 1) {
        self._x = self._targetX;
        self._y = self._targetY;
      }
      self.setAttribute('data-active', '');
      self._start();
    };
    this._onPointerMove = function (event) {
      var rect = self._strip.getBoundingClientRect();
      self._targetX = clamp(((event.clientX - rect.left) / Math.max(1, rect.width)) * 1426, -40, 1466);
      self._targetY = clamp(((event.clientY - rect.top) / Math.max(1, rect.height)) * 254, -20, 274);
      self._targetRadius = 205;
      self._start();
    };
    this._onPointerLeave = function () {
      self._active = false;
      self._targetRadius = 0;
      self.removeAttribute('data-active');
      self._start();
    };
    this._onVisibility = function () {
      if (!document.hidden && self._visible) self._start();
    };
    this._strip.addEventListener('pointerenter', this._onPointerEnter, { passive: true });
    this._strip.addEventListener('pointermove', this._onPointerMove, { passive: true });
    this._strip.addEventListener('pointerleave', this._onPointerLeave, { passive: true });
    document.addEventListener('visibilitychange', this._onVisibility);

    if ('IntersectionObserver' in window) {
      this._observer = new IntersectionObserver(function (entries) {
        self._visible = Boolean(entries[0] && entries[0].isIntersecting);
        if (self._visible && (self._active || self._radius > 0.1)) self._start();
        else if (!self._visible && self._raf) {
          cancelAnimationFrame(self._raf);
          self._raf = 0;
        }
      }, { rootMargin: '120px 0px' });
      this._observer.observe(this);
    } else {
      this._visible = true;
    }
  };


  /*
   * One-shot viewport-triggered entrance.
   *
   * State model: static | armed | revealing | revealed.
   * Fail-open by construction - the component renders final and visible, and
   * only ever becomes hidden once JS has proved it can run, an observer is
   * armed to un-hide it, AND the element is off screen so no one can see the
   * pre-state being applied.
   */

  // Within, or immediately adjacent to, the viewport. Used both to decide
  // whether arming is safe and to gate the watchdog.
  Divider.prototype._rvInZone = function () {
    var r = this.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!vh) return true;               // cannot measure: assume visible, fail open
    return r.top < vh * 0.9 && r.bottom > 0;
  };

  Divider.prototype._rvSettle = function (reason) {
    if (this._rvDone) return;
    this._rvDone = true;
    if (this._rvGrace) { clearTimeout(this._rvGrace); this._rvGrace = 0; }
    if (this._rvFinish) { clearTimeout(this._rvFinish); this._rvFinish = 0; }
    if (this._rvRafGuard) { clearTimeout(this._rvRafGuard); this._rvRafGuard = 0; }
    if (this._rvTick) { cancelAnimationFrame(this._rvTick); this._rvTick = 0; }
    if (this._rvObserver) { this._rvObserver.disconnect(); this._rvObserver = null; }
    if (this._rvOnScroll) {
      window.removeEventListener('scroll', this._rvOnScroll);
      window.removeEventListener('resize', this._rvOnScroll);
      this._rvOnScroll = null;
    }
    this.setAttribute('data-rv-reason', reason);
    // If we never armed, there is no pre-state to lift - go straight to final.
    if (this.getAttribute('data-rv') !== 'armed') {
      this.setAttribute('data-rv', 'revealed');
      return;
    }
    var self = this;
    var toRevealing = function () {
      if (self.getAttribute('data-rv') !== 'armed') return;
      var gateWait = rvGate('divider', 850);
      if (gateWait > 0) { setTimeout(toRevealing0, gateWait); return; }
      toRevealing0();
    };
    var toRevealing0 = function () {
      if (self.getAttribute('data-rv') !== 'armed') return;
      self.setAttribute('data-rv', 'revealing');
      // longest channel is the 850ms band wipe; label 90+700, action 180+650
      try {
        self._rvFinish = setTimeout(function () {
          self.setAttribute('data-rv', 'revealed');
        }, 1050);
      } catch (e) { self.setAttribute('data-rv', 'revealed'); }
    };
    // Commit the armed pre-state as a real paint before enabling transitions,
    // so the browser cannot coalesce armed and revealing into one interpolation.
    try {
      void this.offsetHeight;
      requestAnimationFrame(function () {
        try { requestAnimationFrame(toRevealing); } catch (e) { toRevealing(); }
      });
      // Safety net: if rAF never runs the callback - throttled, patched by a
      // third-party script, or otherwise broken - the element must not stay
      // stranded in the hidden armed state. Anything still armed after 250ms is
      // promoted regardless. Without this, one broken rAF hides the band forever.
      this._rvRafGuard = setTimeout(toRevealing, 250);
    } catch (e) {
      // rAF itself threw: skip the animation entirely and show the final state.
      // A missed entrance is a cosmetic loss; invisible content is not.
      this.setAttribute('data-rv', 'revealed');
    }
  };

  Divider.prototype._armReveal = function () {
    var self = this;
    if (this._reduced) { this.setAttribute('data-rv', 'static'); return; }
    // typeof, not 'in': the property can exist while holding undefined or a
    // non-constructor stub, which would apply the pre-state with nothing able
    // to lift it.
    if (typeof window.IntersectionObserver !== 'function' ||
        typeof requestAnimationFrame !== 'function') {
      this.setAttribute('data-rv', 'static');
      return;
    }
    // Never hide something already on screen. Deep link, refresh partway down
    // and history restore all land here.
    if (this._rvInZone()) { this.setAttribute('data-rv', 'static'); this._rvDone = true;
      this.setAttribute('data-rv-reason', 'in-view-at-load'); return; }

    try {
      this.setAttribute('data-rv', 'armed');
      this._rvObserver = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) { self._rvSettle('observed'); return; }
        }
      }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });
      this._rvObserver.observe(this);

      // Proximity-gated watchdog. NOT a page-load timer: it can only start a
      // grace period while the element is genuinely in the zone, so dwelling
      // above the divider indefinitely never triggers it.
      this._rvOnScroll = function () {
        if (self._rvDone || self._rvTick) return;
        self._rvTick = requestAnimationFrame(function () {
          self._rvTick = 0;
          if (self._rvDone) return;
          if (!self._rvInZone()) {
            if (self._rvGrace) { clearTimeout(self._rvGrace); self._rvGrace = 0; }
            return;
          }
          if (!self._rvGrace) {
            self._rvGrace = setTimeout(function () { self._rvSettle('watchdog'); }, 400);
          }
        });
      };
      window.addEventListener('scroll', this._rvOnScroll, { passive: true });
      window.addEventListener('resize', this._rvOnScroll, { passive: true });
    } catch (err) {
      this._rvSettle('error');
    }
  };

  Divider.prototype._start = function () {
    var self = this;
    if (this._raf || document.hidden || !this._visible || this._reduced) return;
    this._raf = requestAnimationFrame(function tick() {
      self._raf = 0;
      self._vx += (self._targetX - self._x) * 0.055;
      self._vy += (self._targetY - self._y) * 0.07;
      self._vx *= 0.78;
      self._vy *= 0.76;
      self._x += self._vx;
      self._y += self._vy;
      self._radiusVelocity += (self._targetRadius - self._radius) * 0.065;
      self._radiusVelocity *= 0.8;
      self._radius += self._radiusVelocity;
      self._render();
      var unsettled = Math.abs(self._radius - self._targetRadius) > 0.12 ||
        Math.abs(self._radiusVelocity) > 0.08 ||
        Math.abs(self._vx) > 0.08 ||
        Math.abs(self._vy) > 0.08;
      if (self._visible && !document.hidden && (self._active || unsettled)) self._start();
    });
  };

  Divider.prototype._render = function () {
    if (!this._path) return;
    var rect = this.shadowRoot.querySelector('svg').getBoundingClientRect();
    var scaleX = rect.width / 1426;
    var scaleY = rect.height / 254;
    var radiusY = Math.max(0, this._radius);
    var radiusX = scaleX > 0 ? radiusY * (scaleY / scaleX) : radiusY;
    var right = this._x + radiusX;
    var left = this._x - radiusX;
    var path = 'M' + right.toFixed(2) + ' ' + this._y.toFixed(2) +
      ' A' + radiusX.toFixed(2) + ' ' + radiusY.toFixed(2) +
      ' 0 1 0 ' + left.toFixed(2) + ' ' + this._y.toFixed(2) +
      ' A' + radiusX.toFixed(2) + ' ' + radiusY.toFixed(2) +
      ' 0 1 0 ' + right.toFixed(2) + ' ' + this._y.toFixed(2) + ' Z';
    this._path.setAttribute('d', path);
    this.setAttribute('data-radius', Math.max(0, this._radius).toFixed(2));
    this.setAttribute('data-radius-x', radiusX.toFixed(2));
    this.setAttribute('data-center-x', this._x.toFixed(2));
    this.setAttribute('data-center-y', this._y.toFixed(2));
    this.setAttribute('data-motion', this._reduced ? 'reduced' : 'active');
  };

  customElements.define(TAG, Divider);
}());

/*
 * CANI PAGE REVEAL ORCHESTRATOR v2 - 2026-08-08
 *
 * v1 drove the FAQ and the final CTA. v2 adds my.plan, because the audit showed
 * v1's arrangement did not give my.plan a visitor-visible scroll reveal at
 * 768x1024 or 320x720: the component's own fail-open sees a narrow strip of the
 * section intersecting at first paint (245px of 1363px, and 48px of 1814px),
 * declines to hide painted content, and renders static. The CSS host entrance
 * that covered that case then played while the section was still essentially
 * off screen, which is not a scroll reveal.
 *
 * v2 makes the my.plan section entrance a real trigger at every width:
 *
 *   - styles/global.css hides the host PRE-PAINT, so nothing is ever hidden
 *     late and there is no visible-to-hidden flash;
 *   - this controller marks the host "armed" at init, which cancels the CSS
 *     fail-open and takes ownership;
 *   - the reveal fires only on MEANINGFUL visibility - at least 320px of the
 *     section on screen, rising to 420px, with a ratio allowance for a short
 *     section and a cap at 90% of the viewport so it always remains reachable -
 *     so the entrance is actually experienced rather than completing off screen,
 *     and a mid-layout height measurement cannot lower the bar (v2.1);
 *   - it is one-shot: the observer is disconnected on first activation and the
 *     revealed state is retained, so scrolling away and back neither hides nor
 *     replays it;
 *   - if this controller never runs, never sees the element, or throws, the
 *     "armed" class is never applied or is removed again and the CSS fail-open
 *     reveals the section on its own. Content cannot stay hidden.
 *
 * Class names are applied in BOTH plain and wixui- prefixed form. The Wix CSS
 * pipeline rewrites author class tokens in global.css by prefixing wixui-, so a
 * rule written as .cani-rv-host-in is served as .wixui-cani-rv-host-in. Adding
 * both names means the rule matches whether or not that rewrite happens.
 *
 * FAQ and final CTA behaviour is unchanged from v1.
 */
(function () {
  'use strict';

  // Cross-section rhythm gate (shared page-level, keyed per section): when a
  // DIFFERENT section began its entrance less than 65% of its main duration
  // ago, this one waits for the remainder, capped at 400ms so nothing ever
  // feels stuck. Same-key calls never wait (a section must not delay
  // itself). Any failure -> zero delay (fail-open).
  function rvGate(key, mainMs) {
    try {
      var now = Date.now();
      var g = window.__caniRvGate || (window.__caniRvGate = { until: 0, key: '' });
      var wait = (g.key && g.key !== key) ? Math.min(Math.max(0, g.until - now), 400) : 0;
      g.key = key; g.until = now + wait + Math.round(mainMs * 0.65);
      return wait;
    } catch (e) { return 0; }
  }


  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    if (window.__caniPageRevealV1) return;
    window.__caniPageRevealV1 = true;

    var GROUPS = [
      { key: 'faq', trigger: 'comp-mqu5uy3f', members: ['comp-mqu5vvmm'], stagger: 0 },
      {
        key: 'cta',
        trigger: 'comp-mqh72blt',
        members: [
          'comp-mqh72blx',
          'comp-mqh72blz1',
          'comp-mqh72bm14',
          'comp-mqh72bm33',
          'comp-mqh72bme3'
        ],
        stagger: 70
      }
    ];

    // Host-class group: the element is hidden by global.css before paint and
    // released here. Only my.plan uses this model.
    var HOSTS = [
      { key: 'myplan', section: 'comp-ms34fa7d', host: 'cani-myplan-section' }
    ];

    var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
    var PROPS = ['opacity', 'transform', 'transition', 'willChange'];
    var MIN_VISIBLE_PX = 420;
    var MIN_VISIBLE_RATIO = 0.35;
    var MIN_VISIBLE_FLOOR_PX = 320;

    var reduced = false;
    try {
      reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) { reduced = false; }

    var small = false;
    try {
      small = !!(window.matchMedia && window.matchMedia('(max-width: 750px)').matches);
    } catch (e) { small = false; }

    var travel = small ? 18 : 26;
    var duration = small ? 620 : 780;
    var staggerScale = small ? 0.7 : 1;

    var armed = [];
    var hostRecords = [];

    if (reduced || !window.IntersectionObserver) {
      // Reduced motion is handled entirely by the stylesheet, which renders the
      // final state immediately. Nothing is armed, so nothing needs releasing.
      whenReady(function () { mark('static'); });
      return;
    }

    function mark(state) {
      try {
        for (var i = 0; i < GROUPS.length; i++) {
          var t = document.getElementById(GROUPS[i].trigger);
          if (t) t.setAttribute('data-rv', state);
        }
        for (var j = 0; j < HOSTS.length; j++) {
          var s = document.getElementById(HOSTS[j].section);
          if (s) s.setAttribute('data-rv-host', state);
        }
      } catch (e) { /* fail open */ }
    }

    function addClasses(el, name) {
      try { el.classList.add(name); el.classList.add('wixui-' + name); } catch (e) { /* fail open */ }
    }
    function removeClasses(el, name) {
      try { el.classList.remove(name); el.classList.remove('wixui-' + name); } catch (e) { /* fail open */ }
    }

    /** How much of this element is actually on screen, in CSS pixels. */
    function visiblePx(el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      return Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    }

    /** Enough of the section is on screen for the entrance to be experienced. */
    function meaningfullyVisible(el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      // The ratio branch exists so a short section is not held hostage to an
      // absolute pixel count it can never reach. It needs a floor: a section
      // still being laid out reports a fraction of its settled height - my.plan
      // measures 447px before settling to 1363px at 768x1024 - and without a
      // floor the ratio drops the bar to 156px, which the 245px strip already on
      // screen at first paint satisfies. That race is what released my.plan at
      // load instead of on scroll.
      var need = Math.max(
        MIN_VISIBLE_FLOOR_PX,
        Math.min(MIN_VISIBLE_PX, Math.max(1, r.height) * MIN_VISIBLE_RATIO)
      );
      // Never ask for more than the viewport could ever show, or the reveal
      // could never fire at all on a short screen.
      need = Math.min(need, Math.max(1, vh) * 0.9);
      return visiblePx(el) >= need;
    }

    function saveInline(el) {
      var saved = {};
      for (var i = 0; i < PROPS.length; i++) saved[PROPS[i]] = el.style[PROPS[i]];
      return saved;
    }
    function restoreInline(el, saved) {
      for (var i = 0; i < PROPS.length; i++) el.style[PROPS[i]] = saved[PROPS[i]] || '';
    }
    function intersectsNow(el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      return r.bottom > 0 && r.top < vh;
    }
    function pastTriggerLine(el) {
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      return r.bottom > 0 && r.top < vh * 0.88;
    }

    // ---- host-class model (my.plan) ----------------------------------------

    function armHost(spec) {
      var section = document.getElementById(spec.section);
      var host = document.querySelector(spec.host);
      if (!section || !host) return null;
      // Taking ownership cancels the stylesheet's fail-open. The element is
      // already hidden from first paint, so this is not a late hide.
      addClasses(host, 'cani-rv-host-armed');
      section.setAttribute('data-rv-host', 'armed');
      return { spec: spec, section: section, host: host, done: false };
    }

    function releaseHost(rec) {
      if (!rec || rec.done) return;
      var hostWait = rvGate('myplan', 850);
      if (hostWait > 0) { rec.gateHeld = true; setTimeout(function () { rec.gateHeld = false; releaseHost(rec); }, hostWait); return; }
      rec.done = true;
      try {
        removeClasses(rec.host, 'cani-rv-host-armed');
        addClasses(rec.host, 'cani-rv-host-in');
        rec.section.setAttribute('data-rv-host', 'revealing');
        window.setTimeout(function () {
          try { rec.section.setAttribute('data-rv-host', 'revealed'); } catch (e) { /* fail open */ }
        }, 1000);
      } catch (e) {
        // Last resort: drop the armed state so the stylesheet reveals it.
        removeClasses(rec.host, 'cani-rv-host-armed');
      }
    }

    // ---- inline model (FAQ, CTA) -------------------------------------------

    function arm(group) {
      var trigger = document.getElementById(group.trigger);
      if (!trigger) return null;
      var members = [];
      for (var i = 0; i < group.members.length; i++) {
        var el = document.getElementById(group.members[i]);
        if (el) members.push(el);
      }
      if (!members.length) return null;

      // Fail open: anything already on screen when this bundle executes is left
      // exactly as painted. Hiding it here would be a late hide, and it is how a
      // restored scroll position or a deep link lands.
      if (intersectsNow(trigger)) {
        trigger.setAttribute('data-rv', 'open');
        return null;
      }

      var record = { group: group, trigger: trigger, members: [], done: false };
      for (var j = 0; j < members.length; j++) {
        var m = members[j];
        var saved = saveInline(m);
        m.style.opacity = '0';
        m.style.transform = 'translate3d(0, ' + travel + 'px, 0)';
        m.style.willChange = 'transform, opacity';
        record.members.push({ el: m, saved: saved });
      }
      trigger.setAttribute('data-rv', 'armed');
      return record;
    }

    function reveal(record) {
      if (!record || record.done) return;
      var groupWait = rvGate(record.group && record.group.key ? record.group.key : 'group', duration);
      if (groupWait > 0) { record.gateHeld = true; setTimeout(function () { record.gateHeld = false; reveal(record); }, groupWait); return; }
      record.done = true;
      try {
        record.trigger.setAttribute('data-rv', 'revealing');
        for (var i = 0; i < record.members.length; i++) {
          var m = record.members[i].el;
          var delay = Math.round(i * record.group.stagger * staggerScale);
          m.style.transition =
            'opacity ' + duration + 'ms ' + EASE + ' ' + delay + 'ms, ' +
            'transform ' + duration + 'ms ' + EASE + ' ' + delay + 'ms';
          m.style.opacity = '1';
          m.style.transform = 'translate3d(0, 0, 0)';
        }
        var total = duration + Math.round(
          (record.members.length - 1) * record.group.stagger * staggerScale
        ) + 80;
        window.setTimeout(function () { settle(record); }, total);
      } catch (e) {
        settle(record);
      }
    }

    function settle(record) {
      try {
        for (var i = 0; i < record.members.length; i++) {
          restoreInline(record.members[i].el, record.members[i].saved);
        }
        record.trigger.setAttribute('data-rv', 'revealed');
      } catch (e) { /* fail open */ }
    }

    function start() {
      try {
        for (var i = 0; i < GROUPS.length; i++) {
          var rec = arm(GROUPS[i]);
          if (rec) armed.push(rec);
        }
        for (var h = 0; h < HOSTS.length; h++) {
          var hr = armHost(HOSTS[h]);
          if (hr) hostRecords.push(hr);
        }
        if (!armed.length && !hostRecords.length) return;

        var io = new IntersectionObserver(function (entries) {
          for (var k = 0; k < entries.length; k++) {
            if (!entries[k].isIntersecting) continue;
            var target = entries[k].target;
            for (var n = 0; n < armed.length; n++) {
              if (armed[n].trigger === target) { io.unobserve(target); reveal(armed[n]); }
            }
            for (var q = 0; q < hostRecords.length; q++) {
              // Host groups need MEANINGFUL visibility, not first contact.
              if (hostRecords[q].section === target && meaningfullyVisible(target)) {
                io.unobserve(target);
                releaseHost(hostRecords[q]);
              }
            }
          }
        }, { threshold: [0, 0.1, 0.2, 0.35, 0.5], rootMargin: '0px 0px -12% 0px' });

        for (var m = 0; m < armed.length; m++) io.observe(armed[m].trigger);
        for (var p = 0; p < hostRecords.length; p++) io.observe(hostRecords[p].section);

        // Proximity-gated watchdog, NOT a wall-clock failsafe. A fixed timer
        // would burn the reveal off-screen while the visitor is still reading an
        // earlier section - the D-MOTION-01 defect already corrected in the
        // divider. This only ever fires for something that has actually arrived.
        var watch = function () {
          var pending = 0;
          for (var a = 0; a < armed.length; a++) {
            if (armed[a].done) continue;
            if (pastTriggerLine(armed[a].trigger)) { io.unobserve(armed[a].trigger); reveal(armed[a]); }
            else pending++;
          }
          for (var b = 0; b < hostRecords.length; b++) {
            if (hostRecords[b].done) continue;
            if (meaningfullyVisible(hostRecords[b].section)) {
              io.unobserve(hostRecords[b].section);
              releaseHost(hostRecords[b]);
            } else pending++;
          }
          if (!pending) {
            window.removeEventListener('scroll', watch, true);
            window.removeEventListener('resize', watch, true);
          }
        };
        window.addEventListener('scroll', watch, { passive: true, capture: true });
        window.addEventListener('resize', watch, { passive: true, capture: true });
        window.setTimeout(watch, 1200);
      } catch (e) {
        for (var z = 0; z < armed.length; z++) reveal(armed[z]);
        for (var y = 0; y < hostRecords.length; y++) {
          // Drop ownership so the stylesheet's fail-open reveals the section.
          removeClasses(hostRecords[y].host, 'cani-rv-host-armed');
        }
      }
    }

    whenReady(start);

    function whenReady(fn) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn, { once: true });
      } else {
        fn();
      }
    }
  } catch (e) { /* fail open - never block the page */ }
}());
