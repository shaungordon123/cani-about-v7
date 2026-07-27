/*
 * <cani-myplan-section> - Cani Communications "my.plan" homepage section.
 *
 * LAYER 1 PRODUCTION PREPARATION (staging-ready; not yet inserted into Wix).
 *
 * Visual authority: the supplied Premium light handover
 *   ("my.plan Home Page (Premium).dc.html") and reference/target-desktop-control.png.
 * Execution authority: Shaun's Layer-1 approval message (2026-07-27), the handover
 *   CLAUDE.md / CLAUDE_CODE_TASK.md / DECISION_LOG.md (D-01..D-14).
 *
 * Section-level fidelity exceptions, explicitly approved and NOT to be normalised:
 *   - Instrument Sans typography (D-05)
 *   - #FF1478 accent (D-04)
 *   These are reconsidered only at the final live-publication gate.
 *
 * Architecture decisions (recorded in MYPLAN_DEVIATION_REGISTER.md):
 *   - SHADOW DOM (mode:"open"). Chosen over the light-DOM house pattern used by the
 *     nav/rail/strip because this section is far more style-dense: the shadow boundary
 *     guarantees Wix global stylesheets cannot alter the composition in either
 *     direction. Inheritable properties (font, colour, line-height, spacing, align)
 *     are explicitly re-set on :host so nothing leaks in via inheritance. mode:"open"
 *     keeps the tree inspectable for QA and support.
 *   - The handover's inline style values are preserved VERBATIM in the template.
 *     Rationale: Shaun's verbatim directive (authority 1) outranks the handover
 *     README's "convert to idiomatic CSS" guidance; every hand conversion is a
 *     transcription-error risk, and inside a shadow root inline styles are already
 *     fully isolated. A future Next.js port should follow the README instead.
 *   - Excluded page-level regions (curtain, PSTN bar, header, mobile menu, product
 *     strip) are REMOVED from this markup, not hidden - the homepage owns them.
 *   - One deterministic state source: activeIndex 0..3 drives benefit panel, phone
 *     screen, tab selection, thumb, progress bar and card emphasis. No second timer.
 *   - Entrance choreography is re-anchored to first section visibility
 *     (IntersectionObserver) instead of page load, preserving the supplied rhythm:
 *     rise 1.1s at t0, cards stagger from t0+500ms (150ms apart), emphasis engages
 *     at t0+1900ms, entrance cleanup at t0+1400ms.
 *   - Autoplay pauses on hover, keyboard focus and off-screen; the progress bar
 *     freezes on pause and restarts (full dwell) on resume. Manual selection always
 *     receives a complete dwell period.
 *   - prefers-reduced-motion (or the QA/test hook attribute motion="reduced") gives a
 *     static, non-looping version: no autoplay, no drift/tilt/sheen, cards revealed,
 *     progress bar full, counters at final values. Manual tab selection still works.
 *   - ASCII-only source (known Wix/Velo pipeline mojibake trap): all non-ASCII
 *     characters are HTML entities.
 *
 * Approved integration differences (do not revert):
 *   - Visible headline is an h2 (homepage owns the single h1); benefit-panel
 *     headings are h3.
 *   - Primary CTA "Get a free telecoms review" -> /free-bill-review#enquiry (D-07)
 *   - Secondary CTA "Book a demo" -> /contact (D-08)
 *   - 44px minimum mobile controls; full-width mobile CTAs (D-09)
 *
 * Claims gate: every dashboard name, place and figure in this section is
 * ILLUSTRATIVE. "Rated excellent by UK businesses", tracking-capability copy,
 * third-party app marks and the my.plan name are staging-only pending the
 * rights/claims gate (D-12). Never represent the data as live customer data.
 *
 * Rollback: remove the single <cani-myplan-section> element / its Wix section.
 * Nothing else on the page is touched by this file.
 */
(function () {
  'use strict';

  var TAG = 'cani-myplan-section';
  if (window.customElements && customElements.get(TAG)) return;

  var FONT_LINK_ID = 'cani-myplan-fonts';
  var FONT_HREF =
    'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap';

  function ensureFonts() {
    if (document.getElementById(FONT_LINK_ID)) return;
    var pre1 = document.createElement('link');
    pre1.rel = 'preconnect';
    pre1.href = 'https://fonts.googleapis.com';
    var pre2 = document.createElement('link');
    pre2.rel = 'preconnect';
    pre2.href = 'https://fonts.gstatic.com';
    pre2.crossOrigin = 'anonymous';
    var css = document.createElement('link');
    css.id = FONT_LINK_ID;
    css.rel = 'stylesheet';
    css.href = FONT_HREF;
    document.head.appendChild(pre1);
    document.head.appendChild(pre2);
    document.head.appendChild(css);
  }

  /* ------------------------------------------------------------------ */
  /* Shadow stylesheet: handover global styles scoped to the section,    */
  /* minus excluded-region rules, plus the approved mobile/accessibility */
  /* safeguards. Values are verbatim from the handover.                  */
  /* ------------------------------------------------------------------ */
  var CSS = '' +
    ':host{display:block;}' +
    /* Inheritable-property neutralisation lives on [data-root], NOT :host.
       Document stylesheets can style the host element itself (and document
       rules beat :host rules), so inherited values would pass straight
       through the shadow boundary. [data-root] is shadow-internal - no
       document selector can ever reach it - so re-setting every inheritable
       property here stops all inheritance leakage dead. Verified by the
       harness hostile-CSS test. */
    '[data-root]{' +
      "font-family:'Instrument Sans',-apple-system,system-ui,sans-serif;" +
      'font-size:16px;font-weight:400;font-style:normal;font-variant:normal;' +
      'line-height:normal;letter-spacing:normal;word-spacing:normal;' +
      'text-transform:none;text-align:left;text-indent:0;text-shadow:none;' +
      'white-space:normal;word-break:normal;overflow-wrap:normal;' +
      'direction:ltr;visibility:visible;cursor:auto;' +
      'color:#0A0A0B;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;}' +
    '*,*::before,*::after{box-sizing:border-box;}' +
    'h2,h3,p{margin:0;padding:0;}' +
    'button{font:inherit;}' +
    '::selection{background:#FF1478;color:#fff;}' +
    'a{color:#FF1478;text-decoration:none;}' +
    'a:hover{color:#D6005F;}' +
    '@keyframes ap-rise{0%{opacity:0;transform:translateY(26px);}100%{opacity:1;transform:translateY(0);}}' +
    '@keyframes ap-driftA{0%,100%{transform:translateY(0);}50%{transform:translateY(-11px);}}' +
    '@keyframes ap-driftB{0%,100%{transform:translateY(0);}50%{transform:translateY(9px);}}' +
    '@keyframes ap-driftC{0%,100%{transform:translate(0,0);}50%{transform:translate(6px,-9px);}}' +
    '@keyframes ap-driftD{0%,100%{transform:translate(0,0);}50%{transform:translate(-6px,8px);}}' +
    '@keyframes ap-hover{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}' +
    '@keyframes ap-bar{from{transform:scaleY(0.1);}to{transform:scaleY(1);}}' +
    '@keyframes ap-live{0%,100%{opacity:1;}50%{opacity:0.35;}}' +
    '@keyframes ap-accuracy{0%{transform:scale(0.82);opacity:0.5;}70%{opacity:0;}100%{transform:scale(1.5);opacity:0;}}' +
    '@keyframes ap-sheen{0%{opacity:0.25;transform:translate3d(-12%,0,0);}50%{opacity:0.5;}100%{opacity:0.25;transform:translate3d(12%,0,0);}}' +
    '[data-cta]{transition:transform 0.4s cubic-bezier(0.32,0.72,0,1),box-shadow 0.4s ease,background 0.3s ease,color 0.3s ease;white-space:nowrap;}' +
    '[data-cta="primary"]:hover{transform:translateY(-2px);box-shadow:0 18px 44px -10px rgba(255,20,120,0.62);background:#F5006F;}' +
    '[data-cta="primary"]:active{transform:translateY(0);}' +
    '[data-cta="text"]:hover{color:#D6005F;}' +
    '[data-cta="text"]:hover span[data-chev]{transform:translateX(4px);}' +
    '[data-chev]{transition:transform 0.35s cubic-bezier(0.32,0.72,0,1);display:inline-block;}' +
    '[data-seg]{transition:color 0.35s ease;}' +
    '[data-cta]:focus-visible,[data-seg]:focus-visible{outline:2px solid #FF1478;outline-offset:4px;border-radius:6px;}' +
    '@media (max-width:1150px){' +
      '[data-float="right"]{right:12px !important;}' +
      '[data-float="left"]{left:12px !important;}' +
      '[data-card]{max-width:224px !important;}' +
      '[data-exp]{grid-template-columns:1fr !important;padding:0 40px !important;gap:8px !important;min-height:0 !important;}' +
      '[data-stage]{padding:16px 0 80px !important;}' +
      '[data-acts]{order:-1 !important;padding:64px 0 8px !important;align-items:center !important;text-align:center;}' +
      '[data-acts] h2{width:100% !important;max-width:680px !important;}' +
      '[data-acts] p{width:100% !important;max-width:600px !important;}' +
      '[data-slidewrap],[data-segwrap],[data-proof]{margin-left:auto !important;margin-right:auto !important;}' +
    '}' +
    '@media (max-width:820px){' +
      '[data-exp]{padding:0 24px !important;}' +
    '}' +
    /* Approved mobile safeguards (D-09): 44px controls, full-width CTAs. */
    '@media (max-width:767px){' +
      '[data-seg]{min-height:44px;}' +
      '[data-acts] [data-cta]{display:inline-flex !important;width:100%;min-height:48px;align-items:center;justify-content:center;gap:6px;}' +
    '}' +
    /* U-2 (approved 2026-07-27): between 1151px and ~1578px the grid container
       equals the viewport, so the supplied right-card offsets (-92/-78px)
       overhang the 88px section padding and clip at the root overflow
       boundary. Clamp ONLY the two right-hand cards in that band, preserving
       their 14px stagger relationship. >=1600px (incl. the approved 1920
       composition) keeps the supplied values untouched; <=1150px uses the
       supplied collapse rules. */
    '@media (min-width:1151px) and (max-width:1599px){' +
      '[data-float][data-pos="tr"]{right:-48px !important;}' +
      '[data-float][data-pos="br"]{right:-34px !important;}' +
    '}' +
    /* U-1 (approved 2026-07-27): mobile-only composition <=480px. All four
       cards and the phone are retained; cards scale to 0.62 via `zoom` (which
       affects layout AND composes with the drift keyframes on the wrappers
       and the JS emphasis transform on the cards - no transform conflicts)
       and move into top/bottom corner zones that overlap only the phone's
       notch/header band and bottom edge. The usage ring and all four control
       toggles stay unobscured. Browsers without `zoom` (pre-2024 Firefox)
       fall back to the supplied overlap composition. */
    '@media (max-width:480px){' +
      '[data-stage]{padding:170px 0 158px !important;}' +
      '[data-card]{max-width:none !important;zoom:0.62;}' +
      '[data-float][data-pos="tl"]{left:0 !important;top:8px !important;bottom:auto !important;}' +
      '[data-float][data-pos="tr"]{right:0 !important;top:20px !important;bottom:auto !important;}' +
      '[data-float][data-pos="bl"]{left:2px !important;bottom:8px !important;top:auto !important;}' +
      '[data-float][data-pos="br"]{right:2px !important;bottom:8px !important;top:auto !important;}' +
    '}' +
    /* Phone step-down so 320-375px viewports fit the 318px frame with margin. */
    '@media (max-width:374px){[data-phone]{zoom:0.92;}}' +
    '@media (max-width:344px){[data-phone]{zoom:0.83;}}' +
    /* Off-screen suspension: timers stop in JS; looping CSS motion pauses too. */
    ':host([data-offscreen]) *{animation-play-state:paused !important;}' +
    /* Reduced motion: media query, plus the deterministic QA hook attribute. */
    '@media (prefers-reduced-motion:reduce){*{animation:none !important;}}' +
    ':host([motion="reduced"]) *{animation:none !important;}';

  /* ------------------------------------------------------------------ */
  /* Markup: verbatim handover section content (neutral-light background */
  /* + narrative column + device stage). Excluded regions are absent.    */
  /* ------------------------------------------------------------------ */
  var HTML = '' +
  '<div data-root style="position:relative;overflow:hidden;background:#fff;">' +

    '<div aria-hidden="true" style="position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;">' +
      '<div style="position:absolute;inset:0;background:radial-gradient(120% 76% at 50% 28%,#ffffff 0%,#FBFBFC 52%,#F2F2F4 100%);"></div>' +
      '<div style="position:absolute;top:6%;right:-4%;width:680px;height:680px;border-radius:50%;background:radial-gradient(circle,rgba(255,20,120,0.035),rgba(255,20,120,0) 66%);"></div>' +
      '<div style="position:absolute;bottom:2%;left:-8%;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(10,10,11,0.035),rgba(10,10,11,0) 66%);"></div>' +
    '</div>' +

    '<section data-exp aria-label="The my.plan platform" style="position:relative;z-index:1;display:grid;grid-template-columns:1.02fr 1fr;gap:128px;max-width:1520px;margin:0 auto;padding:0 88px;align-items:center;min-height:calc(100vh - 116px);">' +

      '<div data-acts style="padding:88px 0;display:flex;flex-direction:column;align-items:flex-start;">' +

        '<div style="display:flex;align-items:center;gap:9px;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#5F5F63;">' +
          '<span style="width:5px;height:5px;border-radius:50%;background:#FF1478;display:inline-block;"></span>The my.plan platform' +
        '</div>' +

        '<h2 style="font-size:clamp(50px,6.2vw,94px);line-height:0.97;font-weight:600;letter-spacing:-0.042em;margin:22px 0 0;max-width:680px;color:#0A0A0B;">' +
          'Mobile device controls,<br><span style="color:#A1A1A6;">analytics &amp; tracking.</span>' +
        '</h2>' +

        '<p style="font-size:20px;line-height:1.52;color:#6E6E73;margin:26px 0 0;max-width:540px;font-weight:400;letter-spacing:-0.012em;text-wrap:pretty;">' +
          'Whether you manage one mobile or hundreds, my.plan brings everything together &mdash; usage, services and the detail you need, in one intuitive place.' +
        '</p>' +

        '<div data-slidewrap style="position:relative;width:100%;max-width:580px;min-height:238px;margin-top:44px;border-radius:22px;background:#fff;border:1px solid rgba(10,10,11,0.07);box-shadow:0 1px 2px rgba(10,10,11,0.04),0 26px 54px -26px rgba(10,10,11,0.28);overflow:hidden;">' +
          '<div aria-hidden="true" style="position:absolute;top:0;left:0;right:0;height:2px;background:rgba(10,10,11,0.06);z-index:3;"><div data-bar style="height:100%;width:0%;background:#FF1478;"></div></div>' +

          '<div data-slide="0" role="tabpanel" id="mp-panel-0" aria-labelledby="mp-tab-0" style="position:absolute;inset:0;padding:32px 34px;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:1;">' +
            '<div style="display:flex;align-items:center;gap:13px;">' +
              '<span style="flex:none;width:40px;height:40px;border-radius:50%;background:#F5F5F7;display:flex;align-items:center;justify-content:center;"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l2.5 7 5-14L17 12h4"></path></svg></span>' +
              '<span style="font-size:11.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#5F5F63;">Real-time insights</span>' +
            '</div>' +
            '<h3 style="font-size:27px;line-height:1.14;font-weight:600;letter-spacing:-0.03em;color:#0A0A0B;margin:20px 0 0;">Every call, text and megabyte, as it happens.</h3>' +
            '<p style="font-size:16.5px;line-height:1.5;color:#6E6E73;margin:11px 0 0;letter-spacing:-0.01em;text-wrap:pretty;">Live usage across your estate the moment it lands &mdash; no surprises at the end of the month.</p>' +
          '</div>' +

          '<div data-slide="1" role="tabpanel" id="mp-panel-1" aria-labelledby="mp-tab-1" aria-hidden="true" style="position:absolute;inset:0;padding:32px 34px;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:0;transform:translateY(14px);pointer-events:none;">' +
            '<div style="display:flex;align-items:center;gap:13px;">' +
              '<span style="flex:none;width:40px;height:40px;border-radius:50%;background:#F5F5F7;display:flex;align-items:center;justify-content:center;"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle></svg></span>' +
              '<span style="font-size:11.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#5F5F63;">Live location</span>' +
            '</div>' +
            '<h3 style="font-size:27px;line-height:1.14;font-weight:600;letter-spacing:-0.03em;color:#0A0A0B;margin:20px 0 0;">Know where every device is, right now.</h3>' +
            '<p style="font-size:16.5px;line-height:1.5;color:#6E6E73;margin:11px 0 0;letter-spacing:-0.01em;text-wrap:pretty;">Connected devices on a live map alongside their data use &mdash; and lost handsets recovered in moments.</p>' +
          '</div>' +

          '<div data-slide="2" role="tabpanel" id="mp-panel-2" aria-labelledby="mp-tab-2" aria-hidden="true" style="position:absolute;inset:0;padding:32px 34px;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:0;transform:translateY(14px);pointer-events:none;">' +
            '<div style="display:flex;align-items:center;gap:13px;">' +
              '<span style="flex:none;width:40px;height:40px;border-radius:50%;background:#F5F5F7;display:flex;align-items:center;justify-content:center;"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20V11"></path><path d="M12 20V4"></path><path d="M19 20v-6"></path></svg></span>' +
              '<span style="font-size:11.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#5F5F63;">Usage intelligence</span>' +
            '</div>' +
            '<h3 style="font-size:27px;line-height:1.14;font-weight:600;letter-spacing:-0.03em;color:#0A0A0B;margin:20px 0 0;">See exactly what is driving the data.</h3>' +
            '<p style="font-size:16.5px;line-height:1.5;color:#6E6E73;margin:11px 0 0;letter-spacing:-0.01em;text-wrap:pretty;">Top users and the apps eating allowances, so tariff and bolt-on decisions rest on real numbers.</p>' +
          '</div>' +

          '<div data-slide="3" role="tabpanel" id="mp-panel-3" aria-labelledby="mp-tab-3" aria-hidden="true" style="position:absolute;inset:0;padding:32px 34px;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:0;transform:translateY(14px);pointer-events:none;">' +
            '<div style="display:flex;align-items:center;gap:13px;">' +
              '<span style="flex:none;width:40px;height:40px;border-radius:50%;background:#F5F5F7;display:flex;align-items:center;justify-content:center;"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h9"></path><path d="M18.5 8H20"></path><circle cx="15.8" cy="8" r="2.2"></circle><path d="M4 16h2"></path><path d="M11 16h9"></path><circle cx="8.4" cy="16" r="2.2"></circle></svg></span>' +
              '<span style="font-size:11.5px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#5F5F63;">Total control</span>' +
            '</div>' +
            '<h3 style="font-size:27px;line-height:1.14;font-weight:600;letter-spacing:-0.03em;color:#0A0A0B;margin:20px 0 0;">From one mobile to hundreds, in your hands.</h3>' +
            '<p style="font-size:16.5px;line-height:1.5;color:#6E6E73;margin:11px 0 0;letter-spacing:-0.01em;text-wrap:pretty;">Services, bolt-ons and barring adjusted in a couple of taps, applied instantly across the estate.</p>' +
          '</div>' +
        '</div>' +

        '<div data-segwrap style="width:100%;max-width:580px;margin-top:16px;background:#F0F0F2;border-radius:12px;padding:4px;">' +
          '<div data-tablist role="tablist" aria-label="my.plan platform benefits" style="position:relative;display:flex;">' +
            '<div data-thumb aria-hidden="true" style="position:absolute;top:0;bottom:0;left:0;width:25%;background:#fff;border-radius:9px;box-shadow:0 1px 3px rgba(10,10,11,0.14),0 0 0 0.5px rgba(10,10,11,0.04);transition:transform 0.5s cubic-bezier(0.32,0.72,0,1);"></div>' +
            '<button data-seg="0" type="button" role="tab" id="mp-tab-0" aria-controls="mp-panel-0" aria-selected="true" style="position:relative;flex:1;background:none;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;letter-spacing:-0.01em;padding:9px 4px;color:#0A0A0B;">Real-time</button>' +
            '<button data-seg="1" type="button" role="tab" id="mp-tab-1" aria-controls="mp-panel-1" aria-selected="false" tabindex="-1" style="position:relative;flex:1;background:none;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;letter-spacing:-0.01em;padding:9px 4px;color:#55555A;">Location</button>' +
            '<button data-seg="2" type="button" role="tab" id="mp-tab-2" aria-controls="mp-panel-2" aria-selected="false" tabindex="-1" style="position:relative;flex:1;background:none;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;letter-spacing:-0.01em;padding:9px 4px;color:#55555A;">Insights</button>' +
            '<button data-seg="3" type="button" role="tab" id="mp-tab-3" aria-controls="mp-panel-3" aria-selected="false" tabindex="-1" style="position:relative;flex:1;background:none;border:none;cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;letter-spacing:-0.01em;padding:9px 4px;color:#55555A;">Control</button>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;align-items:center;gap:28px;margin-top:40px;flex-wrap:wrap;">' +
          '<a data-cta="primary" href="/free-bill-review#enquiry" style="display:inline-block;background:#FF1478;color:#fff;font-weight:600;font-size:16.5px;letter-spacing:-0.012em;padding:16px 30px;border-radius:12px;cursor:pointer;box-shadow:0 12px 32px -10px rgba(255,20,120,0.6);">Get a free telecoms review</a>' +
          '<a data-cta="text" href="/contact" style="display:inline-block;color:#FF1478;font-weight:600;font-size:16.5px;letter-spacing:-0.012em;padding:4px 0;cursor:pointer;">Book a demo <span data-chev>&#8250;</span></a>' +
        '</div>' +

        '<div data-proof style="display:flex;align-items:center;gap:9px;margin-top:26px;font-size:13.5px;color:#5F5F63;font-weight:400;letter-spacing:-0.01em;">' +
          '<span aria-hidden="true" style="color:#C4005A;font-size:12px;letter-spacing:1px;">&#9733;&#9733;&#9733;&#9733;&#9733;</span>Rated excellent by UK businesses' +
        '</div>' +
      '</div>' +

      '<div data-stage aria-hidden="true" style="position:relative;display:flex;align-items:center;justify-content:center;padding:56px 0 72px;overflow:visible;">' +

        '<div style="position:absolute;width:520px;height:520px;border-radius:50%;border:1px solid rgba(10,10,11,0.045);"></div>' +
        '<div style="position:absolute;width:680px;height:680px;border-radius:50%;border:1px solid rgba(10,10,11,0.03);"></div>' +
        '<div style="position:absolute;width:620px;height:620px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,0.9),rgba(255,255,255,0) 62%);animation:ap-sheen 14s ease-in-out infinite;"></div>' +

        '<div data-float="left" data-pos="tl" style="position:absolute;left:-72px;top:52px;z-index:20;animation:ap-driftA 15s ease-in-out infinite;">' +
          '<div data-card="location" style="width:284px;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(10,10,11,0.07);border-radius:22px;padding:17px;box-shadow:0 1px 2px rgba(10,10,11,0.04),0 32px 64px -30px rgba(10,10,11,0.36);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.32,0.72,0,1),filter 0.7s ease,box-shadow 0.7s ease;">' +
            '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:13px;">' +
              '<div style="min-width:0;">' +
                '<div style="font-size:14.5px;font-weight:600;letter-spacing:-0.018em;color:#0A0A0B;">Live location</div>' +
                '<div style="font-size:11.5px;font-weight:500;color:#5F5F63;margin-top:2px;">6 devices tracked</div>' +
              '</div>' +
              '<span style="flex:none;display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:600;color:#5F5F63;background:#F0F0F2;padding:4px 8px;border-radius:99px;"><span style="width:5px;height:5px;border-radius:50%;background:#30D158;animation:ap-live 2.4s ease-in-out infinite;"></span>LIVE</span>' +
            '</div>' +
            '<div style="position:relative;height:146px;border-radius:15px;overflow:hidden;background:#F0F0F2;">' +
              '<div style="position:absolute;inset:0;background:repeating-linear-gradient(58deg,rgba(10,10,11,0.045) 0 1px,transparent 1px 26px),repeating-linear-gradient(-32deg,rgba(10,10,11,0.045) 0 1px,transparent 1px 30px);"></div>' +
              '<div style="position:absolute;left:-10%;top:22px;width:130%;height:12px;background:#E7E7EA;transform:rotate(-9deg);"></div>' +
              '<div style="position:absolute;left:-10%;top:96px;width:130%;height:7px;background:#E7E7EA;transform:rotate(-9deg);"></div>' +
              '<div style="position:absolute;left:44px;top:-10%;height:130%;width:9px;background:#E7E7EA;transform:rotate(7deg);"></div>' +
              '<div style="position:absolute;right:16px;top:52px;width:74px;height:52px;border-radius:8px;background:rgba(48,209,88,0.14);border:1px solid rgba(48,209,88,0.22);"></div>' +
              '<div style="position:absolute;left:34%;top:48px;width:66px;height:66px;margin-left:-33px;border-radius:50%;background:rgba(255,20,120,0.16);animation:ap-accuracy 3.4s ease-out infinite;"></div>' +
              '<div style="position:absolute;left:34%;top:66px;width:30px;height:30px;margin-left:-15px;border-radius:50%;background:#FF1478;border:3px solid #fff;box-shadow:0 6px 16px -4px rgba(255,20,120,0.7);"></div>' +
              '<div style="position:absolute;right:10px;top:70px;background:#0A0A0B;color:#fff;font-size:10.5px;font-weight:600;padding:3px 7px;border-radius:6px;white-space:nowrap;">4 GB</div>' +
              '<div style="position:absolute;left:22%;top:112px;width:13px;height:13px;border-radius:50%;background:#48484A;border:2.5px solid #fff;"></div>' +
              '<div style="position:absolute;right:14px;top:26px;width:13px;height:13px;border-radius:50%;background:#8E8E93;border:2.5px solid #fff;"></div>' +
              '<div style="position:absolute;left:10px;top:10px;background:rgba(255,255,255,0.9);color:#0A0A0B;font-size:10px;font-weight:600;padding:3px 7px;border-radius:6px;">Central London</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;gap:10px;margin-top:13px;padding-top:13px;border-top:1px solid rgba(10,10,11,0.07);">' +
              '<span style="flex:none;width:28px;height:28px;border-radius:50%;background:#0A0A0B;color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;">J</span>' +
              '<div style="flex:1;min-width:0;">' +
                '<div style="font-size:12.5px;font-weight:600;color:#0A0A0B;letter-spacing:-0.012em;">James Whitfield</div>' +
                '<div style="font-size:11px;font-weight:500;color:#5F5F63;">London &middot; updated just now</div>' +
              '</div>' +
              '<span style="flex:none;font-size:11px;font-weight:600;color:#5F5F63;">&plusmn;8 m</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div data-float="left" data-pos="bl" style="position:absolute;left:-58px;bottom:44px;z-index:20;animation:ap-driftB 17s ease-in-out infinite;">' +
          '<div data-card="daily" style="width:256px;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(10,10,11,0.07);border-radius:22px;padding:17px;box-shadow:0 1px 2px rgba(10,10,11,0.04),0 32px 64px -30px rgba(10,10,11,0.36);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.32,0.72,0,1),filter 0.7s ease,box-shadow 0.7s ease;">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">' +
              '<span style="font-size:11.5px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#5F5F63;">Daily data usage</span>' +
              '<span style="flex:none;font-size:10.5px;font-weight:600;color:#5F5F63;background:#F0F0F2;padding:4px 8px;border-radius:99px;">7 days</span>' +
            '</div>' +
            '<div style="display:flex;align-items:baseline;gap:8px;margin-top:9px;">' +
              '<div style="display:flex;align-items:baseline;gap:4px;"><span style="font-size:36px;font-weight:600;letter-spacing:-0.045em;color:#0A0A0B;">32</span><span style="font-size:15px;font-weight:500;color:#5F5F63;">GB</span></div>' +
              '<span style="font-size:11.5px;font-weight:600;color:#C4005A;">&#9650; 12%</span>' +
            '</div>' +
            '<div style="display:flex;align-items:flex-end;gap:6px;height:64px;margin-top:16px;">' +
              '<div data-chartbar style="flex:1;height:30%;background:#DCDCE0;border-radius:4px;transform-origin:bottom;"></div>' +
              '<div data-chartbar style="flex:1;height:52%;background:#DCDCE0;border-radius:4px;transform-origin:bottom;"></div>' +
              '<div data-chartbar style="flex:1;height:40%;background:#DCDCE0;border-radius:4px;transform-origin:bottom;"></div>' +
              '<div data-chartbar style="flex:1;height:72%;background:#DCDCE0;border-radius:4px;transform-origin:bottom;"></div>' +
              '<div data-chartbar style="flex:1;height:58%;background:#DCDCE0;border-radius:4px;transform-origin:bottom;"></div>' +
              '<div data-chartbar style="flex:1;height:81%;background:#DCDCE0;border-radius:4px;transform-origin:bottom;"></div>' +
              '<div data-chartbar style="flex:1;height:100%;background:#FF1478;border-radius:4px;transform-origin:bottom;"></div>' +
            '</div>' +
            '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:10px;font-weight:500;color:#5F5F63;">' +
              '<span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span style="color:#0A0A0B;font-weight:600;">S</span>' +
            '</div>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:13px;padding-top:13px;border-top:1px solid rgba(10,10,11,0.07);font-size:11.5px;font-weight:500;color:#5F5F63;">' +
              '<span>Peak 8&ndash;9pm</span><span style="font-weight:600;color:#0A0A0B;">4.2 GB</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div data-float="right" data-pos="tr" style="position:absolute;right:-92px;top:44px;z-index:20;animation:ap-driftC 19s ease-in-out infinite;">' +
          '<div data-card="apps" style="width:288px;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(10,10,11,0.07);border-radius:22px;padding:17px;box-shadow:0 1px 2px rgba(10,10,11,0.04),0 32px 64px -30px rgba(10,10,11,0.36);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.32,0.72,0,1),filter 0.7s ease,box-shadow 0.7s ease;">' +
            '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">' +
              '<div style="min-width:0;">' +
                '<div style="font-size:14.5px;font-weight:600;letter-spacing:-0.018em;color:#0A0A0B;">Most used apps</div>' +
                '<div style="font-size:11.5px;font-weight:500;color:#5F5F63;margin-top:2px;">Across 42 devices</div>' +
              '</div>' +
              '<span style="flex:none;font-size:10.5px;font-weight:600;color:#5F5F63;background:#F0F0F2;padding:4px 8px;border-radius:99px;">30 days</span>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:14px;margin-top:16px;">' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<div style="flex:none;width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#FEDA77,#F58529 28%,#DD2A7B 58%,#8134AF 92%);display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" aria-hidden="true"><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5"></rect><circle cx="12" cy="12" r="4.1"></circle><circle cx="17.2" cy="6.8" r="1" fill="#fff" stroke="none"></circle></svg></div>' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;"><span style="font-size:13px;font-weight:500;color:#1D1D1F;letter-spacing:-0.01em;">Instagram</span><span style="flex:none;font-size:12.5px;font-weight:600;color:#0A0A0B;">1.8 GB</span></div>' +
                  '<div style="height:4px;border-radius:2px;margin-top:6px;background:#EDEDEF;overflow:hidden;"><div style="height:100%;width:100%;background:#FF1478;border-radius:2px;"></div></div>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<div style="flex:none;width:32px;height:32px;border-radius:9px;background:#010101;display:flex;align-items:center;justify-content:center;"><svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 3.5c.35 1.9 1.65 3.45 3.4 3.8v2.45c-1.25 0-2.5-.4-3.6-1.05v5.5c0 2.95-2.35 5.35-5.3 5.35s-5.3-2.4-5.3-5.35 2.35-5.35 5.3-5.35c.3 0 .6.03.85.08v2.5a2.85 2.85 0 1 0 2 2.72V3.5h2.55z" fill="#fff"></path></svg></div>' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;"><span style="font-size:13px;font-weight:500;color:#1D1D1F;letter-spacing:-0.01em;">TikTok</span><span style="flex:none;font-size:12.5px;font-weight:600;color:#0A0A0B;">1.4 GB</span></div>' +
                  '<div style="height:4px;border-radius:2px;margin-top:6px;background:#EDEDEF;overflow:hidden;"><div style="height:100%;width:78%;background:#C7C7CC;border-radius:2px;"></div></div>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<div style="flex:none;width:32px;height:32px;border-radius:50%;background:#1ED760;display:flex;align-items:center;justify-content:center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06180d" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M5.5 9c4.2-1.2 9-0.8 12.8 1.4"></path><path d="M6.6 12.6c3.4-0.95 7.2-0.6 10.2 1.1"></path><path d="M7.4 15.9c2.6-0.72 5.5-0.45 7.8 0.9"></path></svg></div>' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;"><span style="font-size:13px;font-weight:500;color:#1D1D1F;letter-spacing:-0.01em;">Spotify</span><span style="flex:none;font-size:12.5px;font-weight:600;color:#0A0A0B;">920 MB</span></div>' +
                  '<div style="height:4px;border-radius:2px;margin-top:6px;background:#EDEDEF;overflow:hidden;"><div style="height:100%;width:51%;background:#C7C7CC;border-radius:2px;"></div></div>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<div style="flex:none;width:32px;height:32px;border-radius:50%;background:#1877F2;display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M13.8 21v-7.1h2.4l.36-2.8H13.8V9.3c0-.8.22-1.36 1.4-1.36h1.5V5.46c-.26-.04-1.15-.11-2.18-.11-2.16 0-3.64 1.32-3.64 3.74v2.0H8.45v2.8h2.43V21h2.92z"></path></svg></div>' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;"><span style="font-size:13px;font-weight:500;color:#1D1D1F;letter-spacing:-0.01em;">Facebook</span><span style="flex:none;font-size:12.5px;font-weight:600;color:#0A0A0B;">540 MB</span></div>' +
                  '<div style="height:4px;border-radius:2px;margin-top:6px;background:#EDEDEF;overflow:hidden;"><div style="height:100%;width:30%;background:#C7C7CC;border-radius:2px;"></div></div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding-top:13px;border-top:1px solid rgba(10,10,11,0.07);font-size:11.5px;font-weight:500;color:#5F5F63;">' +
              '<span>Total app data</span><span style="font-weight:600;color:#0A0A0B;">4.7 GB</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div data-float="right" data-pos="br" style="position:absolute;right:-78px;bottom:38px;z-index:20;animation:ap-driftD 16s ease-in-out infinite;">' +
          '<div data-card="top" style="width:272px;background:rgba(255,255,255,0.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(10,10,11,0.07);border-radius:22px;padding:17px;box-shadow:0 1px 2px rgba(10,10,11,0.04),0 32px 64px -30px rgba(10,10,11,0.36);transition:opacity 0.7s ease,transform 0.7s cubic-bezier(0.32,0.72,0,1),filter 0.7s ease,box-shadow 0.7s ease;">' +
            '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">' +
              '<div style="min-width:0;">' +
                '<div style="font-size:14.5px;font-weight:600;letter-spacing:-0.018em;color:#0A0A0B;">Top usage</div>' +
                '<div style="font-size:11.5px;font-weight:500;color:#5F5F63;margin-top:2px;">Top 3 of 42 users</div>' +
              '</div>' +
              '<span style="flex:none;font-size:10.5px;font-weight:600;color:#5F5F63;background:#F0F0F2;padding:4px 8px;border-radius:99px;">Billing</span>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:14px;margin-top:16px;">' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<span style="flex:none;width:30px;height:30px;border-radius:50%;background:#0A0A0B;color:#fff;font-size:11.5px;font-weight:600;display:flex;align-items:center;justify-content:center;">J</span>' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;"><span style="font-size:13px;font-weight:500;color:#1D1D1F;letter-spacing:-0.01em;">John Carter</span><span style="flex:none;font-size:12.5px;font-weight:600;color:#0A0A0B;">6.2 GB</span></div>' +
                  '<div style="height:4px;border-radius:2px;margin-top:6px;background:#EDEDEF;overflow:hidden;"><div style="height:100%;width:100%;background:#FF1478;border-radius:2px;"></div></div>' +
                  '<div style="font-size:10.5px;font-weight:500;color:#5F5F63;margin-top:5px;">Field sales &middot; 62% of allowance</div>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<span style="flex:none;width:30px;height:30px;border-radius:50%;background:#48484A;color:#fff;font-size:11.5px;font-weight:600;display:flex;align-items:center;justify-content:center;">E</span>' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;"><span style="font-size:13px;font-weight:500;color:#1D1D1F;letter-spacing:-0.01em;">Emma Doyle</span><span style="flex:none;font-size:12.5px;font-weight:600;color:#0A0A0B;">4.9 GB</span></div>' +
                  '<div style="height:4px;border-radius:2px;margin-top:6px;background:#EDEDEF;overflow:hidden;"><div style="height:100%;width:79%;background:#C7C7CC;border-radius:2px;"></div></div>' +
                  '<div style="font-size:10.5px;font-weight:500;color:#5F5F63;margin-top:5px;">Operations &middot; 49% of allowance</div>' +
                '</div>' +
              '</div>' +
              '<div style="display:flex;align-items:center;gap:12px;">' +
                '<span style="flex:none;width:30px;height:30px;border-radius:50%;background:#6E6E73;color:#fff;font-size:11.5px;font-weight:600;display:flex;align-items:center;justify-content:center;">L</span>' +
                '<div style="flex:1;min-width:0;">' +
                  '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;"><span style="font-size:13px;font-weight:500;color:#1D1D1F;letter-spacing:-0.01em;">Lee Nakamura</span><span style="flex:none;font-size:12.5px;font-weight:600;color:#0A0A0B;">3.5 GB</span></div>' +
                  '<div style="height:4px;border-radius:2px;margin-top:6px;background:#EDEDEF;overflow:hidden;"><div style="height:100%;width:56%;background:#C7C7CC;border-radius:2px;"></div></div>' +
                  '<div style="font-size:10.5px;font-weight:500;color:#5F5F63;margin-top:5px;">Engineering &middot; 35% of allowance</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding-top:13px;border-top:1px solid rgba(10,10,11,0.07);font-size:11.5px;font-weight:500;color:#5F5F63;">' +
              '<span>Estate total</span><span style="font-weight:600;color:#0A0A0B;">148 GB</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div data-phone style="position:relative;z-index:15;animation:ap-hover 18s ease-in-out infinite;">' +
          '<div style="position:absolute;left:50%;bottom:-38px;transform:translateX(-50%);width:300px;height:64px;background:radial-gradient(ellipse at center,rgba(10,10,11,0.24),rgba(10,10,11,0) 70%);"></div>' +
          '<div style="position:relative;width:318px;height:648px;border-radius:52px;padding:9px;background:linear-gradient(150deg,#3A3A3C,#0A0A0B 42%,#1C1C1E 78%,#48484A);box-shadow:0 1px 0 rgba(255,255,255,0.22) inset,0 50px 90px -30px rgba(10,10,11,0.55),0 0 0 0.5px rgba(10,10,11,0.6);">' +
            '<div style="position:relative;width:100%;height:100%;border-radius:44px;overflow:hidden;background:#fff;">' +

              '<div style="position:absolute;top:14px;left:50%;transform:translateX(-50%);width:98px;height:26px;border-radius:99px;background:#0A0A0B;z-index:8;"></div>' +

              '<div data-screen="usage" style="position:absolute;inset:0;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:1;display:flex;flex-direction:column;">' +
                '<div style="padding:52px 20px 14px;text-align:center;border-bottom:1px solid rgba(10,10,11,0.07);">' +
                  '<div style="font-size:11px;font-weight:500;color:#5F5F63;letter-spacing:0.02em;">John Wiggle</div>' +
                  '<div style="font-size:15px;font-weight:600;color:#0A0A0B;letter-spacing:-0.02em;margin-top:2px;">Usage</div>' +
                '</div>' +
                '<div style="display:flex;gap:6px;padding:14px 16px 4px;">' +
                  '<span style="font-size:10.5px;font-weight:600;color:#fff;background:#0A0A0B;padding:5px 11px;border-radius:7px;">Data</span>' +
                  '<span style="font-size:10.5px;font-weight:500;color:#6E6E73;background:#F0F0F2;padding:5px 11px;border-radius:7px;">Voice</span>' +
                  '<span style="font-size:10.5px;font-weight:500;color:#6E6E73;background:#F0F0F2;padding:5px 11px;border-radius:7px;">SMS</span>' +
                  '<span style="font-size:10.5px;font-weight:500;color:#6E6E73;background:#F0F0F2;padding:5px 11px;border-radius:7px;">Charges</span>' +
                '</div>' +
                '<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;">' +
                  '<div style="position:relative;width:186px;height:186px;">' +
                    '<svg viewBox="0 0 186 186" style="width:100%;height:100%;transform:rotate(-90deg);" aria-hidden="true">' +
                      '<circle cx="93" cy="93" r="80" fill="none" stroke="#F0F0F2" stroke-width="10"></circle>' +
                      '<circle data-ring cx="93" cy="93" r="80" fill="none" stroke="#FF1478" stroke-width="10" stroke-linecap="round" stroke-dasharray="503" stroke-dashoffset="503"></circle>' +
                    '</svg>' +
                    '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">' +
                      '<div style="display:flex;align-items:baseline;gap:4px;"><span data-count="32" style="font-size:44px;font-weight:600;letter-spacing:-0.05em;color:#0A0A0B;">0</span><span style="font-size:17px;font-weight:500;color:#5F5F63;">GB</span></div>' +
                      '<div style="font-size:11px;font-weight:500;color:#5F5F63;margin-top:2px;">of 50 GB used</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div style="padding:0 16px 16px;display:flex;flex-direction:column;gap:9px;">' +
                  '<div style="display:flex;align-items:center;gap:10px;background:#F7F7F8;border-radius:14px;padding:13px 14px;">' +
                    '<span style="font-size:12.5px;font-weight:500;color:#1D1D1F;flex:1;">Additional usage</span>' +
                    '<span style="color:#5F5F63;font-size:15px;">&#8250;</span>' +
                  '</div>' +
                  '<div style="border-radius:16px;background:#0A0A0B;padding:15px;color:#fff;display:flex;align-items:center;">' +
                    '<div style="flex:1;"><div style="font-size:13.5px;font-weight:600;letter-spacing:-0.015em;">Daily Traveller Plus</div><div style="font-size:11px;color:rgba(255,255,255,0.62);margin-top:2px;">Roam in 100+ countries</div></div>' +
                    '<div style="text-align:right;"><div style="font-size:9.5px;color:rgba(255,255,255,0.62);">from</div><div style="font-size:18px;font-weight:600;letter-spacing:-0.03em;">&pound;5</div></div>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              '<div data-screen="map" style="position:absolute;inset:0;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:0;transform:translateY(10px);pointer-events:none;display:flex;flex-direction:column;">' +
                '<div style="padding:52px 20px 14px;text-align:center;border-bottom:1px solid rgba(10,10,11,0.07);">' +
                  '<div style="font-size:11px;font-weight:500;color:#5F5F63;">6 devices</div>' +
                  '<div style="font-size:15px;font-weight:600;color:#0A0A0B;letter-spacing:-0.02em;margin-top:2px;">Live locations</div>' +
                '</div>' +
                '<div style="position:relative;flex:1;background:#F0F0F2;overflow:hidden;">' +
                  '<div style="position:absolute;inset:0;background:repeating-linear-gradient(56deg,rgba(10,10,11,0.05) 0 1px,transparent 1px 34px),repeating-linear-gradient(-34deg,rgba(10,10,11,0.05) 0 1px,transparent 1px 38px);"></div>' +
                  '<div style="position:absolute;left:0;top:150px;width:100%;height:7px;background:#E4E4E7;transform:rotate(-8deg);"></div>' +
                  '<div style="position:absolute;left:44px;top:0;width:7px;height:100%;background:#E4E4E7;transform:rotate(6deg);"></div>' +
                  '<div style="position:absolute;left:120px;top:120px;width:36px;height:36px;border-radius:50%;background:#FF1478;border:4px solid #fff;box-shadow:0 8px 20px -6px rgba(255,20,120,0.75);"></div>' +
                  '<div style="position:absolute;left:164px;top:128px;background:#0A0A0B;color:#fff;font-size:11px;font-weight:600;padding:4px 9px;border-radius:7px;">4 GB</div>' +
                  '<div style="position:absolute;left:66px;top:238px;width:15px;height:15px;border-radius:50%;background:#0A0A0B;border:3px solid #fff;"></div>' +
                  '<div style="position:absolute;right:56px;top:196px;width:15px;height:15px;border-radius:50%;background:#48484A;border:3px solid #fff;"></div>' +
                  '<div style="position:absolute;right:78px;bottom:184px;width:13px;height:13px;border-radius:50%;background:#8E8E93;border:3px solid #fff;"></div>' +
                '</div>' +
                '<div style="background:#fff;border-radius:22px 22px 0 0;margin-top:-22px;position:relative;padding:16px;box-shadow:0 -8px 24px -12px rgba(10,10,11,0.2);">' +
                  '<div style="width:36px;height:4px;border-radius:9px;background:#DCDCE0;margin:0 auto 14px;"></div>' +
                  '<div style="display:flex;align-items:center;gap:11px;">' +
                    '<span style="width:32px;height:32px;border-radius:50%;background:#0A0A0B;color:#fff;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;">J</span>' +
                    '<div style="flex:1;"><div style="font-size:13px;font-weight:600;letter-spacing:-0.015em;">James</div><div style="font-size:11px;color:#5F5F63;">London &middot; updated just now</div></div>' +
                    '<span style="display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:600;color:#5F5F63;"><span style="width:5px;height:5px;border-radius:50%;background:#30D158;animation:ap-live 2.4s ease-in-out infinite;"></span>LIVE</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              '<div data-screen="top" style="position:absolute;inset:0;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:0;transform:translateY(10px);pointer-events:none;display:flex;flex-direction:column;">' +
                '<div style="padding:52px 20px 14px;text-align:center;border-bottom:1px solid rgba(10,10,11,0.07);">' +
                  '<div style="font-size:11px;font-weight:500;color:#5F5F63;">This month</div>' +
                  '<div style="font-size:15px;font-weight:600;color:#0A0A0B;letter-spacing:-0.02em;margin-top:2px;">Breakdown</div>' +
                '</div>' +
                '<div style="padding:18px 16px 6px;font-size:11.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#5F5F63;">Top users</div>' +
                '<div style="padding:0 16px;display:flex;flex-direction:column;gap:10px;">' +
                  '<div style="display:flex;align-items:center;gap:11px;background:#F7F7F8;border-radius:14px;padding:12px 13px;">' +
                    '<span style="width:28px;height:28px;border-radius:50%;background:#0A0A0B;color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;">J</span>' +
                    '<div style="flex:1;"><div style="font-size:12.5px;font-weight:500;">John</div><div style="height:3px;border-radius:2px;margin-top:5px;background:#FF1478;width:100%;"></div></div>' +
                    '<span style="font-size:12.5px;font-weight:600;">6.2 GB</span>' +
                  '</div>' +
                  '<div style="display:flex;align-items:center;gap:11px;background:#F7F7F8;border-radius:14px;padding:12px 13px;">' +
                    '<span style="width:28px;height:28px;border-radius:50%;background:#48484A;color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;">E</span>' +
                    '<div style="flex:1;"><div style="font-size:12.5px;font-weight:500;">Emma</div><div style="height:3px;border-radius:2px;margin-top:5px;background:#C7C7CC;width:79%;"></div></div>' +
                    '<span style="font-size:12.5px;font-weight:600;">4.9 GB</span>' +
                  '</div>' +
                  '<div style="display:flex;align-items:center;gap:11px;background:#F7F7F8;border-radius:14px;padding:12px 13px;">' +
                    '<span style="width:28px;height:28px;border-radius:50%;background:#6E6E73;color:#fff;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;">L</span>' +
                    '<div style="flex:1;"><div style="font-size:12.5px;font-weight:500;">Lee</div><div style="height:3px;border-radius:2px;margin-top:5px;background:#C7C7CC;width:56%;"></div></div>' +
                    '<span style="font-size:12.5px;font-weight:600;">3.5 GB</span>' +
                  '</div>' +
                '</div>' +
                '<div style="padding:20px 16px 6px;font-size:11.5px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#5F5F63;">Most used apps</div>' +
                '<div style="padding:0 16px 16px;display:flex;flex-direction:column;gap:12px;">' +
                  '<div style="display:flex;align-items:center;gap:11px;">' +
                    '<div style="flex:none;width:26px;height:26px;border-radius:8px;background:linear-gradient(135deg,#FEDA77,#F58529 28%,#DD2A7B 58%,#8134AF 92%);display:flex;align-items:center;justify-content:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" aria-hidden="true"><rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5"></rect><circle cx="12" cy="12" r="4.1"></circle></svg></div>' +
                    '<span style="flex:1;font-size:12.5px;font-weight:500;">Instagram</span><span style="font-size:12.5px;font-weight:600;">1.8 GB</span>' +
                  '</div>' +
                  '<div style="display:flex;align-items:center;gap:11px;">' +
                    '<div style="flex:none;width:26px;height:26px;border-radius:8px;background:#010101;display:flex;align-items:center;justify-content:center;"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 3.5c.35 1.9 1.65 3.45 3.4 3.8v2.45c-1.25 0-2.5-.4-3.6-1.05v5.5c0 2.95-2.35 5.35-5.3 5.35s-5.3-2.4-5.3-5.35 2.35-5.35 5.3-5.35c.3 0 .6.03.85.08v2.5a2.85 2.85 0 1 0 2 2.72V3.5h2.55z" fill="#fff"></path></svg></div>' +
                    '<span style="flex:1;font-size:12.5px;font-weight:500;">TikTok</span><span style="font-size:12.5px;font-weight:600;">1.4 GB</span>' +
                  '</div>' +
                  '<div style="display:flex;align-items:center;gap:11px;">' +
                    '<div style="flex:none;width:26px;height:26px;border-radius:50%;background:#1ED760;display:flex;align-items:center;justify-content:center;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#06180d" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><path d="M5.5 9c4.2-1.2 9-0.8 12.8 1.4"></path><path d="M6.6 12.6c3.4-0.95 7.2-0.6 10.2 1.1"></path><path d="M7.4 15.9c2.6-0.72 5.5-0.45 7.8 0.9"></path></svg></div>' +
                    '<span style="flex:1;font-size:12.5px;font-weight:500;">Spotify</span><span style="font-size:12.5px;font-weight:600;">920 MB</span>' +
                  '</div>' +
                '</div>' +
              '</div>' +

              '<div data-screen="controls" style="position:absolute;inset:0;transition:opacity 0.6s cubic-bezier(0.32,0.72,0,1),transform 0.6s cubic-bezier(0.32,0.72,0,1);opacity:0;transform:translateY(10px);pointer-events:none;display:flex;flex-direction:column;">' +
                '<div style="padding:52px 20px 14px;text-align:center;border-bottom:1px solid rgba(10,10,11,0.07);">' +
                  '<div style="font-size:11px;font-weight:500;color:#5F5F63;">John Wiggle</div>' +
                  '<div style="font-size:15px;font-weight:600;color:#0A0A0B;letter-spacing:-0.02em;margin-top:2px;">Controls</div>' +
                '</div>' +
                '<div style="padding:16px;display:flex;flex-direction:column;gap:2px;">' +
                  '<div style="display:flex;align-items:center;gap:12px;background:#F7F7F8;border-radius:14px 14px 4px 4px;padding:14px;">' +
                    '<div style="flex:1;"><div style="font-size:12.5px;font-weight:500;color:#1D1D1F;">International roaming</div><div style="font-size:10.5px;color:#5F5F63;margin-top:2px;">100+ countries</div></div>' +
                    '<span style="width:44px;height:26px;border-radius:99px;background:#30D158;position:relative;flex:none;"><span style="position:absolute;top:2px;right:2px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></span></span>' +
                  '</div>' +
                  '<div style="display:flex;align-items:center;gap:12px;background:#F7F7F8;border-radius:4px;padding:14px;">' +
                    '<div style="flex:1;"><div style="font-size:12.5px;font-weight:500;color:#1D1D1F;">Premium rate calls</div><div style="font-size:10.5px;color:#5F5F63;margin-top:2px;">Barred</div></div>' +
                    '<span style="width:44px;height:26px;border-radius:99px;background:#E4E4E7;position:relative;flex:none;"><span style="position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></span></span>' +
                  '</div>' +
                  '<div style="display:flex;align-items:center;gap:12px;background:#F7F7F8;border-radius:4px;padding:14px;">' +
                    '<div style="flex:1;"><div style="font-size:12.5px;font-weight:500;color:#1D1D1F;">Data cap</div><div style="font-size:10.5px;color:#5F5F63;margin-top:2px;">50 GB per month</div></div>' +
                    '<span style="width:44px;height:26px;border-radius:99px;background:#30D158;position:relative;flex:none;"><span style="position:absolute;top:2px;right:2px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></span></span>' +
                  '</div>' +
                  '<div style="display:flex;align-items:center;gap:12px;background:#F7F7F8;border-radius:4px 4px 14px 14px;padding:14px;">' +
                    '<div style="flex:1;"><div style="font-size:12.5px;font-weight:500;color:#1D1D1F;">Content controls</div><div style="font-size:10.5px;color:#5F5F63;margin-top:2px;">Adult content barred</div></div>' +
                    '<span style="width:44px;height:26px;border-radius:99px;background:#30D158;position:relative;flex:none;"><span style="position:absolute;top:2px;right:2px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,0.2);"></span></span>' +
                  '</div>' +
                '</div>' +
                '<div style="margin-top:auto;padding:0 16px 20px;font-size:11px;color:#5F5F63;text-align:center;">Changes apply instantly across the estate.</div>' +
              '</div>' +

              '<div style="position:absolute;inset:0;z-index:9;pointer-events:none;background:linear-gradient(128deg,rgba(255,255,255,0.42) 0%,rgba(255,255,255,0.08) 26%,rgba(255,255,255,0) 44%);"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>' +
    '</section>' +
  '</div>';

  /* ------------------------------------------------------------------ */
  /* Deterministic controller. One source of truth: activeIndex 0..3.    */
  /* ------------------------------------------------------------------ */

  var SCREENS = ['usage', 'map', 'top', 'controls'];
  var HIGHLIGHTS = [['daily', 'apps'], ['location'], ['top', 'apps'], ['daily', 'top']];
  var PERIOD = 5000;
  var REVEAL_ORDER = ['location', 'apps', 'daily', 'top'];

  function CaniMyplanSection() {
    var self = Reflect.construct(HTMLElement, [], CaniMyplanSection);
    self._idx = 0;
    self._timer = null;
    self._hover = false;
    self._focus = false;
    self._inView = false;
    self._entered = false;
    self._revealed = false;
    self._teardown = [];
    self._entranceTimers = [];
    return self;
  }
  CaniMyplanSection.prototype = Object.create(HTMLElement.prototype);
  CaniMyplanSection.prototype.constructor = CaniMyplanSection;
  Object.setPrototypeOf(CaniMyplanSection, HTMLElement);

  var proto = CaniMyplanSection.prototype;

  /* Read-only public state + a deterministic programmatic selector
     (used by the QA harness; equivalent to clicking a tab). */
  Object.defineProperty(proto, 'activeIndex', {
    get: function () { return this._idx; }
  });
  proto.select = function (i) {
    if (typeof i !== 'number' || i < 0 || i > 3) return;
    this._show(i);
    this._startDwell();
  };

  proto._reduced = function () {
    return (window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) ||
           this.getAttribute('motion') === 'reduced';
  };

  proto.connectedCallback = function () {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    ensureFonts();
    this.shadowRoot.innerHTML = '<style>' + CSS + '</style>' + HTML;

    var sr = this.shadowRoot;
    this._root = sr.querySelector('[data-root]');
    this._scene = sr.querySelector('[data-exp]');
    this._slides = [].slice.call(sr.querySelectorAll('[data-slide]'));
    this._screens = [].slice.call(sr.querySelectorAll('[data-screen]'));
    this._cards = [].slice.call(sr.querySelectorAll('[data-card]'));
    this._segs = [].slice.call(sr.querySelectorAll('[data-seg]'));
    this._thumb = sr.querySelector('[data-thumb]');
    this._bar = sr.querySelector('[data-bar]');
    this._ring = sr.querySelector('[data-ring]');
    this._count = sr.querySelector('[data-count]');
    this._chartbars = [].slice.call(sr.querySelectorAll('[data-chartbar]'));

    this._idx = 0;
    this._entered = false;
    this._revealed = false;
    this._hover = false;
    this._focus = false;
    this._inView = false;

    var reduced = this._reduced();

    if (reduced) {
      /* Static, non-looping variant: everything visible and settled. */
      this._applyStaticMotionState();
      this._show(0, { initial: true });
    } else {
      /* Pre-entrance state: scene hidden, cards hidden, until first visibility. */
      this._scene.style.opacity = '0';
      this._scene.style.transform = 'translateY(26px)';
      this._cards.forEach(function (c) {
        c.style.opacity = '0';
        c.style.transform = 'scale(0.88) translateY(18px)';
      });
      this._show(0, { initial: true });
    }

    this._wire();

    /* Clipping guard: measure now, when fonts settle, and on resize. */
    var self = this;
    this._fitPanel();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { self._fitPanel(); });
    }
    var resizeRaf = null;
    var onResize = function () {
      if (resizeRaf) return;
      resizeRaf = requestAnimationFrame(function () {
        resizeRaf = null;
        self._fitPanel();
      });
    };
    window.addEventListener('resize', onResize);
    this._teardown.push(function () {
      window.removeEventListener('resize', onResize);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
    });
  };

  /* Benefit-panel clipping guard: the handover fixes the panel at
     min-height 238px with absolutely positioned slides, which clips the body
     copy at narrow widths. Deterministic fix: min-height becomes
     max(238, tallest slide's content). Desktop keeps the supplied 238px
     because content fits inside it there. Re-measured on resize and once
     fonts are ready (metrics affect wrapping). */
  proto._fitPanel = function () {
    var wrap = this.shadowRoot && this.shadowRoot.querySelector('[data-slidewrap]');
    if (!wrap) return;
    var tallest = 0;
    this._slides.forEach(function (slide) {
      if (slide.scrollHeight > tallest) tallest = slide.scrollHeight;
    });
    wrap.style.minHeight = Math.max(238, tallest + 2) + 'px';
  };

  /* The settled, non-animated presentation used whenever reduced motion is
     active - at connect, at first visibility, or on a live media-query flip. */
  proto._applyStaticMotionState = function () {
    this._revealed = true;
    if (this._count) this._count.textContent = this._count.getAttribute('data-count') || '32';
    if (this._ring) {
      this._ring.style.transition = 'none';
      this._ring.style.strokeDashoffset = String(503 * 0.36);
    }
    this._chartbars.forEach(function (b) {
      b.style.transition = 'none';
      b.style.transform = 'scaleY(1)';
    });
    if (this._scene) {
      this._scene.style.animation = 'none';
      this._scene.style.opacity = '1';
      this._scene.style.transform = 'none';
    }
    this._cards.forEach(function (c) {
      c.style.opacity = '1';
      c.style.transform = 'scale(1)';
    });
  };

  proto.disconnectedCallback = function () {
    this._stopDwell();
    this._entranceTimers.forEach(clearTimeout);
    this._entranceTimers = [];
    this._teardown.forEach(function (fn) { fn(); });
    this._teardown = [];
  };

  proto._wire = function () {
    var self = this;
    var sr = this.shadowRoot;

    /* Tabs: click + Arrow/Home/End keyboard navigation (roving tabindex). */
    this._segs.forEach(function (button, buttonIndex) {
      var onClick = function () {
        self._show(buttonIndex);
        self._startDwell();
      };
      var onKey = function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = (self._idx + 1) % 4;
        else if (event.key === 'ArrowLeft') next = (self._idx + 3) % 4;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 3;
        if (next === null) return;
        event.preventDefault();
        self._show(next);
        self._segs[next].focus();
        self._startDwell();
      };
      button.addEventListener('click', onClick);
      button.addEventListener('keydown', onKey);
      self._teardown.push(function () {
        button.removeEventListener('click', onClick);
        button.removeEventListener('keydown', onKey);
      });
    });

    /* Pause on hover and on keyboard focus; resume restarts a full dwell. */
    var onEnter = function () { self._hover = true; self._pauseChanged(); };
    var onLeave = function () { self._hover = false; self._pauseChanged(); };
    var onFocusIn = function () { self._focus = true; self._pauseChanged(); };
    var onFocusOut = function (event) {
      if (event.relatedTarget && self.shadowRoot.contains(event.relatedTarget)) return;
      self._focus = false;
      self._pauseChanged();
    };
    this._root.addEventListener('pointerenter', onEnter);
    this._root.addEventListener('pointerleave', onLeave);
    this._root.addEventListener('focusin', onFocusIn);
    this._root.addEventListener('focusout', onFocusOut);
    this._teardown.push(function () {
      self._root.removeEventListener('pointerenter', onEnter);
      self._root.removeEventListener('pointerleave', onLeave);
      self._root.removeEventListener('focusin', onFocusIn);
      self._root.removeEventListener('focusout', onFocusOut);
    });

    /* Visibility: first intersection triggers the entrance choreography;
       leaving the viewport suspends the timer, the progress bar and (via the
       data-offscreen attribute) the looping CSS animations. */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        self._inView = visible;
        if (visible) {
          self.removeAttribute('data-offscreen');
          if (!self._entered) self._enter();
          else self._resumeFlow();
        } else {
          self.setAttribute('data-offscreen', '');
          self._stopDwell();
          self._freezeBar();
        }
      }, { threshold: 0.15 });
      io.observe(this);
      this._teardown.push(function () { io.disconnect(); });
    } else {
      this._inView = true;
      this._enter();
    }

    /* Pointer tilt: rAF-throttled, hover-capable pointers only, never under
       reduced motion. Bounded +/-3.25deg Y and +/-2.25deg X (handover values). */
    if (!this._reduced() && window.matchMedia &&
        window.matchMedia('(hover: hover)').matches) {
      var stage = sr.querySelector('[data-stage]');
      stage.style.transition = 'transform 0.6s cubic-bezier(0.32,0.72,0,1)';
      stage.style.willChange = 'transform';
      var frame = null, rotX = 0, rotY = 0;
      var apply = function () {
        frame = null;
        stage.style.transform = 'perspective(1700px) rotateY(' + rotY.toFixed(2) +
          'deg) rotateX(' + rotX.toFixed(2) + 'deg)';
      };
      var onMove = function (event) {
        if (!self._inView) return;
        var bounds = self._scene.getBoundingClientRect();
        rotY = (((event.clientX - bounds.left) / bounds.width) - 0.5) * 6.5;
        rotX = (0.5 - ((event.clientY - bounds.top) / bounds.height)) * 4.5;
        if (!frame) frame = requestAnimationFrame(apply);
      };
      var onMouseLeave = function () {
        rotX = 0;
        rotY = 0;
        if (!frame) frame = requestAnimationFrame(apply);
      };
      this._scene.addEventListener('mousemove', onMove);
      this._scene.addEventListener('mouseleave', onMouseLeave);
      this._teardown.push(function () {
        self._scene.removeEventListener('mousemove', onMove);
        self._scene.removeEventListener('mouseleave', onMouseLeave);
        if (frame) cancelAnimationFrame(frame);
      });
    }

    /* Live reduced-motion switch. */
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      var onChange = function () {
        if (mq.matches) {
          self._stopDwell();
          self._applyStaticMotionState();
          self._show(self._idx);
        } else {
          self._startDwell();
        }
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
      this._teardown.push(function () {
        if (mq.removeEventListener) mq.removeEventListener('change', onChange);
        else if (mq.removeListener) mq.removeListener(onChange);
      });
    }
  };

  /* Entrance choreography, re-anchored to first section visibility.
     Supplied rhythm preserved: rise 1.1s at t0; cards from t0+500ms staggered
     150ms; entrance cleanup at t0+1400ms; emphasis engages at t0+1900ms. */
  proto._enter = function () {
    var self = this;
    this._entered = true;

    if (this._reduced()) {
      this._applyStaticMotionState();
      this._show(this._idx);
      return;
    }

    this._scene.style.animation = 'ap-rise 1.1s cubic-bezier(0.22,1,0.36,1) both';

    REVEAL_ORDER.forEach(function (name, k) {
      var card = null;
      for (var c = 0; c < self._cards.length; c++) {
        if (self._cards[c].getAttribute('data-card') === name) { card = self._cards[c]; break; }
      }
      if (!card) return;
      self._entranceTimers.push(setTimeout(function () {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 500 + k * 150));
    });

    this._entranceTimers.push(setTimeout(function () {
      self._scene.style.animation = 'none';
      self._scene.style.opacity = '1';
      self._scene.style.transform = 'none';
    }, 1400));

    this._entranceTimers.push(setTimeout(function () {
      self._revealed = true;
      self._show(self._idx);
    }, 1900));

    /* Daily-usage mini chart: staggered grow-in, matching the supplied
       ap-bar 0.8s curve and 80ms stagger, re-anchored to visibility. */
    this._chartbars.forEach(function (b, k) {
      b.style.transform = 'scaleY(0.1)';
      self._entranceTimers.push(setTimeout(function () {
        b.style.transition = 'transform 0.8s cubic-bezier(0.32,0.72,0,1)';
        b.style.transform = 'scaleY(1)';
      }, 500 + k * 80));
    });

    this._animateCount();
    this._restartBar();
    this._startDwell();
  };

  proto._pauseChanged = function () {
    if (this._hover || this._focus) {
      this._stopDwell();
      this._freezeBar();
    } else {
      this._resumeFlow();
    }
  };

  proto._resumeFlow = function () {
    if (this._reduced() || !this._inView || this._hover || this._focus || !this._entered) return;
    this._restartBar();
    this._startDwell();
  };

  proto._stopDwell = function () {
    clearInterval(this._timer);
    this._timer = null;
  };

  proto._startDwell = function () {
    var self = this;
    this._stopDwell();
    if (this._reduced() || !this._inView || this._hover || this._focus || !this._entered) return;
    this._timer = setInterval(function () {
      self._show((self._idx + 1) % 4);
    }, PERIOD);
  };

  proto._freezeBar = function () {
    if (!this._bar || this._reduced()) return;
    var width = getComputedStyle(this._bar).width;
    this._bar.style.transition = 'none';
    this._bar.style.width = width;
  };

  proto._restartBar = function () {
    if (!this._bar) return;
    if (this._reduced()) {
      this._bar.style.transition = 'none';
      this._bar.style.width = '100%';
      return;
    }
    this._bar.style.transition = 'none';
    this._bar.style.width = '0%';
    void this._bar.getBoundingClientRect();
    this._bar.style.transition = 'width ' + (PERIOD / 1000) + 's linear';
    this._bar.style.width = '100%';
  };

  /* The single state application point. Everything reads activeIndex here. */
  proto._show = function (i, opts) {
    opts = opts || {};
    this._idx = i;
    var reduced = this._reduced();
    var paused = this._hover || this._focus || !this._inView;

    this._slides.forEach(function (slide, slideIndex) {
      var active = slideIndex === i;
      slide.style.opacity = active ? '1' : '0';
      slide.style.transform = active ? 'translateY(0)' : 'translateY(14px)';
      slide.style.pointerEvents = active ? 'auto' : 'none';
      if (active) slide.removeAttribute('aria-hidden');
      else slide.setAttribute('aria-hidden', 'true');
    });

    this._screens.forEach(function (screen) {
      var active = screen.getAttribute('data-screen') === SCREENS[i];
      screen.style.opacity = active ? '1' : '0';
      screen.style.transform = active ? 'translateY(0)' : 'translateY(10px)';
      screen.style.pointerEvents = active ? 'auto' : 'none';
    });

    if (this._revealed) {
      var highlighted = HIGHLIGHTS[i];
      this._cards.forEach(function (card) {
        var active = highlighted.indexOf(card.getAttribute('data-card')) !== -1;
        card.style.opacity = active ? '1' : '0.28';
        card.style.transform = active ? 'scale(1.03)' : 'scale(0.93)';
        card.style.filter = active ? 'none' : 'blur(2px) saturate(0.8)';
        card.style.boxShadow = active
          ? '0 1px 2px rgba(10,10,11,0.04),0 32px 64px -30px rgba(10,10,11,0.36)'
          : '0 1px 2px rgba(10,10,11,0.02),0 18px 36px -26px rgba(10,10,11,0.2)';
      });
    }

    this._segs.forEach(function (button, buttonIndex) {
      var active = buttonIndex === i;
      button.style.color = active ? '#0A0A0B' : '#55555A';
      button.setAttribute('aria-selected', active ? 'true' : 'false');
      button.tabIndex = active ? 0 : -1;
    });

    if (this._thumb) this._thumb.style.transform = 'translateX(' + (i * 100) + '%)';

    if (!opts.initial) {
      if (paused && !reduced) {
        /* Paused: hold the bar empty; resume restarts a full dwell. */
        if (this._bar) {
          this._bar.style.transition = 'none';
          this._bar.style.width = '0%';
        }
      } else {
        this._restartBar();
      }
    } else if (reduced) {
      this._restartBar();
    }

    if (SCREENS[i] === 'usage' && !opts.initial && !reduced) this._animateRing();
  };

  proto._animateRing = function () {
    var ring = this._ring;
    if (!ring) return;
    var length = 503;
    try { length = ring.getTotalLength(); } catch (_) {}
    ring.style.transition = 'none';
    ring.style.strokeDasharray = length;
    ring.style.strokeDashoffset = length;
    void ring.getBoundingClientRect();
    requestAnimationFrame(function () {
      ring.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.32,0.72,0,1)';
      ring.style.strokeDashoffset = length * 0.36;
    });
  };

  proto._animateCount = function () {
    var el = this._count;
    if (!el) return;
    var target = Number(el.getAttribute('data-count')) || 0;
    if (this._reduced()) {
      el.textContent = String(target);
      return;
    }
    var started = null;
    var step = function (time) {
      if (!started) started = time;
      var progress = Math.min((time - started) / 1500, 1);
      el.textContent = String(Math.round((1 - Math.pow(1 - progress, 3)) * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    this._animateRing();
  };

  customElements.define(TAG, CaniMyplanSection);
})();
