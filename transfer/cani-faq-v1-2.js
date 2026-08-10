/**
 * CANI-FAQ-V1.2 - V1.1 with the premium-polish motion family: row/CTA
 * entrances 480ms -> 560ms (550-700ms text window) and the cross-section
 * rhythm gate. Rollback: cani-faq-v1-1.js (16,574 B, SHA-256 C6D6436D...10C2).
 *
 * Lineage: CANI-FAQ-V1.1 - V1 plus the approved scroll-triggered entrance.
 *
 * V1 (frozen rollback source: cani-faq-v1.js, 10,236 B,
 * SHA-256 B5A5AC2D839A25360E7E6E6A800F524CA85AEC816D17F75B6DCD57B6E5884274)
 * rendered immediately with no reveal. V1.1 adds the required premium entrance,
 * implemented INSIDE the component because the page cannot reliably animate
 * Shadow DOM content. Content, spacing, accordion behaviour and the 88/64/48px
 * gap padding are unchanged from V1.
 *
 * REVEAL LIFECYCLE (data-rv on the host)
 *   (none)     content fully visible - the default and the fail-open resting state
 *   "armed"    hidden, waiting for viewport entry. Set ONLY after an
 *              IntersectionObserver was constructed AND observe() succeeded AND
 *              the host is genuinely below the viewport.
 *   "revealed" one-shot entrance played; observer disconnected; never re-arms
 *   "static"   prefers-reduced-motion: settled state immediately, no animation
 *
 * Fail-open rules: no IO -> reveal immediately; already in view on load or via a
 * direct anchor -> reveal immediately; observer setup throws -> reveal; a passive
 * scroll/resize/visibility fallback re-checks geometry so a missed IO callback
 * still reveals on the visitor's own scroll. There is deliberately NO global
 * timer - an off-screen FAQ stays armed until the visitor actually reaches it.
 *
 * CHOREOGRAPHY (opacity + transform only; document height never changes)
 *   heading   rise 24px, 620ms   delay 0
 *   rows      rise 20px, 560ms   delay 90ms + 35ms stagger (10 rows: 90-405ms)
 *   CTA       rise 18px, 560ms   delay 410ms
 *   easing    cubic-bezier(.22,1,.36,1) - settles by ~890-900ms
 *
 * WHY THIS EXISTS
 * The homepage FAQ was a Wix HtmlComponent (iframe) authored 1600x2359 while its
 * document is only ~1031px tall, leaving up to ~1,400px of blank space inside the
 * iframe between the last FAQ control and the testimonial section. The iframe box
 * scales with viewport width while its inner document does not, so no authored
 * height can hold the required gap bands across widths - and a tight fixed height
 * would clip the accordion whenever a question opens. A custom element sits in
 * normal flow, hugs its content at every width, and grows naturally on expansion.
 *
 * CONTENT
 * Questions, answers, heading and CTA are VERBATIM from the original embed
 * (146b6f_310ec6b560bcbda3480190394a1827fa.html, SHA-256 338729CD...).
 * Styling is ported unchanged apart from:
 *   - the trailing padding, which now implements the required FAQ->testimonial gap:
 *       >=1200px : 88px  (band 80-100)
 *       768-1199 : 64px  (band 56-72)
 *       <=767px  : 48px  (band 40-56)
 *     The next section (testimonial) starts at this host's bottom edge, so the
 *     visual gap to its full-bleed mesh artwork equals this padding exactly.
 *   - the CTA link, which resolved its origin via document.referrer inside the
 *     iframe; in-page it resolves from location.origin directly (same destination).
 *
 * No external requests and no global timers. The only observer is the reveal's
 * IntersectionObserver, governed by the fail-open rules above.
 */
(function () {
  'use strict';
  var TAG = 'cani-faq';
  if (customElements.get(TAG)) return;

  var EASE = 'cubic-bezier(.22,1,.36,1)';

  var FAQS = [
    ['Who is Cani?', 'Cani Communications (Canigroup Limited) is an independent UK telecoms partner with more than 25 years of trading. We bring business mobile, hosted telephony, fibre and connectivity, and lines and calls together under one relationship, one named account manager and one invoice.'],
    ['Who is Cani designed for?', 'UK businesses that want their mobile, phone systems and connectivity handled properly without juggling multiple suppliers. We work with organisations of all sizes that value clear advice, proactive account management and someone who picks up the phone.'],
    ['What can Cani do for my business?', 'We consolidate your telecoms under a single partner and review your costs line by line. Our free Bill Monitor App carries out a forensic analysis of your current bills with no obligation, identifying where you are overpaying — with savings of up to 30% in many cases.'],
    ['How easy is it to switch to Cani?', 'Straightforward. Your account manager handles the heavy lifting — auditing your current setup, planning the migration around your business, and managing the transition so day-to-day disruption is kept to a minimum.'],
    ['Are you tied to one network?', 'No. We are genuinely independent and work across the major UK networks including O2, EE, Vodafone, Three and iD Mobile. That means we recommend what is right for you, not what suits a single supplier.'],
    ['Why choose Cani over going direct to a network?', 'A single network only ever offers its own products. As an independent partner we compare options across providers and, as long-standing retention specialists, we can access tariffs and commercial terms that are not available on the open market — then back it with dedicated, named account management.'],
    ['What if I already have phones and contracts?', 'That is fine — most clients come to us mid-contract. We review what you have, flag the dates that matter, and build a plan that works around your existing commitments rather than forcing an early, costly switch.'],
    ['Can I keep my current numbers?', 'In almost all cases, yes. Mobile and landline numbers can usually be ported across to your new service, so you keep the numbers your customers already know.'],
    ['What is hosted telephony (VoIP), and should we switch?', 'Hosted telephony is a phone system that runs over the internet rather than traditional phone lines, giving you flexibility, remote working and lower call costs. With the old ISDN and PSTN network being switched off, moving to a hosted system is something every business should be planning now — and we can guide you through it.'],
    ['Do you offer support? How do I get help?', 'Yes. You get a dedicated, named account manager and proactive contract reviews, not an anonymous call centre. Call us on 0330 058 0389 or email help@canigroup.co.uk and we will help.']
  ];

  var CSS = '' +
    ':host{display:block;width:100%;' +
      '--bg:#FFFFFF;--row:#F4F4F6;--row-hover:#ECECEF;' +
      '--heading:#0B0B12;--q:#15151C;--muted:#6B7280;--accent:#FF2D78;--ring:#FF2D78;}' +
    '.faq{background:var(--bg);color:var(--q);' +
      'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;' +
      'padding:64px 20px 88px;box-sizing:border-box;width:100%;}' +
    '.faq *{box-sizing:border-box;}' +
    '.wrap{max-width:680px;margin:0 auto;}' +
    'h2{text-align:center;font-size:clamp(26px,4vw,38px);font-weight:700;' +
      'letter-spacing:-.02em;margin:0 0 32px;color:var(--heading);}' +
    '.item{background:var(--row);border-radius:14px;margin-bottom:12px;overflow:hidden;' +
      'transition:background .2s ease;}' +
    '.q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;' +
      'background:transparent;border:0;cursor:pointer;text-align:left;' +
      'padding:18px 22px;color:var(--q);font-size:16px;font-weight:600;line-height:1.4;' +
      'font-family:inherit;}' +
    '.q:hover{background:var(--row-hover);}' +
    '.q:focus-visible{outline:2px solid var(--ring);outline-offset:-2px;border-radius:14px;}' +
    '.chev{flex:0 0 auto;width:20px;height:20px;transition:transform .2s ease;color:var(--muted);}' +
    '.q[aria-expanded="true"] .chev{transform:rotate(180deg);}' +
    '.a{padding:0 22px 20px;color:var(--muted);font-size:15px;line-height:1.6;}' +
    '.a[hidden]{display:none;}' +
    '.a a{color:var(--q);text-decoration:underline;}' +
    '.cta{text-align:center;margin-top:32px;}' +
    '.cta p{color:var(--muted);font-size:15px;margin:0 0 14px;}' +
    '.cta a.btn{display:inline-block;background:var(--accent);color:#fff;text-decoration:none;' +
      'font-weight:600;font-size:15px;padding:13px 28px;border-radius:999px;' +
      'transition:filter .2s ease,transform .05s ease;}' +
    '.cta a.btn:hover{filter:brightness(1.08);}' +
    '.cta a.btn:focus-visible{outline:2px solid var(--ring);outline-offset:3px;}' +
    // Gap bands. The bottom padding is the FAQ->testimonial gap: the next section
    // starts at this host's bottom edge and its mesh artwork is full-bleed.
    '@media (max-width:1199px){.faq{padding-bottom:64px;}}' +
    '@media (max-width:767px){.faq{padding-bottom:48px;}}' +
    // Original embed typography step, preserved.
    '@media (max-width:600px){' +
      '.faq{padding-top:48px;padding-left:16px;padding-right:16px;}' +
      '.q{font-size:15px;padding:16px 18px;}' +
      '.a{padding:0 18px 18px;}}' +
    '@media (prefers-reduced-motion:reduce){.chev,.item,.cta a.btn{transition:none;}}' +
    // ---- scroll reveal ------------------------------------------------------
    // Hidden ONLY in the JS-armed state; the default (no data-rv) is fully
    // visible, so a script failure can never leave the FAQ at opacity:0.
    '@keyframes caniFaqRise{from{opacity:0;transform:translateY(var(--rv-y,22px));}to{opacity:1;transform:none;}}' +
    ':host([data-rv="armed"]) .heading,' +
    ':host([data-rv="armed"]) .item,' +
    ':host([data-rv="armed"]) .cta{opacity:0;}' +
    '.heading{--rv-y:24px;}.item{--rv-y:20px;}.cta{--rv-y:18px;}' +
    ':host([data-rv="revealed"]) .heading{animation:caniFaqRise 620ms ' + EASE + ' 0ms both;}' +
    ':host([data-rv="revealed"]) .item{animation:caniFaqRise 560ms ' + EASE + ' both;}' +
    ':host([data-rv="revealed"]) .item:nth-child(1){animation-delay:90ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(2){animation-delay:125ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(3){animation-delay:160ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(4){animation-delay:195ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(5){animation-delay:230ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(6){animation-delay:265ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(7){animation-delay:300ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(8){animation-delay:335ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(9){animation-delay:370ms;}' +
    ':host([data-rv="revealed"]) .item:nth-child(10){animation-delay:405ms;}' +
    ':host([data-rv="revealed"]) .cta{animation:caniFaqRise 560ms ' + EASE + ' 410ms both;}' +
    // Reduced motion: settled immediately, no translation, no stagger.
    '@media (prefers-reduced-motion:reduce){' +
      ':host([data-rv]) .heading,:host([data-rv]) .item,:host([data-rv]) .cta{' +
        'animation:none!important;opacity:1!important;transform:none!important;}}';

  function build(root) {
    var style = document.createElement('style');
    style.textContent = CSS;
    root.appendChild(style);

    var faq = document.createElement('div');
    faq.className = 'faq';
    faq.setAttribute('role', 'region');
    faq.setAttribute('aria-label', 'Frequently asked questions');

    var wrap = document.createElement('div');
    wrap.className = 'wrap';
    var h2 = document.createElement('h2');
    h2.className = 'heading';
    h2.textContent = 'Frequently asked questions';
    wrap.appendChild(h2);

    var list = document.createElement('div');
    list.className = 'list';
    FAQS.forEach(function (f, i) {
      var item = document.createElement('div'); item.className = 'item';
      var bId = 'cani-q-' + i, pId = 'cani-a-' + i;
      var btn = document.createElement('button');
      btn.className = 'q'; btn.type = 'button'; btn.id = bId;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', pId);
      var span = document.createElement('span');
      span.textContent = f[0];
      btn.appendChild(span);
      btn.insertAdjacentHTML('beforeend',
        '<svg class="chev" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5"/></svg>');
      var panel = document.createElement('div');
      panel.className = 'a'; panel.id = pId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', bId);
      panel.hidden = true; panel.textContent = f[1];
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        list.querySelectorAll('.q').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
        list.querySelectorAll('.a').forEach(function (p) { p.hidden = true; });
        if (!open) { btn.setAttribute('aria-expanded', 'true'); panel.hidden = false; }
      });
      item.appendChild(btn); item.appendChild(panel); list.appendChild(item);
    });
    wrap.appendChild(list);

    var cta = document.createElement('div');
    cta.className = 'cta';
    var p = document.createElement('p');
    p.textContent = 'Got more questions?';
    var a = document.createElement('a');
    a.className = 'btn';
    a.href = (location.origin || 'https://shaungordon3.wixstudio.com/my-site-4') + '/help';
    a.target = '_blank'; a.rel = 'noopener';
    a.textContent = 'View all FAQs';
    cta.appendChild(p); cta.appendChild(a);
    wrap.appendChild(cta);

    faq.appendChild(wrap);
    root.appendChild(faq);
  }

  /**
   * One-shot scroll reveal. Content is visible before this runs; the hidden
   * "armed" state is entered only once an observer is provably watching and the
   * host is genuinely below the viewport. Every failure path resolves to the
   * visible state - never the hidden one.
   */
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

  function initReveal(host) {
    try {
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
        host.setAttribute('data-rv', 'static');
        return;
      }
      if (!('IntersectionObserver' in window)) {
        host.setAttribute('data-rv', 'revealed');
        return;
      }
      var vh = window.innerHeight || document.documentElement.clientHeight || 0;
      var rect = host.getBoundingClientRect();
      // Already in view on load, or reached via a direct anchor: reveal now.
      if (rect.top < vh * 0.85 && rect.bottom > 0) {
        host.setAttribute('data-rv', 'revealed');
        return;
      }
      var done = false;
      var io = null;
      var reveal = function () {
        if (done) return;
        done = true;
        var gateWait = rvGate('faq', 620);
        if (gateWait > 0) { setTimeout(function () { host.setAttribute('data-rv', 'revealed'); }, gateWait); }
        else { host.setAttribute('data-rv', 'revealed'); }
        try { if (io) io.disconnect(); } catch (e) { /* already gone */ }
        try {
          removeEventListener('scroll', fallback);
          removeEventListener('resize', fallback);
          document.removeEventListener('visibilitychange', fallback);
        } catch (e) { /* listeners best-effort */ }
      };
      // Passive geometry fallback: if an IO callback is ever missed, the
      // visitor's own scroll still reveals. Deliberately NOT a timer - an
      // off-screen FAQ must stay armed until it is actually reached.
      var fallback = function () {
        try {
          var b = host.getBoundingClientRect();
          var v = window.innerHeight || document.documentElement.clientHeight || 0;
          if (b.top < v * 0.9 && b.bottom > 0) reveal();
        } catch (e) { reveal(); }
      };
      io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) { reveal(); return; }
        }
      }, { threshold: 0.15 });
      io.observe(host);
      // Arm the hidden state ONLY now that observe() has succeeded.
      host.setAttribute('data-rv', 'armed');
      addEventListener('scroll', fallback, { passive: true });
      addEventListener('resize', fallback, { passive: true });
      document.addEventListener('visibilitychange', fallback);
    } catch (e) {
      // An exception must never leave the FAQ hidden.
      try { host.setAttribute('data-rv', 'revealed'); } catch (e2) { /* visible by default anyway */ }
    }
  }

  function CaniFaq() {
    var self = Reflect.construct(HTMLElement, [], CaniFaq);
    return self;
  }
  CaniFaq.prototype = Object.create(HTMLElement.prototype);
  CaniFaq.prototype.constructor = CaniFaq;
  CaniFaq.prototype.connectedCallback = function () {
    if (this.__built) return;
    this.__built = true;
    build(this.attachShadow({ mode: 'open' }));
    initReveal(this);
  };
  Object.setPrototypeOf(CaniFaq, HTMLElement);
  customElements.define(TAG, CaniFaq);
})();
