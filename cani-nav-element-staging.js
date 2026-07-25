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

/* ---- MEGA PANEL ---- */
.cani-mega{position:absolute;top:100%;left:0;padding-top:14px;width:760px;z-index:40;
opacity:0;visibility:hidden;transform:translateY(8px) scale(.985);pointer-events:none;
transform-origin:top left;transition:opacity .2s ease,transform .2s ease,visibility .2s;}
.cani-products:hover .cani-mega,.cani-products.open .cani-mega{
opacity:1;visibility:visible;transform:translateY(0) scale(1);pointer-events:auto;}
.cani-mega__inner{background:rgba(17,7,12,.97);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);
border:1px solid rgba(236,16,128,.22);border-radius:18px;overflow:hidden;
box-shadow:0 40px 90px -30px rgba(0,0,0,.9), inset 0 0 0 1px rgba(255,255,255,.03);}
.cani-mega__grid{display:grid;grid-template-columns:1fr 300px;}
.cani-mega__cards{padding:22px 22px 20px;}
.cani-eyebrow{font-size:10.5px;font-weight:800;letter-spacing:.14em;color:rgba(255,255,255,.38);
text-transform:uppercase;margin-bottom:14px;}
.cani-cardgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.cani-card{display:flex;gap:12px;align-items:flex-start;padding:12px;border-radius:12px;
text-decoration:none;border:1px solid transparent;background:transparent;
transition:background .2s ease,border-color .2s ease;}
.cani-card:hover{background:rgba(255,255,255,.05);border-color:rgba(236,16,128,.45);}
.cani-card__icon{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:42px;height:42px;
border-radius:11px;background:rgba(236,16,128,.13);border:1px solid rgba(236,16,128,.22);}
.cani-card__t{display:block;font-size:14.5px;font-weight:700;color:var(--txt);line-height:1.2;}
.cani-card__d{display:block;margin-top:3px;font-size:12px;font-weight:500;color:var(--txt-mute);line-height:1.4;}

/* featured */
.cani-feat{display:block;text-decoration:none;margin:14px 14px 14px 0;border-radius:14px;padding:20px;
position:relative;overflow:hidden;
background:linear-gradient(155deg, rgba(236,16,128,.92) 0%, var(--accent2) 100%);
box-shadow:0 18px 40px -18px rgba(236,16,128,.6);}
.cani-feat .deco{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,.24);}
.cani-feat .deco.a{right:-30px;top:-30px;width:130px;height:130px;}
.cani-feat .deco.b{right:-8px;top:-8px;width:86px;height:86px;}
.cani-feat__tag{position:relative;display:inline-flex;align-items:center;gap:6px;padding:4px 9px;
border-radius:999px;background:rgba(0,0,0,.22);font-size:9.5px;font-weight:800;letter-spacing:.12em;color:#fff;}
.cani-feat__h{position:relative;margin-top:46px;font-size:21px;font-weight:800;letter-spacing:-.01em;color:#fff;}
.cani-feat__p{position:relative;margin-top:7px;font-size:12.5px;font-weight:500;line-height:1.5;color:rgba(255,255,255,.86);}
.cani-feat__cta{position:relative;margin-top:16px;display:inline-flex;align-items:center;gap:7px;font-size:13px;font-weight:700;color:#fff;}

.cani-mega__foot{display:flex;align-items:center;justify-content:space-between;gap:16px;
padding:13px 22px;border-top:1px solid rgba(255,255,255,.07);background:rgba(0,0,0,.18);}
.cani-trust{display:flex;align-items:center;gap:9px;font-size:12px;font-weight:600;color:rgba(255,255,255,.5);}
.cani-trust .stars{letter-spacing:1px;color:var(--green);font-size:12px;}
.cani-viewall{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;
color:var(--accent);text-decoration:none;}

/* ---- RESOURCES DROPDOWN (added 2026-06-18; mirrors Products caret/behaviour) ---- */
.cani-resources{position:relative;}
.cani-resources:hover .cani-trigger,.cani-resources.open .cani-trigger{color:var(--txt);}
.cani-resources:hover .cani-trigger svg,.cani-resources.open .cani-trigger svg{
transform:rotate(180deg);color:var(--accent);}
.cani-ddmenu{position:absolute;top:100%;left:0;padding-top:14px;min-width:240px;z-index:40;
opacity:0;visibility:hidden;transform:translateY(8px) scale(.985);pointer-events:none;
transform-origin:top left;transition:opacity .2s ease,transform .2s ease,visibility .2s;}
.cani-resources:hover .cani-ddmenu,.cani-resources.open .cani-ddmenu{
opacity:1;visibility:visible;transform:translateY(0) scale(1);pointer-events:auto;}
.cani-ddmenu__inner{background:rgba(17,7,12,.97);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);
border:1px solid rgba(236,16,128,.22);border-radius:14px;overflow:hidden;padding:8px;
box-shadow:0 40px 90px -30px rgba(0,0,0,.9), inset 0 0 0 1px rgba(255,255,255,.03);}
.cani-ddmenu a{display:block;padding:11px 14px;border-radius:10px;font-size:14.5px;font-weight:600;
color:var(--txt-dim);text-decoration:none;transition:background .2s ease,color .2s ease;}
.cani-ddmenu a:hover{background:rgba(255,255,255,.05);color:var(--txt);}

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
.cani-cta:hover,.cani-cta:focus-visible{transform:translateY(-1px);background:#cf0072;}
.cani-cta:hover::after,.cani-cta:focus-visible::after{animation:caniSheen .45s ease forwards;}
.cani-cta:active{transform:translateY(0);box-shadow:inset 0 2px 4px rgba(31,31,31,.30),0 2px 8px rgba(31,31,31,.14);}
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
<button class="cani-trigger" id="caniTrigger" aria-expanded="false" aria-haspopup="true">
<span>Products</span>
<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>

<div class="cani-mega">
<div class="cani-mega__inner">
<div class="cani-mega__grid">
<div class="cani-mega__cards">
<div class="cani-eyebrow">Products &amp; services</div>
<div class="cani-cardgrid">

<a class="cani-card" href="#" target="_top">
<span class="cani-card__icon">
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M11 18.5h2"/><path d="M20 7.5a6 6 0 0 1 0 9" opacity=".75"/><path d="M22 5a9 9 0 0 1 0 14" opacity=".45"/></svg>
</span>
<span>
<span class="cani-card__t">Business Mobiles</span>
<span class="cani-card__d">Every UK network, SIMs &amp; devices in one place.</span>
</span>
</a>

<a class="cani-card" href="#" target="_top">
<span class="cani-card__icon">
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
</span>
<span>
<span class="cani-card__t">Business Broadband &amp; Fibre</span>
<span class="cani-card__d">Ultrafast fibre, FTTP &amp; business broadband.</span>
</span>
</a>

<a class="cani-card" href="#" target="_top">
<span class="cani-card__icon">
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M11 18.5h2"/></svg>
</span>
<span>
<span class="cani-card__t">SIM Only</span>
<span class="cani-card__d">Flexible SIM-only plans on every major network.</span>
</span>
</a>

<a class="cani-card" href="#" target="_top">
<span class="cani-card__icon">
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>
</span>
<span>
<span class="cani-card__t">Lease Lines</span>
<span class="cani-card__d">Dedicated high-capacity leased line connectivity.</span>
</span>
</a>

<a class="cani-card" href="#" target="_top">
<span class="cani-card__icon">
<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3.5a6 6 0 0 1 5 5"/><path d="M14.5 7a3 3 0 0 1 2.5 2.5"/><path d="M5 4h3.6l1.5 4-2.1 1.4a12 12 0 0 0 5.6 5.6l1.4-2.1 4 1.5V20a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4z"/></svg>
</span>
<span>
<span class="cani-card__t">Hosted Voice</span>
<span class="cani-card__d">Cloud phone systems &amp; VoIP for modern teams.</span>
</span>
</a>

</div>
</div>

<a class="cani-feat" href="#" target="_top">
<span class="deco a"></span><span class="deco b"></span>
<span class="cani-feat__tag">FEATURED</span>
<span class="cani-feat__h">SignalHub</span>
<span class="cani-feat__p">See every network, device and connection across your business in one live view.</span>
<span class="cani-feat__cta">Explore SignalHub
<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
</span>
</a>
</div>

<div class="cani-mega__foot">
<div class="cani-trust"><span class="stars">★★★★★</span> Rated excellent by UK businesses</div>
<a class="cani-viewall" href="#" target="_top">View all products
<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
</a>
</div>
</div>
</div>
</div>

<a class="cani-link" href="/about" target="_top">About</a>
<a class="cani-link" href="https://shaungordon3.wixstudio.com/my-site-4/support" target="_top">Support</a>

<div class="cani-resources" id="caniResources">
<button class="cani-trigger" id="caniResTrigger" aria-expanded="false" aria-haspopup="true">
<span>Resources</span>
<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
</button>
<div class="cani-ddmenu">
<div class="cani-ddmenu__inner">
<a href="https://shaungordon3.wixstudio.com/my-site-4/help" target="_top">Help &amp; FAQs</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/device-guides" target="_top">Device Guides</a>
<a href="#" target="_top">Industries</a>
<a href="#" target="_top">Telecoms Review</a>
<a href="#" target="_top">Testimonials</a>
</div>
</div>
</div>

<a class="cani-link" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Contact</a>
</div>
</div>

<div class="cani-right">
<a class="cani-phone" href="tel:+443300580389">
<span class="cani-phone__ic">
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h3.6l1.5 4-2.1 1.4a12 12 0 0 0 5.6 5.6l1.4-2.1 4 1.5V20a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4z"/></svg>
</span>
<span style="display:flex;flex-direction:column;line-height:1.1;">
<span class="cani-phone__lbl">Call our team</span>
<span class="cani-phone__num">0330 058 0389</span>
</span>
</a>
<a class="cani-cta" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Get in touch</a>
</div>

<button class="cani-burger" id="caniBurger" aria-label="Menu" aria-expanded="false">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
</button>
</div>

<div class="cani-mobile">
<div class="cani-mobile__in">
<div class="eyebrow">Products</div>
<a href="#" target="_top">Business Mobiles</a>
<a href="#" target="_top">Business Broadband &amp; Fibre</a>
<a href="#" target="_top">SIM Only</a>
<a href="#" target="_top">Lease Lines</a>
<a href="#" target="_top">Hosted Voice</a>
<div class="hr"></div>
<a class="strong" href="/about" target="_top">About</a>
<a class="strong" href="https://shaungordon3.wixstudio.com/my-site-4/support" target="_top">Support</a>
<div class="eyebrow">Resources</div>
<a href="https://shaungordon3.wixstudio.com/my-site-4/help" target="_top">Help &amp; FAQs</a>
<a href="https://shaungordon3.wixstudio.com/my-site-4/device-guides" target="_top">Device Guides</a>
<a href="#" target="_top">Industries</a>
<a href="#" target="_top">Telecoms Review</a>
<a href="#" target="_top">Testimonials</a>
<a class="strong" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Contact</a>
<a class="callbtn" href="tel:+443300580389">Call 0330 058 0389</a>
<a class="ctabtn" href="https://shaungordon3.wixstudio.com/my-site-4/contact" target="_top">Get in touch</a>
</div>
</div>
</nav>`;
function build(host){
if (host._init) return; host._init = true;
var root = host.attachShadow({mode:'open'});
root.innerHTML = '<style>'+CSS+'/* === WHITE HEADER THEME · CANIREV:white-header-staging-20260724 · colours/bg/border/logo only === */.cani-nav{--cani-rev:"white-header-staging-20260724" !important;background:#FFFFFF !important;border-bottom:1px solid #E8E8EA !important;box-shadow:none !important;-webkit-backdrop-filter:none !important;backdrop-filter:none !important;}.cani-link{color:#1F1F1F !important;}.cani-trigger{color:#1F1F1F !important;}.cani-trigger svg{color:#1F1F1F !important;}.cani-eyebrow{color:#5B6573 !important;}.cani-phone{color:#1F1F1F !important;}.cani-phone__num{color:#1F1F1F !important;}.cani-phone__lbl{color:#5B6573 !important;}.cani-phone__ic{background:rgba(236,16,128,.10) !important;border-color:rgba(236,16,128,.30) !important;}.cani-burger{border-color:rgba(31,31,31,.22) !important;background:rgba(31,31,31,.05) !important;}.cani-cta,.cani-cta *{color:#FFFFFF !important;}</style>'+MARKUP;
var products = root.getElementById('caniProducts');
var trigger = root.getElementById('caniTrigger');
var resources = root.getElementById('caniResources');
var resTrigger = root.getElementById('caniResTrigger');
var navEl = root.getElementById('caniNav');
var burger = root.getElementById('caniBurger');
if (trigger) trigger.addEventListener('click', function(e){ e.preventDefault(); var o=products.classList.toggle('open'); trigger.setAttribute('aria-expanded', o?'true':'false'); });
if (resTrigger) resTrigger.addEventListener('click', function(e){ e.preventDefault(); var o=resources.classList.toggle('open'); resTrigger.setAttribute('aria-expanded', o?'true':'false'); });
document.addEventListener('click', function(e){ var p=e.composedPath?e.composedPath():[];
if(products&&p.indexOf(products)===-1){ products.classList.remove('open'); if(trigger) trigger.setAttribute('aria-expanded','false'); }
if(resources&&p.indexOf(resources)===-1){ resources.classList.remove('open'); if(resTrigger) resTrigger.setAttribute('aria-expanded','false'); } });
document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ if(products){ products.classList.remove('open'); if(trigger) trigger.setAttribute('aria-expanded','false'); } if(resources){ resources.classList.remove('open'); if(resTrigger) resTrigger.setAttribute('aria-expanded','false'); } } });
if (burger) burger.addEventListener('click', function(){ var o=navEl.classList.toggle('mobile-open'); burger.setAttribute('aria-expanded', o?'true':'false'); });
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
