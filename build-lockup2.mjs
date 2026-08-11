/**
 * LOCKUP2 - approved mock-up (contract 2E696C3F..., mock CAAAFF09...):
 * wordmark 176/148/136 wide; COMMUNICATIONS spans the FULL wordmark width
 * (letter spans + space-between => painted width == wordmark width exactly,
 * tracking lands ~0.515em as in the mock), 700 weight, 11/10/8.5px, #141111,
 * gap 5/4px; bar 102px desktop (96-108 target) / 78px mobile.
 * Base: cani-nav-element-staging-dg2.js - nav behaviour untouched.
 */
import fs from 'fs'; import crypto from 'crypto';
let s = fs.readFileSync('cani-nav-element-staging-dg2.js','utf8');
let fails = 0;
const rep = (from, to, label, expect = 1) => {
  const n = s.split(from).length - 1;
  if (n !== expect) { console.error(`MISSING ${label}: ${n}x`); fails++; return; }
  s = s.split(from).join(to);
};

rep('--bar-h:83.98px;', '--bar-h:102px; /* LOCKUP2 2026-08-11: 83.98 -> 102 (rendered ~102.9, contract target 96-108) */', 'bar-h');
rep('.cani-logo{display:flex;align-items:center;flex:0 0 auto;}',
    '.cani-logo{display:flex;align-items:center;flex:0 0 auto;text-decoration:none;}', 'logo anchor css');
rep('.cani-logo img{height:43.56px;width:auto;display:block;}',
    '.cani-logo img{width:176px;height:auto;display:block;}\n' +
    '/* LOCKUP2 master lock-up (2026-08-11): exact master vector + full-width COMMUNICATIONS.\n' +
    '   The subtitle is one line of letter spans distributed space-between across a container\n' +
    '   stretched to the wordmark width, so its painted width equals the wordmark width at\n' +
    '   every breakpoint (mock: 176.10px vs 176px) - no font-metric drift, tracking ~0.515em. */\n' +
    '.cani-lockup{display:inline-flex;flex-direction:column;align-items:flex-start;gap:5px;--cani-lockup-rev:"master-lockup2-20260811";}\n' +
    '.cani-lockup__sub{display:flex;justify-content:space-between;align-self:stretch;font-family:inherit;font-size:11px;font-weight:700;color:#141111;line-height:1;white-space:nowrap;}\n' +
    '.cani-lockup__sub i{font-style:normal;}\n' +
    '@media (max-width:1100px){.cani-logo img{width:148px;}.cani-nav__left{gap:24px;}.cani-lockup__sub{font-size:10px;}}\n' +
    '@media (max-width:880px){.cani-nav{--bar-h:78px;}.cani-logo img{width:136px;}.cani-lockup{gap:4px;}.cani-lockup__sub{font-size:8.5px;}}',
    'logo size + lockup css');
rep('<a class="cani-logo" href="https://shaungordon3.wixstudio.com/my-site-4/" target="_top"><img src="',
    '<a class="cani-logo" href="https://shaungordon3.wixstudio.com/my-site-4/" target="_top" aria-label="Cani Communications"><span class="cani-lockup"><img src="',
    'anchor open');
rep('" alt="Cani"></a>',
    '" alt=""><span class="cani-lockup__sub" aria-hidden="true">' +
    'COMMUNICATIONS'.split('').map(ch => '<i>' + ch + '</i>').join('') +
    '</span></span></a>',
    'anchor close + subtitle');

const must = ['--bar-h:102px', 'width:176px', 'cani-lockup__sub', '<i>C</i><i>O</i><i>M</i>', 'master-lockup2-20260811', 'justify-content:space-between'];
for (const c of must) if (!s.includes(c)) { console.error('POST MISSING ' + c.slice(0, 30)); fails++; }
if (s.split('cani-lockup__sub" aria-hidden').length - 1 !== 1) { console.error('subtitle count'); fails++; }
const na = t => [...t].filter(ch => ch.charCodeAt(0) > 126).length;
if (na(s) !== na(fs.readFileSync('cani-nav-element-staging-dg2.js','utf8'))) { console.error('ADDED NON-ASCII'); fails++; }
if (fails) process.exit(1);
fs.writeFileSync('cani-nav-element-staging-lockup2.js', s);
console.log('lockup2', Buffer.byteLength(s), 'B', crypto.createHash('sha256').update(s).digest('hex').toUpperCase());
