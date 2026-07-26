/* CANI-NAV STAGING WHITE-HEADER REVISION — CANIREV:white-header-staging-20260724
   Charcoal-on-white restyle of the STAGING header: approved SVG wordmark logo + white bg / #E8E8EA border / charcoal #1F1F1F nav+phone / magenta accents retained / magenta 'Get a quote'.
   Layout, dimensions (77px), sticky behaviour, responsive rules and custom-element tag registration are UNCHANGED. Colours + logo + border only.
   Staging file only (cani-nav-element-staging.js) — does NOT touch the live cani-nav-element.js. Rollback: git revert to b23342a3, or restore cani-nav-element-staging.pre-white-20260724.backup.js */
/* Cani Navigation - Wix Studio Custom Element (Shadow DOM). Tokens on :host. */
/* MODIFIED 2026-06-18 (STAGING ONLY): "Resources" converted from a bare label into a
   dropdown (caret/behaviour mirrors Products) containing "Help & FAQs" -> /help and
   "Device Guides" -> /device-guides.
   Mobile: "Resources" shown as a section/group with both links beneath.
   All other nav items preserved. Deploy as a NEW filename (cani-nav-element-staging.js);
   do NOT overwrite the shared live cani-nav-element.js. Original kept as
   cani-nav-element.original.backup.js */
(function(){
if (!document.getElementById('cani-archivo-font')) {
var l=document.createElement('link'); l.id='cani-archivo-font'; l.rel='stylesheet';
l.href='https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap';
document.head.appendChild(l);
}
var CSS = `:host{
--accent:#EC1080; /* brand magenta */
--accent-hi:#ff1a90; /* magenta hover */
--accent2:#7A0C5A; /* deep magenta */
--accent-glow:rgba(236,16,128,.55);
--bg:#0A0307; /* page base */
--bg-tint:#2a0a18; /* radial inner */
--txt:#ffffff;
--txt-dim:rgba(255,255,255,.72);
--txt-mute:rgba(255,255,255,.46);
--green:#34D17A; /* trust stars */
--bar-h:83.98px; /* HDR110:+5% again (2026-07-25, was 79.94px). Target nav render = 80.84 x 1.05 = 84.88; calibration: rendered = bar-h + ~0.90px border => bar-h = 84.88 - 0.90 = 83.98px. SECFIT (no round) fits #comp-mqhessxi to the nav's exact rendered height. All nav items align-items:center (logo/links/phone/CTA stay vertically centred in the deeper bar). Prior HDR105 note: 79.94 + 0.9 => 80.84 (x1.0500 of 76.99). */
}
/* ---- NAV BAR ---- */
.cani-nav{position:relative;z-index:20;width:100%;
background:rgba(10,3,7,.62);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
border-bottom:1px solid rgba(255,255,255,.08);box-shadow:0 18px 50px -28px rgba(0,0,0,.9);}
.cani-nav__row{max-width:1280px;margin:0 auto;padding:0 32px;height:var(--bar-h);
display:flex;align-items:center;justify-content:space-between;gap:24px;}
.cani-nav__left{display:flex;align-items:center;gap:44px;min-width:0;}
.cani-logo{display:flex;align-items:center;flex:0 0 auto;}
.cani-logo img{height:43.56px;width:auto;display:block;} /* LOGO181:+10% (2026-07-25, was 39.6px => 39.6 x 1.10 = 43.56px; operator-confirmed base = true current 116.09x39.59 => target ~127.7x43.55). Same master vector canilogovectormaster-v2.svg (tight viewBox 119 341 1522 519, aspect 2.9326); width:auto preserves aspect. Vertically centred + left-anchored in the 84.88px bar. Prior LOGO165 note: 31.68 x 1.25 = 39.6 (master-vector swap). */

.cani-links{display:flex;align-items:center;gap:4px;}
.cani-link{font-size:14px;font-weight:600;color:var(--txt-dim);text-decoration:none; /* NAV-1PX 2026-07-25: 15px -> 14px (desktop labels only) */
padding:6px 10px 5px;border-bottom:2px solid transparent;letter-spacing:.005em;
transition:color .2s ease,border-color .2s ease;cursor:pointer;}
.cani-link:hover{color:var(--txt);border-bottom-color:var(--accent);}

/* products trigger */
.cani-products{position:relative;}
.cani-trigger{display:inline-flex;align-items:center;gap:6px;font-family:inherit;font-size:14px; /* NAV-1PX 2026-07-25: 15px -> 14px */
font-weight:600;color:var(--txt-dim);cursor:pointer;background:transparent;border:0;
padding:6px 10px;border-radius:9px;transition:color .2s ease;}
.cani-trigger svg{transition:transform .25s ease;color:rgba(255,255,255,.55);}
.cani-products:hover .cani-trigger,.cani-products.open .cani-trigger{color:var(--txt);}
.cani-products:hover .cani-trigger svg,.cani-products.open .cani-trigger svg{
transform:rotate(180deg);color:var(--accent);}

/* ---- MEGA PANEL · MEGA-LIGHT 2026-07-26 ----
   Full-width luminous panel directly beneath the white bar. Content constrained
   to the header's 1280px grid. No floating rounded box, no saturated magenta
   surface. JS-driven .open only (hover-intent lives in JS); premium ease;
   reduced-motion collapses to a short fade. Rollback = commit 24cb56e. */
.cani-products{position:static;}
.cani-mega{position:absolute;top:100%;left:0;width:100%;z-index:40;
opacity:0;visibility:hidden;transform:translateY(-7px);pointer-events:none;
transition:opacity .22s cubic-bezier(.22,1,.36,1),transform .22s cubic-bezier(.22,1,.36,1),visibility .22s;}
.cani-products.open .cani-mega,.cani-resources.open .cani-mega{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto;transition-duration:.22s;}
.cani-products:not(.open) .cani-mega,.cani-resources:not(.open) .cani-mega{transition-duration:.16s;}
.cani-mega__inner{background:#FFFEFC;border-bottom:1px solid #E8E8EA;
box-shadow:0 30px 44px -34px rgba(31,31,31,.25);}
.cani-mega__wrap{max-width:1280px;margin:0 auto;padding:32px 32px 6px;}
.cani-mega__grid{display:grid;grid-template-columns:1.35fr .85fr 1fr;gap:60px;}
.cani-eyebrow{font-size:10px;font-weight:700;letter-spacing:.14em;color:#5B6573; /* MEGA-1PX 2026-07-26: 11px -> 10px */
text-transform:uppercase;margin-bottom:10px;}
.cani-cardgrid{display:block;}
.cani-card{display:flex;gap:14px;align-items:flex-start;padding:7px 12px;margin:0 -12px;border-radius:10px;
min-height:44px;box-sizing:border-box;text-decoration:none;transition:background .18s ease;}
.cani-card:hover{background:rgba(31,31,31,.035);}
.cani-card:focus-visible{outline:2px solid #E6007E;outline-offset:2px;background:rgba(31,31,31,.035);}
.cani-card.nolink{cursor:default;}
.cani-card__icon{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:26px;height:26px;
margin-top:2px;color:#1F1F1F;transition:color .18s ease;}
.cani-card:hover .cani-card__icon{color:#E6007E;}
.cani-card__t{display:block;font-size:17px;font-weight:600;color:#1F1F1F;line-height:1.25;letter-spacing:-.01em;transition:color .18s ease;} /* MEGA-1PX: 18 -> 17 */
.cani-card:hover .cani-card__t{color:#000000;}
.cani-card__d{display:block;margin-top:3px;font-size:12px;font-weight:500;color:#5B6573;line-height:1.5;} /* MEGA-1PX: 13 -> 12 */

/* explore column */
.cani-explore a{display:flex;align-items:center;min-height:44px;box-sizing:border-box;padding:0 12px;margin:0 -12px;
border-radius:8px;font-size:16px;font-weight:600;color:#1F1F1F;text-decoration:none; /* MEGA-1PX: 17 -> 16 */
transition:background .18s ease,color .18s ease;}
.cani-explore a:hover{background:rgba(31,31,31,.035);color:#000000;}
.cani-explore a:focus-visible{outline:2px solid #E6007E;outline-offset:2px;}
.cani-explore .nolink{display:flex;align-items:center;min-height:44px;box-sizing:border-box;padding:0 12px;margin:0 -12px;
border-radius:8px;font-size:16px;font-weight:600;color:#1F1F1F;cursor:default;transition:background .18s ease;} /* MEGA-1PX: 17 -> 16 */
.cani-explore .nolink:hover{background:rgba(31,31,31,.035);}

/* featured — refined light card */
.cani-feat{display:block;text-decoration:none;border-radius:14px;padding:26px 24px;
background:linear-gradient(165deg,#FBF6F8 0%,#F7F7F7 100%);border:1px solid #F0E6EB;
transition:border-color .18s ease;}
.cani-feat:hover{border-color:rgba(230,0,126,.35);}
.cani-feat:focus-visible{outline:2px solid #E6007E;outline-offset:2px;}
.cani-feat__tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.14em;color:#E6007E;text-transform:uppercase;} /* MEGA-1PX: 11 -> 10 */
.cani-feat__h{display:block;margin-top:12px;font-size:20px;font-weight:700;letter-spacing:-.01em;color:#1F1F1F;} /* MEGA-1PX: 21 -> 20 */
.cani-feat__p{display:block;margin-top:8px;font-size:12.5px;font-weight:500;line-height:1.55;color:#5B6573;} /* MEGA-1PX: 13.5 -> 12.5 */
.cani-feat__cta{display:inline-flex;align-items:center;gap:7px;margin-top:18px;font-size:12.5px;font-weight:700;color:#E6007E;} /* MEGA-1PX: 13.5 -> 12.5 */
.cani-feat__cta svg{transition:transform .18s cubic-bezier(.22,1,.36,1);}
.cani-feat:hover .cani-feat__cta svg{transform:translateX(3px);}

.cani-mega__foot{display:flex;align-items:center;justify-content:space-between;gap:16px;
max-width:1280px;margin:14px auto 0;padding:11px 32px;border-top:1px solid #E8E8EA;}
.cani-trust{font-size:11.5px;font-weight:600;color:#5B6573;} /* MEGA-1PX: 12.5 -> 11.5 */
.cani-viewall{display:inline-flex;align-items:center;gap:6px;min-height:44px;font-size:12.5px;font-weight:700; /* MEGA-1PX: 13.5 -> 12.5 */
color:#E6007E;text-decoration:none;}
.cani-viewall svg{transition:transform .18s cubic-bezier(.22,1,.36,1);}
.cani-viewall:hover svg{transform:translateX(3px);}
.cani-viewall:focus-visible{outline:2px solid #E6007E;outline-offset:2px;}

/* tablet: two content columns, featured spans full width beneath */
@media (max-width:1100px){
  .cani-mega__grid{grid-template-columns:1fr 1fr;gap:36px;}
  .cani-mega__grid > div:last-child{grid-column:1 / -1;}
}
@media (prefers-reduced-motion:reduce){
  .cani-mega{transform:none;transition:opacity .08s linear,visibility .08s;}
  .cani-products.open .cani-mega,.cani-resources.open .cani-mega{transform:none;}
  .cani-feat__cta svg,.cani-viewall svg{transition:none;}
  .cani-feat:hover .cani-feat__cta svg,.cani-viewall:hover svg{transform:none;}
}

/* ---- RESOURCES DROPDOWN — MEGA-LIGHT consistency pass (2026-07-26): shares the
   Products .cani-mega shell (full-width light panel, same wrap/typography/motion);
   the legacy dark narrow .cani-ddmenu card is removed. Link-only variant: three
   equal .cani-explore columns, no featured card (no verified page/asset to feature). */
.cani-resources{position:static;}
.cani-resources:hover .cani-trigger,.cani-resources.open .cani-trigger{color:var(--txt);}
.cani-resources:hover .cani-trigger svg,.cani-resources.open .cani-trigger svg{
transform:rotate(180deg);color:var(--accent);}
.cani-mega__grid--links{grid-template-columns:1fr 1fr 1fr;}

/* ---- RIGHT SIDE ---- */
.cani-right{display:flex;align-items:center;gap:18px;flex:0 0 auto;}
.cani-phone{display:inline-flex;align-items:center;gap:9px;text-decoration:none;color:#fff;transition:opacity .2s ease;}
.cani-phone:hover{opacity:.8;}
.cani-phone__ic{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;
background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14);}
.cani-phone__lbl{font-size:10px;font-weight:600;letter-spacing:.04em;color:rgba(255,255,255,.42);}
.cani-phone__num{font-size:15px;font-weight:700;color:#fff;}
/* CTA-SQUARED (2026-07-25): squared premium "Get in touch" — 4px radius, #E6007E, 1px charcoal-alpha border, inset top highlight + controlled shadow (NO pill/glow); refined diagonal sheen on hover/focus only (clipped, ~450ms); <=1px lift; pressed active; 2px charcoal focus ring; reduced-motion disables sheen+lift; >=44px tap target. */
.cani-cta{position:relative;overflow:hidden;box-sizing:border-box;cursor:pointer;font-family:inherit;font-size:14.5px;font-weight:700;color:#fff;text-decoration:none;
display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:11px 24px;
background:#E6007E;border:1px solid rgba(31,31,31,.16);border-radius:4px;
box-shadow:inset 0 1px 0 rgba(255,255,255,.30),0 6px 16px rgba(31,31,31,.16);
transition:transform .16s ease,background .16s ease,box-shadow .16s ease;}
.cani-cta::after{content:"";position:absolute;inset:0;pointer-events:none;
background:linear-gradient(115deg,rgba(255,255,255,0) 38%,rgba(255,255,255,.45) 50%,rgba(255,255,255,0) 62%);transform:translateX(-100%);}
.cani-cta:hover,.cani-cta:focus-visible{transform:none;background:#cf0072;} /* CTA-VERIFY 2026-07-26: lift removed — hover must not move/resize/shift (colour deepen from exact #E6007E + clipped sheen only) */
.cani-cta:hover::after,.cani-cta:focus-visible::after{animation:caniSheen .45s ease forwards;}
.cani-cta:active{transform:none;box-shadow:inset 0 2px 4px rgba(31,31,31,.30),0 2px 8px rgba(31,31,31,.14);}
.cani-cta:focus-visible{outline:2px solid #1F1F1F;outline-offset:2px;}
@keyframes caniSheen{to{transform:translateX(100%);}}
@media (prefers-reduced-motion:reduce){
  .cani-cta{transition:background .01s ease,box-shadow .01s ease;}
  .cani-cta:hover,.cani-cta:focus-visible{transform:none;background:#cf0072;}
  .cani-cta::after,.cani-cta:hover::after,.cani-cta:focus-visible::after{animation:none;transform:translateX(-100%);}
}

/* ---- MOBILE ---- */
.cani-burger{display:none;align-items:center;justify-content:center;width:44px;height:44px;border-radius:11px;
border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);cursor:pointer;flex:0 0 auto;}
.cani-mobile{overflow:hidden;max-height:0;opacity:0;background:rgba(12,4,8,.97);
backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
transition:max-height .3s ease,opacity .25s ease;}
.cani-nav.mobile-open .cani-mobile{max-height:640px;opacity:1;}
.cani-mobile__in{padding:14px 22px 22px;display:flex;flex-direction:column;gap:2px;border-top:1px solid rgba(255,255,255,.08);}
.cani-mobile a{padding:11px 4px;font-size:15px;font-weight:600;color:rgba(255,255,255,.82);text-decoration:none;}
.cani-mobile a.strong{font-weight:700;color:#fff;}
.cani-mobile .hr{height:1px;background:rgba(255,255,255,.08);margin:10px 0;}
.cani-mobile .eyebrow{font-size:10.5px;font-weight:800;letter-spacing:.14em;color:rgba(255,255,255,.38);
text-transform:uppercase;padding:10px 4px 6px;}
.cani-mobile .callbtn{margin-top:12px;display:flex;align-items:center;justify-content:center;gap:9px;padding:13px;
border-radius:11px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);
font-size:15px;font-weight:700;color:#fff;}
.cani-mobile .ctabtn{margin-top:8px;box-sizing:border-box;cursor:pointer;font-family:inherit;font-size:15px;font-weight:700;
color:#fff;background:#E6007E;padding:14px;min-height:44px;border:1px solid rgba(31,31,31,.16);border-radius:4px;text-align:center;text-decoration:none;
box-shadow:inset 0 1px 0 rgba(255,255,255,.30),0 6px 16px rgba(31,31,31,.16);}

@media (max-width:880px){
.cani-links,.cani-right{display:none;}
.cani-burger{display:flex;}
}

/* mobile Products accordion (MEGA-LIGHT 2026-07-26) */
.cani-macc{width:100%;}
.cani-macc__btn{display:flex;align-items:center;justify-content:space-between;width:100%;min-height:44px;
padding:11px 4px;font-family:inherit;font-size:15px;font-weight:600;color:rgba(255,255,255,.82);
background:transparent;border:0;cursor:pointer;text-align:left;}
.cani-macc__btn svg{transition:transform .2s ease;color:rgba(255,255,255,.55);}
.cani-macc.open .cani-macc__btn svg{transform:rotate(180deg);color:#E6007E;}
.cani-macc__list{display:none;border-left:2px solid rgba(230,0,126,.55);margin:2px 0 8px 6px;padding-left:12px;}
.cani-macc.open .cani-macc__list{display:block;}
.cani-macc__list a{display:block;min-height:44px;box-sizing:border-box;padding:11px 4px;font-size:15px;font-weight:600;
color:rgba(255,255,255,.82);text-decoration:none;border-bottom:1px solid rgba(255,255,255,.08);}
.cani-macc__list a:last-child{border-bottom:0;}
.cani-macc__list .nolink{display:block;min-height:44px;box-sizing:border-box;padding:11px 4px;font-size:15px;font-weight:600;
color:rgba(255,255,255,.55);border-bottom:1px solid rgba(255,255,255,.08);}
@media (prefers-reduced-motion:reduce){ .cani-macc__btn svg{transition:none;} }

:host{display:block;font-family:'Archivo',sans-serif;-webkit-font-smoothing:antialiased;
/* Make the element report a definite bar height so the Wix container hugs the nav
(instead of falling back to its 150px default) on tablet/mobile. overflow:visible
keeps the mega-menu and mobile dropdown from being clipped. Style-neutral. */
height:var(--bar-h);min-height:var(--bar-h);box-sizing:border-box;overflow:visible;}
*{box-sizing:border-box;}
.cani-nav{position:relative;z-index:60;}
.cani-nav a, .cani-nav a:link, .cani-nav a:visited, .cani-nav a:hover, .cani-nav a:active{ text-decoration:none; -webkit-tap-highlight-color:transparent; }
.cani-nav a{ color:var(--txt-dim); }
.cani-link{ color:var(--txt-dim); }
.cani-trigger{ color:var(--txt-dim); }
.cani-card__t{ color:var(--txt); }
.cani-card__d{ color:var(--txt-mute); }
/* Wix header sits over light page chrome (not the dark hero), so make the glass
bar read as dark on its own rather than depend on what is behind it. */
.cani-nav{ background:rgba(10,3,7,.94); }
`;
var MARKUP = `<nav class="cani-nav" id="caniNav">
<div class="cani-nav__row">

<div class="cani-nav__left">
<a class="cani-logo" href="https://shaungordon3.wixstudio.com/my-site-4/" target="_top"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjExOSAzNDEgMTUyMiA1MTkiIHJvbGU9ImltZyIgYXJpYS1sYWJlbD0iQ2FuaSBDb21tdW5pY2F0aW9ucyI+CiAgPHRpdGxlPkNBTkkgd29yZG1hcmsgdmVjdG9yIG1hc3RlcjwvdGl0bGU+CiAgPHBhdGggZmlsbD0iIzE0MTExMSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNNTM0IDg2MEgyNDlRMTk1IDg2MCAxNTcuMCA4MjIuMFExMTkgNzg0IDExOSA3MzBWNjExUTExOSA1NTcgMTU3LjAgNTE5LjBRMTk1IDQ4MSAyNDkgNDgxSDUzNFE1MzQgNTIyIDQ5My41IDU1MS4wUTQ1MyA1ODAgMzk2IDU4MEwyNDkgNTgxUTIxOSA1ODEgMjE5IDYxMVY3MzBRMjE5IDc2MCAyNDkgNzYwTDM5NiA3NjFRNDUzIDc2MSA0OTMuNSA3OTAuMFE1MzQgODE5IDUzNCA4NjBaIi8+CiAgPHBhdGggZmlsbD0iIzE0MTExMSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTAwOCA4NjBROTY3IDg2MCA5MzguNSA4MTkuNVE5MTAgNzc5IDkwOSA3MjJMOTA4IDYxMVE5MDggNTgxIDg3OCA1ODFINzIzUTY5MyA1ODEgNjkzIDYxMVY3MzBRNjkzIDc2MCA3MjMgNzYwTDc5MCA3NjFRODQ3IDc2MiA4ODcuNSA3OTAuNVE5MjggODE5IDkyOCA4NjBINzIzUTY2OSA4NjAgNjMxLjAgODIyLjBRNTkzIDc4NCA1OTMgNzMwVjYxMVE1OTMgNTU3IDYzMS4wIDUxOS4wUTY2OSA0ODEgNzIzIDQ4MUg4NzhROTMyIDQ4MSA5NzAuMCA1MTkuMFExMDA4IDU1NyAxMDA4IDYxMVoiLz4KICA8cGF0aCBmaWxsPSIjMTQxMTExIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNDgyIDg2MFExNDQxIDg2MCAxNDEyLjUgODE5LjVRMTM4NCA3NzkgMTM4MyA3MjJMMTM4MiA2MTFRMTM4MiA1ODEgMTM1MiA1ODFIMTE5N1ExMTY3IDU4MSAxMTY3IDYxMUwxMTY2IDcyMlExMTY1IDc3OSAxMTM2LjUgODE5LjVRMTEwOCA4NjAgMTA2NyA4NjBWNjExUTEwNjcgNTU3IDExMDUuMCA1MTkuMFExMTQzIDQ4MSAxMTk3IDQ4MUgxMzUyUTE0MDYgNDgxIDE0NDQuMCA1MTkuMFExNDgyIDU1NyAxNDgyIDYxMVoiLz4KICA8cGF0aCBmaWxsPSIjRkYwRDdFIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0xNjQwIDM1NVExNjQwIDQxMyAxNjExLjAgNDUzLjBRMTU4MiA0OTMgMTU0MSA0OTNWNDc5UTE1NDEgNDIyIDE1NzAuMCAzODEuNVExNTk5IDM0MSAxNjQwIDM0MVpNMTY0MSA3MjJRMTY0MSA3NzkgMTYxMS41IDgxOS41UTE1ODIgODYwIDE1NDEgODYwVjYxOVExNTQxIDU2MiAxNTcwLjUgNTIxLjVRMTYwMCA0ODEgMTY0MSA0ODFaIi8+Cjwvc3ZnPg==" alt="Cani"></a>

<div class="cani-links">
<div class="cani-products" id="caniProducts">
<button class="cani-trigger" id="caniTrigger" aria-expanded="false" aria-haspopup="true" aria-controls="caniMega">
<span>Products</span>
<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>

<div class="cani-mega" id="caniMega" aria-label="Products menu">
<div class="cani-mega__inner">
<div class="cani-mega__wrap">
<div class="cani-mega__grid">

<div class="cani-mega__cards">
<div class="cani-eyebrow">Products</div>
<div class="cani-cardgrid">

<span class="cani-card nolink">
<span class="cani-card__icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 15.3l1.5-3.9A2 2 0 0 1 6.6 10h4.8a2 2 0 0 1 1.9 1.4l1.5 3.9"/><rect x="2.6" y="15.3" width="13.2" height="3.4" rx="1.1"/><path d="M5.7 18.7v1.1M12.9 18.7v1.1"/><path d="M18.6 3a2.7 2.7 0 0 0-2.7 2.7c0 1.8 2.7 4.6 2.7 4.6s2.7-2.8 2.7-4.6A2.7 2.7 0 0 0 18.6 3z"/><circle cx="18.6" cy="5.6" r=".9"/></svg>
</span>
<span>
<span class="cani-card__t">Vehicle Tracking</span>
<span class="cani-card__d">Track vehicles and assets in real time.</span>
</span>
</span>

<a class="cani-card" href="https://shaungordon3.wixstudio.com/my-site-4/hosted-telephony" target="_top">
<span class="cani-card__icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="3" width="11" height="18" rx="2.2"/><path d="M13.5 6.5h4M14 17.5h.01M17 17.5h.01M14 14.5h.01M17 14.5h.01"/><path d="M6.5 4.5c-1.4.4-2 1.6-2 3.2v8.6c0 1.6.6 2.8 2 3.2"/></svg>
</span>
<span>
<span class="cani-card__t">Hosted Telephony</span>
<span class="cani-card__d">Cloud phone systems for modern teams.</span>
</span>
</a>

<a class="cani-card" href="https://shaungordon3.wixstudio.com/my-site-4/hosted-telephony#soft-phone" target="_top">
<span class="cani-card__icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M10.2 9.2c.9 1.9 2.5 3.5 4.4 4.4l.9-1a.9.9 0 0 1 1-.2l1.7.7v2a1 1 0 0 1-1 1 9.6 9.6 0 0 1-9-9 1 1 0 0 1 1-1h2l.7 1.7a.9.9 0 0 1-.2 1z"/></svg>
</span>
<span>
<span class="cani-card__t">Soft Phone</span>
<span class="cani-card__d">Business calls on any device, anywhere.</span>
</span>
</a>

<a class="cani-card" href="https://shaungordon3.wixstudio.com/my-site-4/broadband-connectivity" target="_top">
<span class="cani-card__icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 9.5a12.5 12.5 0 0 1 17 0"/><path d="M6.5 13a8.3 8.3 0 0 1 11 0"/><path d="M9.5 16.4a4.2 4.2 0 0 1 5 0"/><circle cx="12" cy="19.4" r="1.1"/></svg>
</span>
<span>
<span class="cani-card__t">Connectivity</span>
<span class="cani-card__d">Business broadband, fibre and lines.</span>
</span>
</a>

<a class="cani-card" href="https://shaungordon3.wixstudio.com/my-site-4/free-bill-review" target="_top">
<span class="cani-card__icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M10.5 17.5h3"/><path d="M10.5 8.5v3M12.5 6.5v5M14.5 9.5v2"/></svg>
</span>
<span>
<span class="cani-card__t">Mobile</span>
<span class="cani-card__d">Business mobile on the UK's leading networks.</span>
</span>
</a>

</div>
</div>

<div class="cani-explore">
<div class="cani-eyebrow">Explore</div>
<a href="https://shaungordon3.wixstudio.com/my-site-4/free-bill-review" target="_top">Products &amp; Services</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/about" target="_top">About</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/support" target="_top">Support</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/help" target="_top">Resources</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Contact</a>
</div>

<div>
<div class="cani-eyebrow">Featured</div>
<a class="cani-feat" href="https://shaungordon3.wixstudio.com/my-site-4/" target="_top">
<span class="cani-feat__tag">Featured</span>
<span class="cani-feat__h">SignalHub</span>
<span class="cani-feat__p">See every network, device and connection across your business in one live view.</span>
<span class="cani-feat__cta">Discover SignalHub
<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
</span>
</a>
</div>

</div>
</div>

<div class="cani-mega__foot">
<div class="cani-trust">Independent UK telecoms specialists &mdash; 25+ years.</div>
<a class="cani-viewall" href="https://shaungordon3.wixstudio.com/my-site-4/free-bill-review" target="_top">View all products
<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
</a>
</div>
</div>
</div>
</div>

<a class="cani-link" href="/about" target="_top">About</a>
<a class="cani-link" href="https://shaungordon3.wixstudio.com/my-site-4/support" target="_top">Support</a>

<div class="cani-resources" id="caniResources">
<button class="cani-trigger" id="caniResTrigger" aria-expanded="false" aria-haspopup="true" aria-controls="caniResMega">
<span>Resources</span>
<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>

<div class="cani-mega" id="caniResMega" aria-label="Resources menu">
<div class="cani-mega__inner">
<div class="cani-mega__wrap">
<div class="cani-mega__grid cani-mega__grid--links">

<div class="cani-explore">
<div class="cani-eyebrow">Help &amp; Support</div>
<a href="https://shaungordon3.wixstudio.com/my-site-4/help" target="_top">Help &amp; FAQs</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/device-guides" target="_top">Device Guides</a>
</div>

<div class="cani-explore">
<div class="cani-eyebrow">Insights</div>
<span class="nolink">Telecoms Review</span>
<a href="https://shaungordon3.wixstudio.com/my-site-4/testimonials" target="_top">Testimonials</a>
</div>

<div class="cani-explore">
<div class="cani-eyebrow">Explore</div>
<span class="nolink">Industries</span>
</div>

</div>
</div>
</div>
</div>
</div>

<a class="cani-link" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Contact</a>
</div>
</div>

<div class="cani-right">
<!-- ORDER-SWAP 2026-07-25: CTA now precedes the phone block (DOM order = visual flex order
     = keyboard focus order: "Get in touch" first, "Call our team" outside/rightmost).
     No styling/dimension/spacing change; .cani-right gap:18px unchanged. -->
<a class="cani-cta" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Get in touch</a>
<a class="cani-phone" href="tel:+443300580389">
<span class="cani-phone__ic">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3.6l1.5 4-2.1 1.4a12 12 0 0 0 5.6 5.6l1.4-2.1 4 1.5V20a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4z"/></svg>
</span>
<span style="display:flex;flex-direction:column;line-height:1.1;">
<span class="cani-phone__lbl">Call our team</span>
<span class="cani-phone__num">0330 058 0389</span>
</span>
</a>
</div>

<button class="cani-burger" id="caniBurger" aria-label="Menu" aria-expanded="false">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>
</div>

<div class="cani-mobile">
<div class="cani-mobile__in">
<!-- MEGA-LIGHT 2026-07-26: Products is a clean accordion (no hover dependency,
     44px targets); services + routes mirror the service rail; Vehicle Tracking
     stays non-navigational until a real destination exists. -->
<div class="cani-macc" id="caniMacc">
<button class="cani-macc__btn" id="caniMaccBtn" aria-expanded="false" aria-controls="caniMaccList">
<span>Products</span>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>
<div class="cani-macc__list" id="caniMaccList">
<span class="nolink">Vehicle Tracking</span>
<a href="https://shaungordon3.wixstudio.com/my-site-4/hosted-telephony" target="_top">Hosted Telephony</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/hosted-telephony#soft-phone" target="_top">Soft Phone</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/broadband-connectivity" target="_top">Connectivity</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/free-bill-review" target="_top">Mobile</a>
</div>
</div>
<div class="hr"></div>
<a class="strong" href="/about" target="_top">About</a>
<a class="strong" href="https://shaungordon3.wixstudio.com/my-site-4/support" target="_top">Support</a>
<div class="cani-macc" id="caniRacc">
<button class="cani-macc__btn" id="caniRaccBtn" aria-expanded="false" aria-controls="caniRaccList">
<span>Resources</span>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>
<div class="cani-macc__list" id="caniRaccList">
<a href="https://shaungordon3.wixstudio.com/my-site-4/help" target="_top">Help &amp; FAQs</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/device-guides" target="_top">Device Guides</a>
<span class="nolink">Telecoms Review</span>
<a href="https://shaungordon3.wixstudio.com/my-site-4/testimonials" target="_top">Testimonials</a>
<span class="nolink">Industries</span>
</div>
</div>
<a class="strong" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Contact</a>
<a class="callbtn" href="tel:+443300580389">Call 0330 058 0389</a>
<a class="ctabtn" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Get in touch</a>
</div>
</div>
</nav>`;
function build(host){
if (host._init) return; host._init = true;
var root = host.attachShadow({mode:'open'});
root.innerHTML = '<style>'+CSS+'/* === WHITE HEADER THEME · CANIREV:white-header-staging-20260724 · colours/bg/border/logo only === */.cani-nav{--cani-rev:"white-header-staging-20260724" !important;background:#FFFFFF !important;border-bottom:1px solid #E8E8EA !important;box-shadow:none !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}.cani-link{color:#1F1F1F !important;}.cani-trigger{color:#1F1F1F !important;}.cani-trigger svg{color:#1F1F1F !important;}.cani-eyebrow{color:#5B6573 !important;}.cani-phone{color:#1F1F1F !important;}.cani-phone__num{color:#1F1F1F !important;}.cani-phone__lbl{color:#5B6573 !important;}.cani-phone__ic{background:rgba(236,16,128,.10) !important;border-color:rgba(236,16,128,.30) !important;}.cani-burger{border-color:rgba(31,31,31,.22) !important;background:rgba(31,31,31,.05) !important;}.cani-cta,.cani-cta *{color:#FFFFFF !important;}/* MEGA-LIGHT colour lockdown (the legacy dark-theme catch-alls come later in CSS order) */.cani-mega .cani-card__t{color:#1F1F1F !important;}.cani-mega .cani-card:hover .cani-card__t{color:#000000 !important;}.cani-mega .cani-card__d{color:#5B6573 !important;}.cani-mega .cani-card__icon{color:#1F1F1F !important;}.cani-mega .cani-card:hover .cani-card__icon{color:#E6007E !important;}.cani-mega .cani-explore a{color:#1F1F1F !important;}.cani-mega .cani-explore a:hover{color:#000000 !important;}.cani-mega .cani-explore .nolink{color:#1F1F1F !important;}.cani-mega .cani-eyebrow{color:#5B6573 !important;}.cani-mega .cani-feat__tag{color:#E6007E !important;}.cani-mega .cani-feat__h{color:#1F1F1F !important;}.cani-mega .cani-feat__p{color:#5B6573 !important;}.cani-mega .cani-feat__cta{color:#E6007E !important;}.cani-mega .cani-trust{color:#5B6573 !important;}.cani-mega .cani-viewall{color:#E6007E !important;}</style>'+MARKUP;
var products = root.getElementById('caniProducts');
var trigger = root.getElementById('caniTrigger');
var resources = root.getElementById('caniResources');
var resTrigger = root.getElementById('caniResTrigger');
var navEl = root.getElementById('caniNav');
var burger = root.getElementById('caniBurger');
/* MEGA-LIGHT behaviour, shared by Products AND Resources (consistency pass
   2026-07-26): real buttons + aria-expanded/controls, hover-intent (70ms open /
   240ms close so trigger->panel pointer travel never flickers), Escape closes
   AND returns focus to the open group's trigger, focus leaving a group closes it
   (no focus trap - it is navigation, not a modal), outside click closes, and
   opening one mega closes the other. */
var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
var megaGroups = [];
function setOpen(g, o){
  g.el.classList.toggle('open', !!o);
  g.trig.setAttribute('aria-expanded', o?'true':'false');
  if(o) megaGroups.forEach(function(x){ if(x!==g) setOpen(x, false); });
}
[[products, trigger], [resources, resTrigger]].forEach(function(pair){
  var el = pair[0], trig = pair[1];
  if(!el || !trig) return;
  var g = { el: el, trig: trig, hoverT: null, closeT: null };
  megaGroups.push(g);
  trig.addEventListener('click', function(e){ e.preventDefault(); setOpen(g, !el.classList.contains('open')); });
  if (canHover){
    el.addEventListener('pointerenter', function(){ clearTimeout(g.closeT); g.hoverT=setTimeout(function(){ setOpen(g, true); }, 70); });
    el.addEventListener('pointerleave', function(){ clearTimeout(g.hoverT); g.closeT=setTimeout(function(){ setOpen(g, false); }, 240); });
  }
  el.addEventListener('focusout', function(e){ if(!el.contains(e.relatedTarget)) setOpen(g, false); });
});
document.addEventListener('click', function(e){ var p=e.composedPath?e.composedPath():[];
megaGroups.forEach(function(g){ if(p.indexOf(g.el)===-1) setOpen(g, false); }); });
document.addEventListener('keydown', function(e){ if(e.key==='Escape'){
megaGroups.forEach(function(g){ if(g.el.classList.contains('open')){ setOpen(g, false); g.trig.focus(); } }); } });
if (burger) burger.addEventListener('click', function(){ var o=navEl.classList.toggle('mobile-open'); burger.setAttribute('aria-expanded', o?'true':'false'); });
[['caniMaccBtn','caniMacc'],['caniRaccBtn','caniRacc']].forEach(function(ids){
  var btn = root.getElementById(ids[0]), acc = root.getElementById(ids[1]);
  if (btn && acc) btn.addEventListener('click', function(){ var o=acc.classList.toggle('open'); btn.setAttribute('aria-expanded', o?'true':'false'); });
});
}
function fitHeaderSection(hostEl){
  /* SECFIT:header-section-fit-20260724 — shrink the Wix header section (#comp-mqhessxi, ~140px)
     to the nav's TRUE rendered height (~77px incl. its 1px bottom border), removing the ~63px
     transparent band beneath the white nav (the dark page root showed through it). The hero moves
     up naturally by the removed space. Layout-only: does NOT touch the PSTN strip, hero video,
     poster, service rail, Fibre icon, pause control, mobile fallback, logo or phone number. Runs
     at every breakpoint (resize). Reversible by reverting this file (rollback baseline 9f6ee43). */
  window.__caniSecFitRev = 'header-section-fit-20260724';
  function fit(){
    var sec = document.getElementById('comp-mqhessxi') || (hostEl && hostEl.closest && hostEl.closest('header'));
    var host = hostEl || document.querySelector('wix-default-custom-element') || document.querySelector('cani-nav');
    var nav = host && host.shadowRoot && host.shadowRoot.querySelector('.cani-nav');
    if(!sec || !nav) return;
    var h = nav.getBoundingClientRect().height; /* HDR105 (2026-07-25): no Math.round — set the section to the nav's EXACT rendered height so header = nav (no sub-pixel dark band) and the +5% (--bar-h) lands precisely (~80.84px, x1.05 of 76.99). */
    if(h > 0){ sec.style.setProperty('height', h+'px', 'important'); sec.style.setProperty('min-height', h+'px', 'important'); }
  }
  fit();
  var tries = 0;
  var iv = setInterval(function(){ fit(); if(++tries > 60) clearInterval(iv); }, 150);
  if(!window.__caniFitResizeBound){ window.__caniFitResizeBound = true; window.addEventListener('resize', fit); }
}
function defineTag(t){ if(customElements.get(t)) return; customElements.define(t, class extends HTMLElement { connectedCallback(){ build(this); try{ fitHeaderSection(this); }catch(e){} } }); }
defineTag('cani-nav'); defineTag('wix-default-custom-element');
})();
