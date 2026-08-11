/**
 * LOCKUP1 - header master lock-up (contract A9561832...):
 * wordmark width-driven 176/156/136 (desktop/tablet/mobile), COMMUNICATIONS
 * subtitle centred beneath (700, 9.5/8.5px, ls .22/.20em, #141111), bar
 * 102px desktop (rendered ~102.9, inside the 96-108 target) / 78px mobile.
 * Nav labels, routes, dropdowns, burger, Device Guides untouched.
 */
import fs from 'fs'; import crypto from 'crypto';
let s = fs.readFileSync('cani-nav-element-staging-dg2.js','utf8');
let fails = 0;
const rep = (from, to, label, expect = 1) => {
  const n = s.split(from).length - 1;
  if (n !== expect) { console.error(`MISSING ${label}: ${n}x`); fails++; return; }
  s = s.split(from).join(to);
};

rep('--bar-h:83.98px;', '--bar-h:102px; /* LOCKUP1 2026-08-11: 83.98 -> 102 (rendered ~102.9, contract target 96-108) */', 'bar-h');
rep('.cani-logo{display:flex;align-items:center;flex:0 0 auto;}',
    '.cani-logo{display:flex;align-items:center;flex:0 0 auto;text-decoration:none;}', 'logo anchor css');
rep('.cani-logo img{height:43.56px;width:auto;display:block;}',
    '.cani-logo img{width:176px;height:auto;display:block;}\n' +
    '/* LOCKUP1 master lock-up (2026-08-11): exact master vector enlarged + COMMUNICATIONS subtitle */\n' +
    '.cani-lockup{display:flex;flex-direction:column;align-items:center;gap:5px;--cani-lockup-rev:"master-lockup-20260811";}\n' +
    '.cani-lockup__sub{font-family:inherit;font-size:9.5px;font-weight:700;letter-spacing:0.22em;margin-right:-0.22em;text-transform:uppercase;color:#141111;line-height:1;white-space:nowrap;}\n' +
    '@media (max-width:1100px){.cani-logo img{width:148px;}.cani-nav__left{gap:24px;}}\n' +
    '@media (max-width:880px){.cani-nav{--bar-h:78px;}.cani-logo img{width:136px;}.cani-lockup{gap:4px;}.cani-lockup__sub{font-size:8.5px;letter-spacing:0.20em;margin-right:-0.20em;}}',
    'logo size + lockup css');
rep('<a class="cani-logo" href="https://shaungordon3.wixstudio.com/my-site-4/" target="_top"><img src="',
    '<a class="cani-logo" href="https://shaungordon3.wixstudio.com/my-site-4/" target="_top" aria-label="Cani Communications"><span class="cani-lockup"><img src="',
    'anchor open');
rep('" alt="Cani"></a>',
    '" alt=""><span class="cani-lockup__sub" aria-hidden="true">COMMUNICATIONS</span></span></a>',
    'anchor close + subtitle');

const must = ['--bar-h:102px', 'width:176px', 'cani-lockup__sub', 'COMMUNICATIONS</span>', 'master-lockup-20260811'];
for (const c of must) if (!s.includes(c)) { console.error('POST MISSING ' + c); fails++; }
if (s.split('cani-lockup__sub" aria-hidden').length - 1 !== 1) { console.error('subtitle span must appear exactly once'); fails++; }
const na = t => [...t].filter(ch => ch.charCodeAt(0) > 126).length; if (na(s) !== na(fs.readFileSync('cani-nav-element-staging-dg2.js','utf8'))) { console.error('ADDED NON-ASCII'); fails++; }
if (fails) process.exit(1);
fs.writeFileSync('cani-nav-element-staging-lockup1.js', s);
console.log('lockup1', Buffer.byteLength(s), 'B', crypto.createHash('sha256').update(s).digest('hex').toUpperCase());
