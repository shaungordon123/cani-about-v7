/*
 * <cani-8x8-work-showcase>  --  VERSION V18.6 (V18.5 + premium-polish entrance family: ease 0.22,1,0.36,1, copy 700ms, stage 850ms, mobile 560/680ms, rhythm gate; scene animations untouched)
 *
 * V18.5 = V18.4 plus two additive editorial-layer changes:
 *   1. Instrument Sans editorial typography, matching my.plan (the authority).
 *      The product demonstration is pinned to its approved family so the
 *      artwork does not drift by inheritance.
 *   2. One-shot viewport-triggered scroll reveal on outer wrappers only.
 * No scene, timing, tab, pause/play or accessibility behaviour is modified.
 * Built from V18.4 155390 B / E9D9797D... by build-uc-v18-5.mjs.
 *
 * Homepage "Unified Communications Made Simple With Cani Work" section.
 * Cani Communications, authorised 8x8 white-label partner.
 * Customer-facing product name: Cani Work.
 *
 * PRODUCTION-SAFE OWNED BUILD
 *   - every scene is owned CSS/SVG authored from the supplied reference
 *     recordings; no supplier artwork is embedded or fetched
 *   - no runtime request to any external host: no GitHub Pages, no CDN, no
 *     third-party animation runtime, no iframe
 *   - no supplier product-name, supplier logo or placeholder copy at any frame
 *
 * Lineage
 *   V14    brand accent repair (--accent had been overridden to a supplier
 *          crimson, so the progress bar, tab underline, eyebrow dot and focus
 *          ring rendered red on a magenta brand)
 *   V15    verbatim 8x8 Bodymovin layer -- FROZEN as the visual reference and
 *          rollback; carries supplier wording, so not production-safe
 *   V16    D-03 interactive targets to 44px at every width
 *   V16.1  D-04 copy panels fade through rather than across
 *   V17    REJECTED at the decision gate -- no comp of 52 and no layer of 383
 *          isolates the supplier wording; see V17_DECISION_GATE.md
 *   V18    owned scenes restored, carrying D-03 and D-04 forward
 *   V18.1  Messages, Soft phone and Meetings re-authored to the measured
 *          reference geometry, choreography and loop timing; decorative
 *          stage made inert so it takes no keyboard focus
 *   V18.2  visual polish: transcript occlusion fixed, Messages thread
 *          clipped under its header, Soft phone contrast/density raised.
 *          No geometry or choreography changed.
 *   V18.3  bleed contained at the component boundary; the reference bleed
 *          past the stage is kept, but nothing paints outside :host
 *   V18.4  the mobile rule that hid the handset was unscoped and matched
 *          the Mobile App scene as well as the Soft phone; scoped to
 *          .incoming-scene so the Mobile App renders at <=767px
 *
 * Deployment: Velo custom element, Wix staging branch
 * homepage-v2-21-staging-integration, host comp-ms9ivmgi, page i38u9.
 *
 * NOT PUBLISHED. Staging only until live deployment is separately authorised.
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


  var TAG = 'cani-8x8-work-showcase';
  if (!window.customElements || customElements.get(TAG)) return;

  var PERIOD = 10000;
  var FEATURES = [
    {
      kicker: 'Your desk, in your pocket',
      title: 'Take the whole phone system with you.',
      body: 'Answer on the mobile app with the same number, the same controls and the same call quality as the desk.',
      tab: 'Mobile App',
      scene: 'mobileapp'
    },
    {
      kicker: 'Calling without the hardware',
      title: 'A full phone system, right on the desktop.',
      body: 'Dial, transfer, hold and record from one window, with your call history and contacts beside you.',
      tab: 'Soft phone',
      scene: 'softphone'
    },
    {
      kicker: 'Meet face to face',
      title: 'Run productive meetings without the overhead.',
      body: 'Share a collaborative board, run a poll and keep the chat beside the call, all in one meeting.',
      tab: 'Meetings',
      scene: 'meeting'
    },
    {
      kicker: 'Worldwide team messaging',
      title: 'Messaging that\u2019s simple, smart, and always on.',
      body: 'Chat, file sharing and team messages stay together as conversations move between people, places and devices.',
      tab: 'Messages',
      scene: 'messages'
    }
  ];

  function icon(name) {
    var paths = {
      phone: '<path d="M7.2 3.8l2.3 4-1.7 1.7c1.2 2.6 3.2 4.6 5.8 5.8l1.7-1.7 4 2.3-.7 3.1c-.2.9-1 1.5-1.9 1.5C9.4 20.5 3.5 14.6 3.5 7.3c0-.9.6-1.7 1.5-1.9l2.2-.5z"/>',
      wave: '<path d="M3 12h3l2-6 3 12 3-9 2 6h5"/>',
      message: '<path d="M4 5h16v11H9l-5 4V5z"/>',
      file: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/>',
      send: '<path d="M3 11.5L21 3l-7.5 18-2.2-7.3L3 11.5z"/><path d="M11.3 13.7L21 3"/>',
      video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
      spark: '<path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z"/><path d="M19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9L19 15z"/>',
      board: '<rect x="3" y="4" width="18" height="15" rx="2"/><path d="M8 22l4-3 4 3M7 9h4M14 9h3M8 14l3-2 3 2 3-3"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths[name] + '</svg>';
  }

  function deviceChrome(label, inner, extra) {
    return '<div class="device ' + (extra || '') + '">' +
      '<div class="device-top"><span class="dots"><i></i><i></i><i></i></span><strong>Cani Work</strong><span class="presence"></span></div>' +
      '<div class="device-body">' + inner + '</div>' +
      '<span class="device-label">' + label + '</span>' +
    '</div>';
  }

  function incomingScene() {
    /* Reference-matched: desktop window w 87.5% sliding x 7.0%->13.6%, handset
       pinned at x 0% w 25.0% h 87.1% rising y 20.8%->12.9%, 18% overlap,
       6.80s internal choreography. */
    return '<div class="scene incoming-scene" data-scene="softphone">' +
      '<div class="spx-plate" aria-hidden="true"></div>' +
      '<div class="spx-window">' +
        '<div class="spx-titlebar"><span class="spx-dots"><i></i><i></i><i></i></span><b>Cani Work</b><span class="spx-tools"><i></i><i></i><i></i></span></div>' +
        '<div class="spx-body">' +
          '<div class="spx-list">' +
            '<div class="spx-tabs"><span class="on">Calls</span><span>Missed</span><span>Voicemails</span></div>' +
            '<div class="spx-search"><span>Filter by number</span></div>' +
            '<div class="spx-sect">Active call</div>' +
            '<div class="spx-row spx-live"><span class="spx-av spx-av-on">DR</span><div class="spx-rt"><b>Daniel Reid</b><small>In progress \u00b7 0:24</small></div><em class="spx-end-mini"></em></div>' +
            '<div class="spx-sect">Recent</div>' +
            '<div class="spx-row"><span class="spx-av">IL</span><div class="spx-rt"><b>Isabella Lee</b><small>Mobile</small></div><em>Yesterday</em></div>' +
        '<div class="spx-row"><span class="spx-av">AJ</span><div class="spx-rt"><b>Alice Johnson</b><small>Cani Work</small></div><em>09:41</em></div>' +
        '<div class="spx-row"><span class="spx-av">MJ</span><div class="spx-rt"><b>Mia Jones</b><small>Missed</small></div><em>09:12</em></div>' +
        '<div class="spx-row"><span class="spx-av">LT</span><div class="spx-rt"><b>Liam Thompson</b><small>Cani Work</small></div><em>Mon</em></div>' +
        '<div class="spx-row"><span class="spx-av">OM</span><div class="spx-rt"><b>Olivia Martinez</b><small>Mobile</small></div><em>Mon</em></div>' +
        '<div class="spx-row"><span class="spx-av">HP</span><div class="spx-rt"><b>Hyun-ho Park</b><small>Cani Work</small></div><em>Sun</em></div>' +
        '<div class="spx-row"><span class="spx-av">EB</span><div class="spx-rt"><b>Emma Brown</b><small>Cani Work</small></div><em>Sun</em></div>' +
        '<div class="spx-row"><span class="spx-av">TR</span><div class="spx-rt"><b>Tom Reilly</b><small>Missed</small></div><em>Sat</em></div>' +
        '<div class="spx-row"><span class="spx-av">NA</span><div class="spx-rt"><b>Noah Adams</b><small>Cani Work</small></div><em>Sat</em></div>' +
        '<div class="spx-row"><span class="spx-av">GB</span><div class="spx-rt"><b>Grace Bennett</b><small>Mobile</small></div><em>Fri</em></div>' +
        '<div class="spx-row"><span class="spx-av">JW</span><div class="spx-rt"><b>Jack Wilson</b><small>Cani Work</small></div><em>Fri</em></div>' +
        '<div class="spx-row"><span class="spx-av">SP</span><div class="spx-rt"><b>Sofia Perez</b><small>Missed</small></div><em>Thu</em></div>' +
        '<div class="spx-row"><span class="spx-av">HC</span><div class="spx-rt"><b>Harry Clarke</b><small>Cani Work</small></div><em>Thu</em></div>' +
        '<div class="spx-row"><span class="spx-av">AR</span><div class="spx-rt"><b>Ava Roberts</b><small>Mobile</small></div><em>Wed</em></div>' +
        '<div class="spx-row"><span class="spx-av">LM</span><div class="spx-rt"><b>Leo Murray</b><small>Cani Work</small></div><em>Wed</em></div>' +
        '<div class="spx-row"><span class="spx-av">ZK</span><div class="spx-rt"><b>Zara Khan</b><small>Cani Work</small></div><em>Tue</em></div>' +
          '</div>' +
          '<div class="spx-pane">' +
            '<div class="spx-pane-h">Make a call</div>' +
            '<div class="spx-card spx-card-call">' +
              '<span class="spx-av spx-av-lg">DR</span><b>Daniel Reid</b><small class="spx-timer">00:43</small>' +
              '<div class="spx-grid">' +
                '<span><i class="ic-mute"></i>Mute</span><span><i class="ic-keypad"></i>Keypad</span><span><i class="ic-meet"></i>Meet</span>' +
                '<span><i class="ic-hold"></i>Hold</span><span><i class="ic-transfer"></i>Transfer</span><span><i class="ic-more"></i>More</span>' +
              '</div>' +
              '<button class="spx-end" aria-hidden="true" tabindex="-1">End call</button>' +
            '</div>' +
            '<div class="spx-card spx-card-dial">' +
              '<div class="spx-dial-h">Enter number</div>' +
              '<div class="spx-dial-num">0330 058 0389</div>' +
              '<div class="spx-pad"><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>*</span><span>0</span><span>#</span></div>' +
              '<button class="spx-call" aria-hidden="true" tabindex="-1">Call</button>' +
              '<div class="spx-fav">' +
                '<div class="spx-fav-h">Favourites</div>' +
                '<div class="spx-fav-r"><span class="spx-av">PK</span><div class="spx-rt"><b>Priya Kaur</b><small>Available</small></div><i class="spx-fav-d"></i></div>' +
                '<div class="spx-fav-r"><span class="spx-av">DR</span><div class="spx-rt"><b>Daniel Reid</b><small>On a call</small></div><i class="spx-fav-d spx-fav-busy"></i></div>' +
                '<div class="spx-fav-r"><span class="spx-av">SG</span><div class="spx-rt"><b>Shaun Gordon</b><small>Available</small></div><i class="spx-fav-d"></i></div>' +
                '<div class="spx-fav-r"><span class="spx-av">OM</span><div class="spx-rt"><b>Olivia Martinez</b><small>Away</small></div><i class="spx-fav-d spx-fav-away"></i></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="spx-mobile">' +
        '<div class="spx-m-screen">' +
          '<div class="spx-m-status"><span>9:41</span><i></i></div>' +
          '<div class="spx-m-head"><span>\u2039</span><b>Cani Work</b></div>' +
          '<div class="spx-m-num">0330 058 0389</div>' +
          '<div class="spx-m-sub">Connected</div>' +
          '<span class="spx-av spx-m-av">DR</span>' +
          '<div class="spx-m-timer">00:13</div>' +
          '<div class="spx-m-grid">' +
            '<span><i class="ic-mute"></i>Mute</span><span><i class="ic-keypad"></i>Keypad</span><span><i class="ic-speaker"></i>Speaker</span>' +
            '<span><i class="ic-hold"></i>Hold</span><span><i class="ic-record"></i>Record</span><span><i class="ic-more"></i>More</span>' +
          '</div>' +
          '<span class="spx-m-end"></span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* Mobile App - the phone from calls-softphone.mp4, enlarged and centred,
     playing ringing -> answered -> in call. */
  function mobileAppScene() {
    return '<div class="scene mobileapp-scene" data-scene="mobileapp">' +
      '<div class="ma-rings" aria-hidden="true"><i></i><i></i><i></i></div>' +
      '<div class="sp-mobile ma-phone">' +
        '<div class="sp-m-bar"><span>9:41</span><span class="sp-m-notch"></span><span class="sp-m-sig"><i></i><i></i><i></i></span></div>' +
        '<div class="sp-m-head"><span>\u2039</span><b>Cani Work</b><span class="sp-m-dot"></span></div>' +
        '<div class="sp-m-num">0330 058 0389<small class="ma-state">' +
          '<span class="ma-s1">Incoming call\u2026</span><span class="ma-s2">Connected</span>' +
        '</small></div>' +
        '<span class="sp-av sp-m-av">DR</span>' +
        '<div class="sp-m-timer ma-timer">00:00</div>' +
        '<div class="sp-m-grid ma-grid"><span>Mute</span><span>Keypad</span><span>Speaker</span><span>Hold</span><span>Record</span><span>More</span></div>' +
        '<div class="ma-answer"><i class="ma-decline"></i><i class="ma-accept"></i></div>' +
        '<span class="sp-m-end ma-end" aria-hidden="true"></span>' +
      '</div>' +
      '<div class="ma-note"><b>Same number, anywhere</b><small>Desk, mobile and web ring together</small></div>' +
    '</div>';
  }

  function liveCallScene() {
    var bars = '';
    for (var i = 0; i < 42; i += 1) bars += '<i style="--n:' + (i % 9) + ';--d:' + (i * 23) + 'ms"></i>';
    return '<div class="scene live-scene" data-scene="livecall">' +
      '<div class="app-window wide-window">' +
        '<div class="window-bar"><span class="dots"><i></i><i></i><i></i></span><strong>Live call</strong><span class="rec"><i></i> REC 12:36</span></div>' +
        '<div class="call-grid">' +
          '<div class="call-profile"><span class="avatar avatar-pink large">PK</span><b>Priya Kaur</b><small>Customer onboarding</small><span class="secure">Connected securely</span></div>' +
          '<div class="call-content"><div class="waveform">' + bars + '</div><div class="call-time">00:12:36</div>' +
            '<div class="transcript"><span class="live-pill">LIVE TRANSCRIPT</span>' +
              '<p><b>Priya</b> We can begin the London team rollout on Monday.</p>' +
              '<p><b>You</b> Perfect. I will confirm the final user list today.</p>' +
              '<p class="typing-line"><b>Priya</b> I will send the site contacts next...</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="mini-stat"><span>' + icon('wave') + '</span><div><b>Recording active</b><small>Transcription enabled</small></div></div>' +
    '</div>';
  }

  function messagesScene() {
    /* Reference-matched: photo-led plate, five amber arcs from the lower left,
       phone at 11.9% x / 25.9% w / 87.2% h, thread scrolling 25% of its height
       across a 7.17s internal loop. */
    return '<div class="scene messages-scene" data-scene="messages">' +
      '<div class="msg-plate" aria-hidden="true">' +
        '<div class="msg-photo"></div>' +
        '<div class="msg-photo-warm"></div>' +
        '<svg class="msg-arcs" viewBox="0 0 1625 1009" preserveAspectRatio="xMidYMid slice">' +
          '<circle class="arc a1" cx="300" cy="1180" r="470"/>' +
          '<circle class="arc a2" cx="300" cy="1180" r="612"/>' +
          '<circle class="arc a3" cx="300" cy="1180" r="754"/>' +
          '<circle class="arc a4" cx="300" cy="1180" r="896"/>' +
          '<circle class="arc a5" cx="300" cy="1180" r="1038"/>' +
        '</svg>' +
      '</div>' +
      '<div class="msg-device">' +
        '<div class="msg-screen">' +
          '<div class="msg-status"><span>9:41</span><i></i></div>' +
          '<div class="msg-head">' +
            '<span class="msg-back">\u2039</span>' +
            '<span class="msg-ava">IT</span>' +
            '<span class="msg-who"><b>Install team</b><small>4 online</small></span>' +
          '</div>' +
          '<div class="msg-thread">' +
            '<div class="msg-line ml-1"><div class="msg-quote"><b>Priya Kaur</b><span>Can we bring the Aldridge cutover forward?</span></div>' +
              '<div class="bub in">Morning \u2014 the customer has asked to move the Aldridge cutover to the 14th. Anything on our side that blocks it?<em>08:12</em></div></div>' +
            '<div class="msg-line ml-2"><div class="bub out">Ports are already confirmed for the 14th, so we are fine. I will re-book the engineer this morning.<em>08:14 \u2713\u2713</em></div></div>' +
            '<div class="msg-line ml-3"><div class="bub in">Perfect. <u>@Daniel Reid</u> can you let the site contact know the new date?<em>08:16</em></div></div>' +
            '<div class="msg-line ml-4"><div class="bub out">Done \u2014 emailed and diarised. They have asked for the handover pack too.<em>08:17 \u2713\u2713</em></div></div>' +
            '<div class="msg-line ml-5"><div class="bub in">Sending the updated pack over now.<em>08:19</em></div></div>' +
            '<div class="msg-line ml-6"><div class="bub out">Got it, thanks. All set for the 14th.<em>08:21 \u2713\u2713</em></div></div>' +
            '<div class="msg-line ml-7"><div class="bub in">I will check the pack against the site notes and come back.<em>08:23</em></div></div>' +
            '<div class="msg-line ml-8"><div class="bub out">Perfect. I will confirm the engineer slot today.<em>08:24 \u2713\u2713</em></div></div>' +
          '</div>' +
          '<div class="msg-composer"><span>Send a message\u2026</span><i></i></div>' +
        '</div>' +
      '</div>' +
      '<div class="msg-zones" aria-hidden="true"><span>LONDON 08:21</span><span>NEW YORK 03:21</span><span>SYDNEY 18:21</span></div>' +
    '</div>';
  }

  function filesScene() {
    return '<div class="scene files-scene" data-scene="files">' +
      '<div class="chat-window">' +
        '<div class="window-bar"><span class="dots"><i></i><i></i><i></i></span><strong>Project Atlas</strong><span class="members">8 members</span></div>' +
        '<div class="chat-history"><div class="bubble received">Could you send the signed deployment plan?</div><div class="bubble sent">Uploading it now.</div></div>' +
        '<div class="file-delivery"><span class="file-icon">PDF</span><div class="file-meta"><b>Deployment-plan-v4.pdf</b><small>3.8 MB</small><div class="upload-track"><i></i></div><em><span class="check">\u2713</span> Delivered to Project Atlas</em></div></div>' +
        '<div class="composer"><span>Write a message...</span><i>' + icon('send') + '</i></div>' +
      '</div>' +
      '<div class="delivery-toast"><span class="check">\u2713</span><div><b>File delivered</b><small>8 recipients can access it</small></div></div>' +
    '</div>';
  }

  function responseScene() {
    return '<div class="scene response-scene" data-scene="response">' +
      '<div class="phone-chat">' +
        '<div class="phone-chat-head"><span class="avatar avatar-pink">AM</span><div><b>Alex Morgan</b><small>Available</small></div><span>' + icon('video') + '</span></div>' +
        '<div class="phone-chat-body"><div class="bubble received">Can we move the customer review to 3pm?</div><div class="bubble received small-bubble">The London team is free.</div><div class="bubble sent sent-response">Yes \u2014 3pm works. I will update the invite.</div></div>' +
        '<div class="typing-composer"><span class="typed-copy">Yes \u2014 3pm works. I will update the invite.</span><i class="cursor"></i><button aria-hidden="true" tabindex="-1">' + icon('send') + '</button></div>' +
      '</div>' +
      '<div class="reply-status"><i class="pulse-dot"></i><span><b>Response sent</b><small>Read in London \u00B7 just now</small></span></div>' +
    '</div>';
  }

  function meetingScene() {
    /* Reference-matched cascade: rear calendar w 85.5%, foreground meeting
       w 86.8% h 87.5% travelling 9.7%->3.8% x and 20.9%->9.5% y, transcript
       panel rising 34.4%->9.8%, over a 14.96s internal loop. */
    return '<div class="scene meeting-scene" data-scene="meeting">' +
      '<div class="mtx-plate" aria-hidden="true"></div>' +
      '<div class="mtx-cal">' +
        '<div class="mtx-bar"><span class="mtx-dots"><i></i><i></i><i></i></span><b>Cani Work</b></div>' +
        '<div class="mtx-cal-b">' +
          '<div class="mtx-cal-h">Upcoming meetings</div>' +
          '<div class="mtx-cal-row is-now"><em>09:00</em><b>Daily standup</b></div>' +
            '<div class="mtx-cal-row"><em>10:30</em><b>Aldridge cutover review</b></div>' +
            '<div class="mtx-cal-row"><em>13:00</em><b>Partner sync</b></div>' +
            '<div class="mtx-cal-row"><em>15:30</em><b>Retrospective</b></div>' +
          '<div class="mtx-cal-h mtx-cal-h2">Past meetings</div>' +
          '<div class="mtx-cal-row"><em>Yesterday</em><b>Install handover</b></div>' +
        '</div>' +
      '</div>' +
      '<div class="mtx-meet">' +
        '<div class="mtx-bar mtx-bar-d"><span class="mtx-dots"><i></i><i></i><i></i></span><b>Cani Work Meeting \u00b7 Aldridge cutover</b><span class="mtx-rec">23:21</span></div>' +
        '<div class="mtx-meet-b">' +
          '<div class="mtx-chat">' +
            '<div class="mtx-chat-h">Chat</div>' +
            '<div class="mtx-file"><i></i><span><b>Cutover plan.pdf</b><em>2.1 MB</em></span></div>' +
            '<div class="mtx-file"><i></i><span><b>Site survey.png</b><em>860 KB</em></span></div>' +
            '<div class="mtx-file"><i></i><span><b>Port list.xlsx</b><em>44 KB</em></span></div>' +
            '<div class="mtx-share">Share file</div>' +
          '</div>' +
          '<div class="mtx-stage-v"><span class="mtx-speaker"><i>PK</i></span><div class="mtx-cap">Priya Kaur \u00b7 speaking</div></div>' +
          '<div class="mtx-film">' +
            '<span class="mtx-film-t f1"><i>SG</i><em>Shaun</em></span>' +
            '<span class="mtx-film-t f2"><i>PK</i><em>Priya</em></span>' +
            '<span class="mtx-film-t f3"><i>AM</i><em>Alex</em></span>' +
            '<span class="mtx-film-t f4"><i>LB</i><em>Lucy</em></span>' +
            '<span class="mtx-film-t f5"><i>DW</i><em>Dan</em></span>' +
            '<span class="mtx-film-t f6"><i>ST</i><em>Sophie</em></span>' +
            '<span class="mtx-film-t f7"><i>EB</i><em>Emma</em></span>' +
            '<span class="mtx-film-t f8"><i>TR</i><em>Tom</em></span>' +
          '</div>' +
        '</div>' +
        '<div class="mtx-ctrl"><i></i><i></i><i></i><i class="on"></i><i></i><button tabindex="-1" aria-hidden="true">Leave</button></div>' +
      '</div>' +
      '<div class="mtx-tx">' +
        '<div class="mtx-tx-bar">' +
          '<span class="mtx-dots"><i></i><i></i><i></i></span>' +
          '<span class="mtx-tx-title">Cutover planning</span>' +
          '<span class="mtx-tx-rec"><i></i>Recording</span>' +
        '</div>' +
        '<div class="mtx-tx-b">' +
          '<div class="mtx-tx-main">' +
            '<div class="mtx-tx-live"><i></i>Live transcript</div>' +
            '<div class="mtx-tx-r l1"><span class="mtx-tx-t">09:02</span><span class="mtx-tx-l"><b>Priya</b> Ports are confirmed for the 14th, so we can hold the cutover date.</span></div>' +
            '<div class="mtx-tx-r l2"><span class="mtx-tx-t">09:03</span><span class="mtx-tx-l"><b>Daniel</b> Engineer is re-booked and the site contact has been told.</span></div>' +
            '<div class="mtx-tx-r l3"><span class="mtx-tx-t">09:04</span><span class="mtx-tx-l"><b>Shaun</b> Good \u2014 let us send the handover pack today then.</span></div>' +
            '<div class="mtx-tx-r l4"><span class="mtx-tx-t">09:05</span><span class="mtx-tx-l"><b>Priya</b> I will raise the port order this afternoon.</span></div>' +
            '<div class="mtx-tx-r l5"><span class="mtx-tx-t">09:06</span><span class="mtx-tx-l"><b>Daniel</b> Numbers are all on the same account, so nothing splits.</span></div>' +
            '<div class="mtx-tx-r l6"><span class="mtx-tx-t">09:07</span><span class="mtx-tx-l"><b>Shaun</b> Do we need the old lines running in parallel?</span></div>' +
            '<div class="mtx-tx-r l7"><span class="mtx-tx-t">09:08</span><span class="mtx-tx-l"><b>Priya</b> One week overlap, then we cease them.</span></div>' +
            '<div class="mtx-tx-r l8"><span class="mtx-tx-t">09:09</span><span class="mtx-tx-l"><b>Daniel</b> Handsets ship Monday, they arrive before the engineer.</span></div>' +
            '<div class="mtx-tx-r l9"><span class="mtx-tx-t">09:10</span><span class="mtx-tx-l"><b>Shaun</b> Training slot for the front desk team?</span></div>' +
            '<div class="mtx-tx-r l10"><span class="mtx-tx-t">09:11</span><span class="mtx-tx-l"><b>Priya</b> Half an hour on the morning of the cutover.</span></div>' +
            '<div class="mtx-tx-r l11"><span class="mtx-tx-t">09:12</span><span class="mtx-tx-l"><b>Daniel</b> I will put the runbook in the shared folder.</span></div>' +
            '<div class="mtx-tx-r l12"><span class="mtx-tx-t">09:13</span><span class="mtx-tx-l"><b>Shaun</b> That covers it \u2014 thanks both.</span></div>' +
            '<div class="mtx-tx-r l13"><span class="mtx-tx-t">09:14</span><span class="mtx-tx-l"><b>Priya</b> I will confirm the porting window with the carrier.</span></div>' +
            '<div class="mtx-tx-r l14"><span class="mtx-tx-t">09:15</span><span class="mtx-tx-l"><b>Daniel</b> Site survey notes are attached to the ticket.</span></div>' +
            '<div class="mtx-tx-r l15"><span class="mtx-tx-t">09:16</span><span class="mtx-tx-l"><b>Shaun</b> Let us review again on Thursday morning.</span></div>' +
            '<div class="mtx-tx-r l16"><span class="mtx-tx-t">09:17</span><span class="mtx-tx-l"><b>Priya</b> Booked \u2014 invite is out to all three of us.</span></div>' +
            '<div class="mtx-tx-r l17"><span class="mtx-tx-t">09:18</span><span class="mtx-tx-l"><b>Daniel</b> I will chase the handset tracking numbers.</span></div>' +
          '</div>' +
          '<div class="mtx-tx-side">' +
            '<div class="mtx-tx-h">AI summary</div>' +
            '<div class="mtx-tx-sum"><b>Cutover moved to the 14th</b><span>Ports confirmed, engineer re-booked and the site contact told. One week of overlap before the old lines cease.</span></div>' +
            '<div class="mtx-tx-h">Actions</div>' +
            '<div class="mtx-tx-act"><u>Send the handover pack</u><u>Confirm the engineer slot</u><u>Raise the port order</u><u>Book front desk training</u></div>' +
            '<div class="mtx-tx-h">In this meeting</div>' +
            '<div class="mtx-tx-ppl"><u><i>PK</i>Priya Kaur</u><u><i>DR</i>Daniel Reid</u><u><i>SG</i>Shaun Gordon</u></div>' +
            '<div class="mtx-tx-h">Shared here</div>' +
            '<div class="mtx-tx-ppl mtx-tx-files"><u><i>PDF</i>Cutover plan.pdf</u><u><i>PNG</i>Site survey.png</u><u><i>XLS</i>Port list.xlsx</u></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function summaryScene() {
    return '<div class="scene summary-scene" data-scene="summary">' +
      '<div class="summary-window">' +
        '<div class="summary-head"><span class="spark-icon">' + icon('spark') + '</span><div><small>Cani Work AI meeting recap</small><h4>Project Atlas \u2014 weekly review</h4></div><span class="ready-pill">Ready</span></div>' +
        '<div class="summary-columns">' +
          '<div class="summary-copy"><b>Summary</b><p>The team confirmed the phased rollout, agreed customer training dates and approved the revised support rota.</p><div class="meta-row"><span>42 min meeting</span><span>6 participants</span><span>Transcript ready</span></div></div>' +
          '<div class="action-list"><b>Action points</b><label><i>\u2713</i><span>Shaun to approve the final user list<small>Due today</small></span></label><label><i>\u2713</i><span>Priya to share site contacts<small>Due tomorrow</small></span></label><label><i>\u2713</i><span>Alex to update the training invite<small>Due Friday</small></span></label></div>' +
        '</div>' +
      '</div>' +
      '<div class="beat beat-recap">' +'<div class="beat-head"><b>AI meeting recap</b><span class="beat-live"><i></i>Writing</span></div>' +'<p class="beat-line bl-1">Phased rollout confirmed for the London team on Monday.</p>' +'<p class="beat-line bl-2">Customer training dates agreed for the week commencing the 14th.</p>' +'<p class="beat-line bl-3">Revised support rota approved, cover confirmed for launch.</p>' +'</div>' +'<div class="ai-toast"><span>' + icon('spark') + '</span><div><b>Summary generated</b><small>3 action points identified</small></div></div>' +
    '</div>';
  }

  function whiteboardScene() {
    return '<div class="scene whiteboard-scene" data-scene="whiteboard">' +
      '<div class="board-window"><div class="window-bar"><span class="dots"><i></i><i></i><i></i></span><strong>Launch planning whiteboard</strong><span class="members">5 collaborating</span></div>' +
        '<div class="board-tools"><i>\u2196</i><i>\u25A1</i><i>\u25C7</i><i>\u2192</i><i class="active">\u270E</i><i>T</i><i>\u21B6</i></div>' +
        '<svg class="board-canvas" viewBox="0 0 660 390" aria-hidden="true">' +
          '<rect x="32" y="45" width="150" height="72" rx="12" class="board-box box-a"/><text x="107" y="77">Discovery</text><text x="107" y="98" class="small">Customer goals</text>' +
          '<rect x="255" y="45" width="150" height="72" rx="12" class="board-box box-b"/><text x="330" y="77">Design</text><text x="330" y="98" class="small">Solution map</text>' +
          '<rect x="478" y="45" width="150" height="72" rx="12" class="board-box box-c"/><text x="553" y="77">Launch</text><text x="553" y="98" class="small">Go-live plan</text>' +
          '<path d="M182 81 C210 81 226 81 255 81" class="draw-line line-a"/><path d="M405 81 C433 81 449 81 478 81" class="draw-line line-b"/>' +
          '<path d="M107 117 C107 165 190 178 255 210" class="draw-line line-c"/>' +
          '<rect x="214" y="188" width="225" height="108" rx="12" class="board-box box-d"/><text x="326" y="222">Customer success</text><text x="326" y="247" class="small">Training \u00B7 adoption \u00B7 support</text><text x="326" y="271" class="small magenta">Owner: Cani team</text>' +
          '<path d="M553 117 C553 167 472 181 439 210" class="draw-line line-d"/>' +
        '</svg>' +
        '<div class="cursor-tag cursor-one">Priya</div><div class="cursor-tag cursor-two">Alex</div><div class="cursor-tag cursor-three">Shaun</div>' +
      '</div>' +
      '<div class="board-toast"><span>' + icon('board') + '</span><div><b>Everyone is drawing</b><small>Changes sync in real time</small></div></div>' +
    '</div>';
  }

  /* Four capabilities only. The unused builders above are intentionally left
     in place so any of them can be reinstated without a rewrite. */
  var SCENES = mobileAppScene() + incomingScene() + meetingScene() + messagesScene();

  var CSS = [
    ':host{display:block;width:100%;background:#fff;color:#0a0a0b;overflow:hidden;}',
    '*,*::before,*::after{box-sizing:border-box;}',
    'button,a{font:inherit;}',
    'button{color:inherit;}',
    '[data-root]{font-family:\"Instrument Sans\", -apple-system, system-ui, sans-serif;font-size:16px;font-weight:400;line-height:normal;letter-spacing:normal;text-transform:none;text-align:left;color:#0a0a0b;background:#fff;width:100%;overflow:hidden;-webkit-font-smoothing:antialiased;--accent:#e6007e;--ink:#0a0a0b;--muted:#66666d;--mist:#eeeef1;--paper:#f7f7f8;}',
    '.showcase{display:grid;grid-template-columns:minmax(420px,.92fr) minmax(560px,1.18fr);gap:clamp(44px,6vw,108px);align-items:center;max-width:1520px;min-height:min(920px,96vh);margin:0 auto;padding:72px clamp(38px,5.6vw,88px);}',
    '.copy{min-width:0;display:flex;flex-direction:column;align-items:flex-start;}',
    '.eyebrow{display:flex;align-items:center;gap:9px;color:#5f5f63;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;}',
    '.eyebrow i{display:block;width:5px;height:5px;border-radius:50%;background:var(--accent);}',
    'h2{font-size:clamp(48px,4.1vw,66px);line-height:.98;font-weight:600;letter-spacing:-.045em;margin:20px 0 0;max-width:720px;}',
    'h2 span{color:#a1a1a6;}',
    '.intro{font-size:16px;line-height:1.55;color:#6e6e73;letter-spacing:-.012em;max-width:580px;margin:24px 0 0;}',
    '.feature-card{position:relative;width:100%;max-width:560px;min-height:214px;margin-top:34px;border:1px solid rgba(10,10,11,.08);border-radius:22px;background:#fff;box-shadow:0 1px 2px rgba(10,10,11,.04),0 26px 54px -28px rgba(10,10,11,.28);overflow:hidden;}',
    '.progress-track{position:absolute;inset:0 0 auto;height:2px;background:#ececef;z-index:4;}',
    '.progress-bar{height:100%;width:0;background:var(--accent);}',
    '.feature-panel{position:absolute;inset:0;padding:28px 30px;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .16s linear,transform .52s cubic-bezier(.32,.72,0,1);}',
    '.feature-panel.active{opacity:1;transform:none;pointer-events:auto;transition:opacity .3s cubic-bezier(.32,.72,0,1) .16s,transform .52s cubic-bezier(.32,.72,0,1);}',
    '.feature-kicker{display:flex;align-items:center;gap:13px;color:#5f5f63;font-size:11.5px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;}',
    '.feature-kicker span{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#f2f2f4;color:#16161a;}',
    '.feature-kicker svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}',
    '.feature-panel h3{font-size:20px;line-height:1.17;font-weight:650;letter-spacing:-.03em;margin:19px 0 0;}',
    '.feature-panel p{font-size:14px;line-height:1.5;color:#6e6e73;letter-spacing:-.01em;margin:10px 0 0;max-width:495px;}',
    '.feature-nav{width:100%;max-width:560px;margin-top:13px;padding:4px;background:#f0f0f2;border-radius:13px;display:grid;grid-template-columns:repeat(4,1fr);gap:3px;}',
    '.feature-tab{min-height:36px;border:0;border-radius:9px;background:transparent;color:#595960;font-size:11px;font-weight:650;cursor:pointer;padding:7px 4px;transition:background .25s,color .25s,box-shadow .25s;}',
    '.feature-tab[aria-selected="true"]{background:#fff;color:#0a0a0b;box-shadow:0 1px 3px rgba(10,10,11,.13),0 0 0 .5px rgba(10,10,11,.04);}',
    '.feature-tab:focus-visible,.motion-toggle:focus-visible,.cta:focus-visible{outline:2px solid var(--accent);outline-offset:3px;}',
    '.under-nav{width:100%;max-width:560px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;}',
    '.motion-toggle{border:1px solid #e6e6e9;border-radius:999px;background:#fff;color:#5f5f63;font-size:11px;font-weight:600;min-height:34px;padding:7px 12px;cursor:pointer;}',
    '.state-count{font-size:11.5px;color:#77777e;font-variant-numeric:tabular-nums;}',
    '.actions{display:flex;align-items:center;gap:18px;margin-top:28px;}',
    '.cta{min-height:46px;display:inline-flex;align-items:center;justify-content:center;border-radius:10px;padding:0 19px;text-decoration:none;font-size:14px;font-weight:700;transition:transform .25s,box-shadow .25s;}',
    '.cta.primary{background:var(--accent);color:#fff;box-shadow:0 14px 28px -14px rgba(230,0,126,.7);}',
    '.cta.secondary{color:var(--accent);padding-inline:4px;}',
    '.cta:hover{transform:translateY(-2px);}',
    '.proof{display:flex;align-items:center;gap:9px;margin-top:20px;color:#5f5f63;font-size:13px;}',
    '.proof strong{color:#c4005a;font-size:12px;letter-spacing:1px;}',
    '.stage{position:relative;min-width:0;display:grid;place-items:center;}',
    '.stage-shell{position:relative;width:min(100%,760px);aspect-ratio:1.08/1;isolation:isolate;}',
    '.stage-rings{position:absolute;inset:8%;border-radius:50%;background:repeating-radial-gradient(circle at 50% 86%,transparent 0 46px,rgba(230,0,126,.16) 47px 49px,transparent 50px 81px);opacity:.75;}',
    '.stage-glow{position:absolute;inset:14%;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.9),rgba(255,255,255,0) 68%);}',
    '.scene{position:absolute;inset:4%;z-index:2;opacity:0;transform:translateY(14px) scale(.985);pointer-events:none;transition:opacity .58s cubic-bezier(.32,.72,0,1),transform .58s cubic-bezier(.32,.72,0,1);}',
    '.scene.active{opacity:1;transform:none;}',
    '.device,.app-window,.chat-window,.meeting-window,.summary-window,.board-window,.phone-chat{background:#fff;border:1px solid #dedee3;box-shadow:0 34px 70px -34px rgba(10,10,11,.42);}',
    '.device{position:absolute;border-radius:18px;overflow:hidden;}',
    '.device-top,.window-bar{height:42px;display:flex;align-items:center;gap:10px;border-bottom:1px solid #e8e8eb;padding:0 14px;font-size:11px;color:#54545b;background:rgba(255,255,255,.94);}',
    '.device-top strong,.window-bar strong{font-size:12px;color:#3f3f46;letter-spacing:-.01em;}',
    '.dots{display:flex;gap:5px;margin-right:2px;}.dots i{width:7px;height:7px;border-radius:50%;background:#dedee3;display:block;}',
    '.presence{margin-left:auto;width:10px;height:10px;border-radius:50%;background:#4fc36b;}',
    '.device-body{position:absolute;inset:42px 0 0;background:#f7f7f9;}',
    '.device-label{position:absolute;right:9px;bottom:8px;background:#16161a;color:#fff;font-size:8px;font-weight:700;border-radius:99px;padding:4px 7px;}',
    '.desktop-device{left:3%;top:29%;width:58%;height:48%;z-index:2;}',
    '.phone-device{right:4%;top:10%;width:29%;height:65%;z-index:4;border-radius:28px;}',
    '.tablet-device{right:8%;bottom:3%;width:42%;height:30%;z-index:3;}',
    '.avatar{flex:none;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:12px;}',
    '.avatar.large,.large.avatar{width:60px;height:60px;font-size:17px;}',
    '.avatar-pink{background:#f7d7e8;color:#a20b5a;}.avatar-dark{background:#202024;color:#fff;}.avatar-grey{background:#e5e5e8;color:#45454b;}',
    '.incoming-desk,.incoming-tablet{display:flex;align-items:center;gap:12px;padding:22px;}',
    '.incoming-desk small,.incoming-tablet small,.incoming-mobile small{display:block;color:#77777e;font-size:9px;text-transform:uppercase;letter-spacing:.08em;}',
    '.incoming-desk b,.incoming-tablet b,.incoming-mobile b{display:block;font-size:15px;margin-top:3px;}',
    '.incoming-desk em,.incoming-tablet em,.incoming-mobile em{display:block;color:#77777e;font-size:10px;font-style:normal;margin-top:3px;}',
    '.call-actions{display:flex;gap:8px;margin-left:auto;}',
    '.call-actions button,.mobile-actions i,.incoming-tablet>i{width:34px;height:34px;border:0;border-radius:50%;display:grid;place-items:center;color:#fff;}',
    '.call-actions svg,.mobile-actions svg,.incoming-tablet svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;transform:rotate(0deg);}',
    '.decline{background:#ea4b55;}.answer{background:#38b563;}',
    '.incoming-mobile{text-align:center;padding:26px 10px;}.incoming-mobile .avatar{margin:18px auto 10px;}',
    '.mobile-actions{display:flex;justify-content:center;gap:36px;margin-top:24px;}',
    '.incoming-tablet{padding:15px 18px;}.incoming-tablet>i{margin-left:auto;}',
    '.signal-rings{position:absolute;inset:4%;border-radius:50%;border:2px solid rgba(230,0,126,.18);animation:ringPulse 2.2s ease-out infinite;}',
    '.signal-rings::before,.signal-rings::after{content:"";position:absolute;border-radius:50%;border:2px solid rgba(230,0,126,.16);inset:10%;animation:ringPulse 2.2s .35s ease-out infinite;}',
    '.signal-rings::after{inset:20%;animation-delay:.7s;}',
    '.app-window{position:absolute;inset:10% 4%;border-radius:22px;overflow:hidden;}',
    '.window-bar{justify-content:flex-start;}.window-bar>span:last-child{margin-left:auto;}',
    '.rec{font-size:9px;font-weight:700;color:#a71336;background:#fde9ed;border-radius:99px;padding:5px 8px;}.rec i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#e23a4a;margin-right:4px;animation:blink 1s infinite;}',
    '.call-grid{height:calc(100% - 42px);display:grid;grid-template-columns:29% 1fr;}',
    '.call-profile{background:#f4f4f6;border-right:1px solid #e4e4e8;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:18px;}',
    '.call-profile b{font-size:17px;margin-top:12px;}.call-profile small{font-size:10px;color:#77777e;margin-top:4px;}.secure{margin-top:20px;font-size:9px;color:#287744;background:#e5f5e9;border-radius:99px;padding:5px 8px;}',
    '.call-content{padding:24px 28px;position:relative;}.waveform{height:76px;display:flex;align-items:center;justify-content:center;gap:4px;overflow:hidden;}',
    '.waveform i{width:4px;height:calc(12px + var(--n)*6px);border-radius:4px;background:linear-gradient(#f548a0,#e6007e);animation:wave .72s var(--d) ease-in-out infinite alternate;}',
    '.call-time{text-align:center;color:#77777e;font-size:10px;font-variant-numeric:tabular-nums;margin-top:-4px;}',
    '.transcript{margin-top:17px;border-top:1px solid #ececef;padding-top:15px;}.live-pill{font-size:8px;font-weight:700;color:#a20b5a;background:#f9dfed;border-radius:99px;padding:4px 6px;}',
    '.transcript p{font-size:10.5px;line-height:1.45;color:#4c4c53;margin:10px 0 0;}.transcript b{color:#16161a;margin-right:6px;}.typing-line{clip-path:inset(0 100% 0 0);animation:revealText 2.2s 1s steps(34,end) forwards;}',
    '.mini-stat,.delivery-toast,.reply-status,.meeting-clock,.ai-toast,.board-toast{position:absolute;z-index:5;background:#fff;border:1px solid #e3e3e7;border-radius:15px;box-shadow:0 24px 50px -24px rgba(10,10,11,.45);display:flex;align-items:center;gap:10px;padding:12px 14px;}',
    '.mini-stat{right:0;bottom:3%;}.mini-stat span,.ai-toast>span,.board-toast>span{width:34px;height:34px;border-radius:10px;background:#f6dbe9;color:#a50b5c;display:grid;place-items:center;}',
    '.mini-stat svg,.ai-toast svg,.board-toast svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;}',
    '.mini-stat b,.delivery-toast b,.reply-status b,.meeting-clock b,.ai-toast b,.board-toast b{display:block;font-size:11px;}.mini-stat small,.delivery-toast small,.reply-status small,.ai-toast small,.board-toast small{display:block;color:#77777e;font-size:9px;margin-top:2px;}',
    '.world-map{position:absolute;inset:9%;border-radius:24px;background:linear-gradient(145deg,#f8f8fa,#eeeef1);overflow:hidden;}',
    '.world-map::before{content:"";position:absolute;inset:9%;opacity:.5;background:radial-gradient(ellipse at 25% 38%,#d6d6db 0 8%,transparent 8.5%),radial-gradient(ellipse at 48% 32%,#d6d6db 0 10%,transparent 10.5%),radial-gradient(ellipse at 69% 66%,#d6d6db 0 7%,transparent 7.5%);filter:blur(2px);}',
    '.route{position:absolute;height:2px;background:linear-gradient(90deg,transparent,#e6007e,transparent);transform-origin:left center;}.route-a{width:54%;left:25%;top:42%;transform:rotate(-8deg);}.route-b{width:45%;left:49%;top:43%;transform:rotate(31deg);}',
    '.dot{position:absolute;width:11px;height:11px;border-radius:50%;background:#e6007e;border:3px solid #fff;box-shadow:0 0 0 5px rgba(230,0,126,.13);}.london{left:47%;top:34%;}.newyork{left:25%;top:39%;}.sydney{right:14%;bottom:20%;}',
    '.message-card{position:absolute;z-index:3;width:42%;background:#fff;border:1px solid #e2e2e6;border-radius:16px;box-shadow:0 22px 45px -28px rgba(10,10,11,.5);padding:13px;display:flex;gap:10px;animation:messageIn .6s both;}',
    '.message-card small{font-size:9px;color:#77777e;}.message-card p{font-size:10.5px;line-height:1.35;margin:5px 0;color:#303036;}.message-card em{font-size:8px;color:#9b0a58;font-style:normal;}.msg-london{left:4%;top:8%;}.msg-newyork{right:1%;top:35%;animation-delay:.5s;}.msg-sydney{left:19%;bottom:10%;animation-delay:1s;}',
    '.timezone-strip{position:absolute;left:14%;right:10%;bottom:2%;display:flex;justify-content:space-between;color:#77777e;font-size:8px;text-transform:uppercase;letter-spacing:.08em;}',
    '.chat-window{position:absolute;inset:8% 6%;border-radius:22px;overflow:hidden;}.members{font-size:9px;color:#77777e;margin-left:auto;}',
    '.chat-history{padding:30px 36px 15px;display:flex;flex-direction:column;gap:9px;}.bubble{max-width:62%;font-size:10.5px;line-height:1.4;padding:10px 12px;border-radius:13px;}.received{background:#efeff2;align-self:flex-start;}.sent{background:#e6007e;color:#fff;align-self:flex-end;}',
    '.file-delivery{margin:4px 36px 18px;border:1px solid #dedee3;border-radius:15px;padding:14px;display:flex;align-items:flex-start;gap:13px;box-shadow:0 13px 30px -25px rgba(10,10,11,.4);}',
    '.file-icon{width:42px;height:46px;border-radius:9px;background:#f9dbe9;color:#a20b5a;font-size:9px;font-weight:800;display:grid;place-items:center;}.file-meta{flex:1;min-width:0;}.file-meta b{display:block;font-size:11px;}.file-meta small{display:block;font-size:9px;color:#77777e;margin-top:3px;}.upload-track{height:5px;border-radius:9px;background:#ececef;margin-top:10px;overflow:hidden;}.upload-track i{display:block;height:100%;width:0;background:#e6007e;border-radius:inherit;animation:upload 2.2s .4s cubic-bezier(.32,.72,0,1) forwards;}.file-meta em{display:block;font-size:8.5px;color:#287744;font-style:normal;margin-top:8px;opacity:0;animation:fadeUp .45s 2.4s forwards;}.check{font-weight:800;}',
    '.composer{position:absolute;left:36px;right:36px;bottom:22px;height:42px;border-radius:13px;background:#f1f1f3;color:#929298;display:flex;align-items:center;justify-content:space-between;padding:0 13px;font-size:10px;}.composer i{width:28px;height:28px;border-radius:50%;background:#e6007e;color:#fff;display:grid;place-items:center;}.composer svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;}',
    '.delivery-toast{right:0;bottom:3%;opacity:0;animation:fadeUp .5s 2.4s forwards;}.delivery-toast>.check{width:30px;height:30px;border-radius:50%;background:#daf3e2;color:#247841;display:grid;place-items:center;}',
    '.phone-chat{position:absolute;left:27%;top:4%;width:46%;height:88%;border-radius:34px;overflow:hidden;}.phone-chat-head{height:72px;border-bottom:1px solid #e7e7ea;display:flex;align-items:center;gap:10px;padding:14px 18px;}.phone-chat-head b{display:block;font-size:12px;}.phone-chat-head small{display:block;font-size:9px;color:#2b8849;margin-top:2px;}.phone-chat-head>span:last-child{margin-left:auto;width:30px;height:30px;border-radius:50%;background:#f0f0f2;display:grid;place-items:center;}.phone-chat-head svg{width:15px;height:15px;fill:none;stroke:#55555c;stroke-width:1.8;}',
    '.phone-chat-body{padding:22px 17px;display:flex;flex-direction:column;gap:10px;}.phone-chat-body .bubble{font-size:10px;max-width:80%;}.small-bubble{margin-top:-5px;}.sent-response{opacity:0;transform:translateY(8px);animation:fadeUp .45s 3.15s forwards;}',
    '.typing-composer{position:absolute;left:13px;right:13px;bottom:15px;min-height:58px;background:#f0f0f2;border-radius:16px;padding:12px 50px 12px 13px;font-size:9.5px;line-height:1.35;display:flex;align-items:center;}.typed-copy{display:inline-block;max-width:0;overflow:hidden;white-space:nowrap;animation:type 2.6s .35s steps(46,end) forwards;}.cursor{width:1px;height:16px;background:#e6007e;animation:blink .65s infinite;}.typing-composer button{position:absolute;right:10px;bottom:10px;width:36px;height:36px;border:0;border-radius:50%;background:#e6007e;color:#fff;display:grid;place-items:center;}.typing-composer svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;}',
    '.reply-status{right:9%;top:14%;opacity:0;animation:fadeUp .5s 3.4s forwards;}.pulse-dot{width:12px;height:12px;border-radius:50%;background:#39b965;box-shadow:0 0 0 7px rgba(57,185,101,.13);}',
    '.meeting-window{position:absolute;inset:6% 3%;border-radius:22px;overflow:hidden;background:#18181d;}.dark-bar{background:#202027;border-color:#303038;color:#eee;}.dark-bar strong{color:#eee;}.live-count{font-size:9px;color:#eee;margin-left:auto;}.live-count i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#4fc36b;margin-right:4px;}',
    '.video-grid{height:calc(100% - 94px);padding:12px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:8px;}.video-tile{position:relative;border-radius:11px;display:grid;place-items:center;overflow:hidden;}.video-tile small{position:absolute;left:8px;bottom:6px;color:#fff;font-size:8px;background:rgba(0,0,0,.45);padding:3px 5px;border-radius:5px;}.tile-dark{background:#353540}.tile-pink{background:#5a2943}.tile-blue{background:#2e4054}.tile-purple{background:#433952}.tile-green{background:#30483d}.tile-sand{background:#5b5143}.video-tile .avatar{background:rgba(255,255,255,.12);color:#fff;}.speaking{position:absolute;inset:0;border:2px solid #e6007e;border-radius:11px;animation:blink 1.5s infinite;}',
    '.meeting-controls{height:52px;display:flex;justify-content:center;align-items:center;gap:9px;background:#202027;}.meeting-controls i{width:31px;height:31px;border-radius:50%;background:#34343c;color:#fff;display:grid;place-items:center;}.meeting-controls i.active{background:#e6007e;}.meeting-controls svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;}.meeting-controls button{border:0;border-radius:99px;background:#e74a53;color:#fff;font-size:9px;font-weight:700;padding:8px 16px;}',
    '.meeting-clock{right:0;top:1%;flex-direction:column;align-items:flex-start;gap:2px;}.meeting-clock span{font-size:9px;color:#77777e;}',
    '.summary-window{position:absolute;inset:8% 3%;border-radius:22px;padding:24px;}.summary-head{display:flex;align-items:center;gap:13px;padding-bottom:18px;border-bottom:1px solid #e7e7ea;}.spark-icon{width:46px;height:46px;border-radius:14px;background:#f8dce9;color:#a20b5a;display:grid;place-items:center;}.spark-icon svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.6;}.summary-head small{font-size:9px;color:#77777e;text-transform:uppercase;letter-spacing:.08em;}.summary-head h4{font-size:16px;margin:4px 0 0;}.ready-pill{margin-left:auto;background:#dff4e5;color:#277845;border-radius:99px;padding:6px 9px;font-size:9px;font-weight:700;}',
    '.summary-columns{display:grid;grid-template-columns:1fr 1fr;gap:22px;padding-top:20px;}.summary-columns>div>b{font-size:11px;}.summary-copy p{font-size:10.5px;line-height:1.5;color:#55555c;margin:10px 0;}.meta-row{display:flex;flex-wrap:wrap;gap:6px;}.meta-row span{font-size:8px;border-radius:99px;padding:5px 7px;background:#f0f0f2;color:#66666d;}',
    '.action-list{display:flex;flex-direction:column;gap:8px;}.action-list>b{margin-bottom:2px;}.action-list label{display:flex;gap:8px;padding:9px;border-radius:10px;background:#f6f6f8;opacity:0;animation:fadeUp .4s forwards;}.action-list label:nth-of-type(1){animation-delay:.55s}.action-list label:nth-of-type(2){animation-delay:.95s}.action-list label:nth-of-type(3){animation-delay:1.35s}.action-list label>i{width:18px;height:18px;border-radius:50%;background:#e6007e;color:#fff;font-style:normal;font-size:10px;display:grid;place-items:center;}.action-list label span{font-size:9px;line-height:1.25;}.action-list label small{display:block;color:#77777e;font-size:8px;margin-top:3px;}',
    '.ai-toast{right:0;bottom:2%;opacity:0;animation:fadeUp .5s 1.8s forwards;}',
    '.board-window{position:absolute;inset:5% 2%;border-radius:22px;overflow:hidden;}.board-tools{position:absolute;left:17px;top:58px;z-index:3;display:flex;gap:5px;background:#fff;border:1px solid #e2e2e6;border-radius:10px;padding:5px;box-shadow:0 10px 30px -20px rgba(0,0,0,.4);}.board-tools i{width:26px;height:26px;border-radius:6px;display:grid;place-items:center;font-size:12px;font-style:normal;color:#55555c;}.board-tools i.active{background:#e6007e;color:#fff;}',
    '.board-canvas{position:absolute;inset:42px 0 0;width:100%;height:calc(100% - 42px);background:radial-gradient(circle,#d7d7dc 1px,transparent 1.2px);background-size:18px 18px;}.board-box{fill:#fff;stroke:#cfcfd5;stroke-width:2;}.box-b,.box-d{fill:#fff3f9;stroke:#e6007e;}.board-canvas text{text-anchor:middle;font:700 13px Arial;fill:#303036;}.board-canvas text.small{font-size:10px;font-weight:400;fill:#77777e;}.board-canvas text.magenta{fill:#aa0a60;font-weight:700;}.draw-line{fill:none;stroke:#e6007e;stroke-width:3;stroke-linecap:round;stroke-dasharray:240;stroke-dashoffset:240;animation:draw 1s forwards;}.line-b{animation-delay:.35s}.line-c{animation-delay:.7s}.line-d{animation-delay:1.05s}',
    '.cursor-tag{position:absolute;z-index:4;padding:4px 7px;border-radius:4px 8px 8px 8px;color:#fff;font-size:8px;font-weight:700;animation:cursorMove 3.2s ease-in-out infinite alternate;}.cursor-tag::before{content:"";position:absolute;left:-4px;top:-4px;border:5px solid transparent;border-right-color:inherit;transform:rotate(45deg);}.cursor-one{left:21%;top:44%;background:#e6007e;color:#fff;}.cursor-two{right:22%;top:51%;background:#2877c7;animation-delay:.4s}.cursor-three{left:47%;bottom:13%;background:#2b8849;animation-delay:.8s}',
    '.board-toast{right:0;bottom:1%;}.board-toast>span{background:#f1e1f9;color:#6a3c94;}',
    '@keyframes ringPulse{0%{transform:scale(.88);opacity:0}45%{opacity:1}100%{transform:scale(1.06);opacity:0}}',
    '@keyframes blink{0%,100%{opacity:1}50%{opacity:.35}}',
    '@keyframes wave{from{transform:scaleY(.45)}to{transform:scaleY(1)}}',
    '@keyframes revealText{to{clip-path:inset(0 0 0 0)}}',
    '@keyframes messageIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}',
    '@keyframes upload{to{width:100%}}',
    '@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '@keyframes type{to{max-width:290px}}',
    '@keyframes draw{to{stroke-dashoffset:0}}',
    '@keyframes cursorMove{from{transform:translate(0,0)}to{transform:translate(34px,-24px)}}',
    '.scene:not(.active) *{animation-play-state:paused!important;}',
    ':host([data-offscreen]) *{animation-play-state:paused!important;}',
    '.reference-scene{inset:0;display:grid;place-items:center;}',
    '.reference-frame{position:relative;width:100%;height:100%;display:grid;place-items:center;overflow:hidden;border-radius:28px;background:#efeee7;box-shadow:0 34px 70px -42px rgba(10,10,11,.34);}',
    '.reference-image{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transform:scale(.94);opacity:0;filter:saturate(.96);}',
    '.reference-scene.active .reference-image{animation:referenceArrive .72s cubic-bezier(.2,.8,.2,1) forwards;}',
    '.reference-wash{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.1));pointer-events:none;}',
    '.reference-label{position:absolute;left:18px;bottom:16px;padding:7px 10px;border-radius:99px;background:rgba(20,20,22,.86);color:#fff;font-size:10px;font-weight:700;letter-spacing:.04em;box-shadow:0 8px 24px rgba(10,10,11,.16);z-index:8;}',
    '.call-reference{background:#f2f0e8;}',
    '.ring-set{position:absolute;width:170px;height:170px;z-index:4;opacity:0;transform:scale(.7);}',
    '.ring-set i{position:absolute;inset:0;border:3px solid rgba(230,0,126,.5);border-radius:50%;animation:ringOut 1.8s ease-out infinite;}',
    '.ring-set i:nth-child(2){animation-delay:.42s}.ring-set i:nth-child(3){animation-delay:.84s}.ring-left{left:4%;top:34%}.ring-right{right:18%;top:30%;}',
    '.incoming-reference.active .ring-set{animation:fadeUp .45s .62s ease forwards;}',
    '.incoming-card{position:absolute;right:8%;bottom:8%;z-index:7;display:flex;align-items:center;gap:10px;min-width:210px;padding:12px 13px;border-radius:15px;background:rgba(255,255,255,.96);box-shadow:0 18px 42px rgba(20,20,22,.22);opacity:0;transform:translateY(18px);}',
    '.incoming-reference.active .incoming-card{animation:cardRise .55s 1.05s cubic-bezier(.2,.8,.2,1) forwards;}',
    '.caller-avatar{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#f9d8ea;color:#bb0067;font-size:12px;font-weight:800}.incoming-card span:nth-child(2){display:grid;gap:1px;flex:1}.incoming-card small,.incoming-card em{font-size:9px;color:#777;font-style:normal}.incoming-card b{font-size:12px}.answer-pulse{display:grid;place-items:center;width:35px;height:35px;border-radius:50%;background:#2eae60;color:#fff;animation:answerPulse 1.5s infinite}.answer-pulse svg{width:15px;fill:none;stroke:currentColor;stroke-width:1.8;transform:rotate(130deg)}',
    '.transcript-reference{background:#f0efe8}.transcript-reference .reference-image{object-fit:contain;}',
    '.recording-strip{position:absolute;left:8%;right:8%;bottom:8%;z-index:6;display:flex;align-items:center;gap:16px;padding:11px 14px;border-radius:14px;background:rgba(20,20,23,.94);box-shadow:0 18px 38px rgba(10,10,11,.3);opacity:0;transform:translateY(15px)}',
    '.live-reference.active .recording-strip{animation:cardRise .5s .65s ease forwards}.recording-strip .rec{color:#fff;white-space:nowrap}.recording-strip .waveform{flex:1;height:28px;margin:0}.recording-strip .waveform i{background:#e6007e}',
    '.live-transcript{position:absolute;left:8%;bottom:20%;z-index:7;width:min(330px,54%);padding:15px;border-radius:14px;background:rgba(255,255,255,.96);box-shadow:0 18px 42px rgba(10,10,11,.2);opacity:0;transform:translateY(12px)}',
    '.live-reference.active .live-transcript{animation:cardRise .48s 1.05s ease forwards}.live-transcript span{font-size:8px;font-weight:800;color:#e6007e;letter-spacing:.12em}.live-transcript p{font-size:10px;line-height:1.42;margin:8px 0 0;color:#56565c}.live-transcript b{color:#121214}.transcript-last{clip-path:inset(0 100% 0 0)}.live-reference.active .transcript-last{animation:revealText 1.25s 1.55s steps(18,end) forwards}',
    '.message-reference{background:#fff}.message-reference .reference-image{object-fit:cover;}',
    '.message-arcs{position:absolute;inset:0;width:100%;height:100%;z-index:3;overflow:visible}.message-arcs path{fill:none;stroke:#e6007e;stroke-width:4;stroke-linecap:round;stroke-dasharray:900;stroke-dashoffset:900;opacity:.62}.messages-reference.active .message-arcs path{animation:draw 1.25s .48s ease forwards}.messages-reference.active .message-arcs path:nth-child(2){animation-delay:.66s}.messages-reference.active .message-arcs path:nth-child(3){animation-delay:.84s}',
    '.geo-message{position:absolute;z-index:7;display:grid;gap:2px;padding:9px 11px;border-radius:12px;background:rgba(255,255,255,.96);box-shadow:0 14px 35px rgba(10,10,11,.18);font-size:9px;opacity:0;transform:translateY(12px)}.geo-message b{font-size:10px}.geo-message span{color:#616169}.geo-london{left:5%;top:15%}.geo-newyork{right:6%;top:17%}.geo-sydney{right:7%;bottom:11%}.messages-reference.active .geo-message{animation:messageIn .45s .9s ease forwards}.messages-reference.active .geo-newyork{animation-delay:1.35s}.messages-reference.active .geo-sydney{animation-delay:1.8s}',
    '.file-reference .reference-image,.response-reference-frame .reference-image{filter:saturate(.86) brightness(.86);}',
    '.file-share-card{position:absolute;left:9%;top:25%;z-index:7;width:min(390px,72%);display:flex;gap:13px;padding:18px;border-radius:17px;background:#fff;box-shadow:0 24px 50px rgba(10,10,11,.28);opacity:0;transform:translateY(16px) scale(.98)}.files-reference.active .file-share-card{animation:cardRise .52s .6s ease forwards}.file-type{display:grid;place-items:center;width:48px;height:56px;border-radius:10px;background:#fde5f2;color:#cf006f;font-size:11px;font-weight:900}.file-share-card>div{display:grid;gap:4px;flex:1}.file-share-card b{font-size:13px}.file-share-card small{font-size:10px;color:#76767d}.file-share-card em{font-size:10px;color:#248148;font-style:normal;opacity:0}.file-progress{height:5px;border-radius:5px;background:#ececef;overflow:hidden;margin:6px 0}.file-progress i{display:block;height:100%;width:0;background:#e6007e}.files-reference.active .file-progress i{animation:upload 1.2s 1.08s ease forwards}.files-reference.active .file-share-card em{animation:fadeUp .35s 2.15s ease forwards}',
    '.delivery-confirm{position:absolute;right:7%;bottom:10%;z-index:8;display:grid;grid-template-columns:32px 1fr;gap:1px 9px;align-items:center;padding:11px 14px;border-radius:14px;background:#1d1d20;color:#fff;box-shadow:0 18px 38px rgba(10,10,11,.3);opacity:0;transform:translateY(12px)}.delivery-confirm span{grid-row:1/3;display:grid;place-items:center;width:32px;height:32px;border-radius:50%;background:#2eae60}.delivery-confirm b{font-size:11px}.delivery-confirm small{font-size:9px;color:#bdbdc3}.files-reference.active .delivery-confirm{animation:cardRise .45s 2.25s ease forwards}',
    '.response-thread{position:absolute;right:7%;top:18%;z-index:7;width:min(350px,66%);display:grid;gap:10px;padding:18px;border-radius:18px;background:rgba(255,255,255,.97);box-shadow:0 24px 55px rgba(10,10,11,.28);opacity:0;transform:translateY(15px)}.response-reference.active .response-thread{animation:cardRise .48s .58s ease forwards}.received-line,.sent-line,.typing-line-v2{width:85%;padding:10px 12px;border-radius:12px;font-size:11px;line-height:1.35}.received-line{background:#f0f0f2}.typing-line-v2{justify-self:end;background:#fde6f2;overflow:hidden;white-space:nowrap}.typing-line-v2 span{display:inline-block;width:0;overflow:hidden}.response-reference.active .typing-line-v2 span{animation:typeV2 1.4s 1.1s steps(30,end) forwards}.typing-line-v2 i{display:inline-block;width:1px;height:13px;background:#e6007e;animation:blink .65s infinite}.sent-line{justify-self:end;background:#e6007e;color:#fff;opacity:0}.sent-line small{display:block;margin-top:4px;font-size:8px;opacity:.78}.response-reference.active .sent-line{animation:messageIn .35s 2.65s ease forwards}',
    '.meeting-grid-reference{background:#f0efe8}.meeting-grid-reference .reference-image{object-fit:contain}.meeting-live{position:absolute;right:7%;top:8%;z-index:8;padding:8px 10px;border-radius:99px;background:#1c1c1f;color:#fff;font-size:9px;font-weight:800;opacity:0}.meeting-live i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#e84b55;margin-right:5px;animation:blink 1s infinite}.meeting-reference.active .meeting-live{animation:fadeUp .4s .65s ease forwards}.participant-locations{position:absolute;left:8%;right:8%;bottom:9%;z-index:8;display:flex;justify-content:center;gap:7px}.participant-locations span{padding:6px 9px;border-radius:99px;background:rgba(25,25,27,.88);color:#fff;font-size:8px;opacity:0;transform:translateY(8px)}.meeting-reference.active .participant-locations span{animation:messageIn .35s .8s ease forwards}.meeting-reference.active .participant-locations span:nth-child(2){animation-delay:1.02s}.meeting-reference.active .participant-locations span:nth-child(3){animation-delay:1.24s}.meeting-reference.active .participant-locations span:nth-child(4){animation-delay:1.46s}.speaker-orbit{position:absolute;left:30%;top:28%;z-index:5;width:25%;aspect-ratio:1;border:3px solid #e6007e;border-radius:14px;opacity:0;box-shadow:0 0 0 5px rgba(230,0,126,.15)}.meeting-reference.active .speaker-orbit{animation:speakerFocus 2.4s 1.2s ease-in-out infinite}',
    '.summary-reference-frame .reference-image,.board-reference-frame .reference-image{filter:saturate(.65) brightness(.7);}.summary-reference-frame .reference-wash,.board-reference-frame .reference-wash{background:rgba(244,243,237,.45)}',
    '.ai-summary-panel{position:absolute;inset:10% 8%;z-index:8;padding:21px;border-radius:20px;background:rgba(255,255,255,.97);box-shadow:0 28px 60px rgba(10,10,11,.28);opacity:0;transform:translateY(16px) scale(.985)}.summary-reference.active .ai-summary-panel{animation:cardRise .58s .62s ease forwards}.ai-heading{display:flex;align-items:center;gap:11px}.ai-heading>span{display:grid;place-items:center;width:39px;height:39px;border-radius:50%;background:#fde6f2;color:#e6007e}.ai-heading svg{width:18px;fill:none;stroke:currentColor;stroke-width:1.5}.ai-heading div{display:grid;gap:2px;flex:1}.ai-heading small{font-size:9px;color:#777}.ai-heading b{font-size:13px}.ai-heading em{padding:5px 8px;border-radius:99px;background:#e9f6ed;color:#238348;font-size:9px;font-style:normal}.ai-summary-panel>p{margin:17px 0 12px;font-size:11px;line-height:1.5;color:#5c5c63}.ai-actions{display:grid;gap:7px}.ai-actions label{display:grid;grid-template-columns:24px 1fr auto;gap:7px;align-items:center;padding:9px;border-radius:10px;background:#f4f4f6;font-size:10px;opacity:0;transform:translateY(6px)}.ai-actions i{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#e7f5eb;color:#238348;font-style:normal}.ai-actions small{font-size:8px;color:#777}.summary-reference.active .ai-actions label{animation:messageIn .35s 1.15s ease forwards}.summary-reference.active .ai-actions label:nth-child(2){animation-delay:1.42s}.summary-reference.active .ai-actions label:nth-child(3){animation-delay:1.69s}',
    '.whiteboard-panel{position:absolute;inset:8% 6%;z-index:8;border-radius:20px;background:#fff;box-shadow:0 28px 60px rgba(10,10,11,.3);overflow:hidden;opacity:0;transform:translateY(16px) scale(.985)}.whiteboard-reference.active .whiteboard-panel{animation:cardRise .55s .58s ease forwards}.whiteboard-head{height:46px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid #ececef;font-size:11px}.whiteboard-head span{font-size:9px;color:#777}.whiteboard-panel svg{width:100%;height:calc(100% - 46px)}.whiteboard-panel rect{fill:#fff;stroke:#dedee3;stroke-width:2}.whiteboard-panel rect:nth-of-type(2){fill:#fdeaf4;stroke:#e6007e}.whiteboard-panel text{font:700 12px Arial;text-anchor:middle;fill:#202024}.whiteboard-panel path{fill:none;stroke:#e6007e;stroke-width:3;stroke-linecap:round;stroke-dasharray:240;stroke-dashoffset:240}.whiteboard-reference.active .whiteboard-panel path{animation:draw .7s 1.15s ease forwards}.whiteboard-reference.active .whiteboard-panel path:nth-of-type(2){animation-delay:1.45s}.whiteboard-reference.active .whiteboard-panel path:nth-of-type(3){animation-delay:1.75s}.whiteboard-reference.active .whiteboard-panel path:nth-of-type(4){animation-delay:2.05s}.cursor-tag-v2{position:absolute;z-index:9;padding:4px 7px;border-radius:6px;background:#1c1c1f;color:#fff;font-size:8px;opacity:0}.cursor-priya{left:30%;top:35%}.cursor-alex{right:20%;top:45%}.cursor-shaun{left:48%;bottom:16%}.whiteboard-reference.active .cursor-tag-v2{animation:cursorAppear .45s 1.35s ease forwards}.whiteboard-reference.active .cursor-alex{animation-delay:1.7s}.whiteboard-reference.active .cursor-shaun{animation-delay:2.05s}',
    '@keyframes referenceArrive{from{opacity:0;transform:translateY(12px) scale(.94)}to{opacity:1;transform:none}}',
    '@keyframes ringOut{0%{opacity:.85;transform:scale(.3)}100%{opacity:0;transform:scale(1)}}',
    '@keyframes cardRise{to{opacity:1;transform:none}}',
    '@keyframes answerPulse{0%,100%{box-shadow:0 0 0 0 rgba(46,174,96,.4)}50%{box-shadow:0 0 0 8px rgba(46,174,96,0)}}',
    '@keyframes typeV2{to{width:265px}}',
    '@keyframes speakerFocus{0%,100%{opacity:.55;transform:scale(.97)}50%{opacity:1;transform:scale(1.03)}}',
    '@keyframes cursorAppear{from{opacity:0;transform:translate(-12px,12px)}to{opacity:1;transform:none}}',
    '.motion-phone{position:absolute;left:6%;top:8%;z-index:7;width:31%;height:80%;border:5px solid #343438;border-radius:24px;background:#fff;box-shadow:0 24px 48px rgba(10,10,11,.28);overflow:hidden;opacity:0;transform:translateY(16px) scale(.96)}',
    '.messages-reference.active .motion-phone{animation:motionPhoneArrive .65s .35s cubic-bezier(.2,.8,.2,1) forwards}',
    '.motion-phone-head{height:58px;display:flex;align-items:center;gap:9px;padding:11px 12px;border-bottom:1px solid #e8e8eb;background:#fff}.motion-phone-head>div{display:grid;gap:1px;flex:1}.motion-phone-head b{font-size:10px}.motion-phone-head small{font-size:8px;color:#2e9b55}.motion-phone-head>span:last-child{font-size:10px;color:#777}.mini-avatar{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#f9d9ea;color:#c10069;font-size:9px;font-weight:800}',
    '.motion-thread{position:absolute;left:0;right:0;top:58px;bottom:43px;padding:13px 11px;display:flex;flex-direction:column;gap:9px;background:#fff;opacity:0}.motion-thread p{width:88%;margin:0;padding:9px 10px;border-radius:11px;font-size:8px;line-height:1.35}.motion-thread p small{display:block;margin-top:4px;font-size:6.5px;opacity:.72}.incoming-bubble{align-self:flex-start;background:#f0f0f2;color:#25252a}.outgoing-bubble{align-self:flex-end;background:#e6007e;color:#fff}.thread-empty{align-items:center;justify-content:center;text-align:center;color:#777;font-size:9px}.empty-dot{width:32px;height:32px;border:3px solid #eee;border-top-color:#e6007e;border-radius:50%;animation:spin 1s linear infinite}',
    '.messages-reference.active .thread-a{animation:threadA 10s linear both}.messages-reference.active .thread-empty{animation:threadEmpty 10s linear both}.messages-reference.active .thread-b{animation:threadB 10s linear both}',
    '.motion-composer{position:absolute;left:0;right:0;bottom:0;height:43px;display:flex;align-items:center;gap:8px;padding:8px 10px;border-top:1px solid #e8e8eb;background:#fff;color:#929299;font-size:8px}.motion-composer span{flex:1;padding:7px;border-radius:99px;background:#f1f1f3}.motion-composer i{display:grid;place-items:center;width:27px;height:27px;border-radius:50%;background:#e6007e;color:#fff}.motion-composer svg{width:13px;fill:none;stroke:currentColor;stroke-width:1.7}',
    '.conversation-status{position:absolute;right:6%;bottom:7%;z-index:8;min-width:210px;height:39px;padding:0 13px 0 34px;border-radius:99px;background:rgba(25,25,28,.92);color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;overflow:hidden}.conversation-status>i{position:absolute;left:12px;width:8px;height:8px;border-radius:50%;background:#38b86a;box-shadow:0 0 0 5px rgba(56,184,106,.16)}.conversation-status span{position:absolute;left:34px;white-space:nowrap}.status-a{opacity:1}.status-b{opacity:0}.messages-reference.active .status-a{animation:statusA 10s linear both}.messages-reference.active .status-b{animation:statusB 10s linear both}',
    '.meeting-sequence-image,.summary-sequence-image{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:4;opacity:0;background:#f0efe8}',
    '.meeting-reference.active .meeting-live-image{animation:meetingLiveCycle 10s linear both}.meeting-reference.active .meeting-grid-image{animation:meetingGridCycle 10s linear both}',
    '.meeting-chat-demo{position:absolute;left:7%;top:14%;z-index:8;width:34%;height:66%;padding:13px;border-radius:14px;background:rgba(22,22,25,.97);color:#fff;box-shadow:0 20px 48px rgba(10,10,11,.32);opacity:0;transform:translateX(-18px)}.chat-demo-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:9px;border-bottom:1px solid #3a3a40;font-size:10px}.chat-demo-head span{color:#50ca7b;font-size:8px}.meeting-chat-demo p{margin:10px 0;padding:8px;border-radius:9px;background:#2a2a2f;font-size:8px;line-height:1.4;color:#d7d7db}.meeting-chat-demo p b{color:#fff}.meeting-chat-demo .poll-line{margin-top:15px;background:#fff;color:#333}.poll-line strong{display:block;margin-top:6px;color:#21864b}.meeting-reference.active .meeting-chat-demo{animation:meetingChatCycle 10s cubic-bezier(.2,.8,.2,1) both}',
    '.meeting-board-demo{position:absolute;inset:9% 5%;z-index:9;padding:15px;border-radius:18px;background:#fff;box-shadow:0 28px 62px rgba(10,10,11,.34);opacity:0;transform:translateY(22px) scale(.96)}.board-demo-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid #e8e8eb;font-size:11px}.board-demo-head span{font-size:8px;color:#777}.board-demo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:28px 20px}.board-demo-grid i{display:block;aspect-ratio:1.35;border-radius:8px;background:#e8e8eb;box-shadow:inset 0 0 0 1px #d4d4da}.board-demo-grid .pink{background:#fde1ef}.board-demo-grid .green{background:#def3e5}.board-demo-grid .purple{background:#e8e1f7}.board-pointer{position:absolute;padding:4px 7px;border-radius:6px;background:#1c1c1f;color:#fff;font-size:7px}.pointer-one{left:45%;top:44%}.pointer-two{right:21%;bottom:19%}.meeting-reference.active .meeting-board-demo{animation:meetingBoardCycle 10s cubic-bezier(.2,.8,.2,1) both}.meeting-reference.active .board-demo-grid i{animation:boardTile 10s linear both}.meeting-reference.active .board-demo-grid i:nth-child(3n){animation-delay:.12s}.meeting-reference.active .board-demo-grid i:nth-child(4n){animation-delay:.24s}',
    '.motion-reconstruction.meeting-reference.active .meeting-live{animation:meetingBadgeCycle 10s linear both}.motion-reconstruction.meeting-reference.active .participant-locations{animation:locationCycle 10s linear both}.motion-reconstruction.meeting-reference.active .speaker-orbit{animation:speakerCycle 10s ease-in-out both}',
    '.summary-reference.active .summary-human-context{animation:summaryHumanCycle 10s linear both}.summary-reference.active .summary-meeting-context{animation:summaryMeetingCycle 10s linear both}.motion-reconstruction.summary-reference.active .ai-summary-panel{animation:summaryPanelCycle 10s cubic-bezier(.2,.8,.2,1) both}',
    '@keyframes motionPhoneArrive{to{opacity:1;transform:none}}',
    '@keyframes threadA{0%,4%{opacity:0;transform:translateY(8px)}8%,34%{opacity:1;transform:none}39%,100%{opacity:0;transform:translateY(-8px)}}',
    '@keyframes threadEmpty{0%,37%{opacity:0}41%,50%{opacity:1}54%,100%{opacity:0}}',
    '@keyframes threadB{0%,51%{opacity:0;transform:translateY(9px)}57%,96%{opacity:1;transform:none}100%{opacity:0}}',
    '@keyframes statusA{0%,39%{opacity:1;transform:none}45%,100%{opacity:0;transform:translateY(-10px)}}',
    '@keyframes statusB{0%,51%{opacity:0;transform:translateY(10px)}57%,100%{opacity:1;transform:none}}',
    '@keyframes meetingLiveCycle{0%,3%{opacity:0;transform:scale(.97)}7%,34%{opacity:1;transform:none}40%,100%{opacity:0;transform:scale(1.02)}}',
    '@keyframes meetingChatCycle{0%,5%{opacity:0;transform:translateX(-18px)}10%,32%{opacity:1;transform:none}38%,100%{opacity:0;transform:translateX(-18px)}}',
    '@keyframes meetingBoardCycle{0%,35%{opacity:0;transform:translateY(22px) scale(.96)}41%,68%{opacity:1;transform:none}74%,100%{opacity:0;transform:translateY(-18px) scale(1.02)}}',
    '@keyframes meetingGridCycle{0%,70%{opacity:0;transform:scale(.97)}77%,96%{opacity:1;transform:none}100%{opacity:0}}',
    '@keyframes meetingBadgeCycle{0%,8%{opacity:0}12%,34%{opacity:1}40%,73%{opacity:0}78%,96%{opacity:1}100%{opacity:0}}',
    '@keyframes locationCycle{0%,72%{opacity:0}78%,96%{opacity:1}100%{opacity:0}}',
    '@keyframes speakerCycle{0%,75%{opacity:0;transform:scale(.95)}80%,92%{opacity:1;transform:scale(1.02)}97%,100%{opacity:0}}',
    '@keyframes boardTile{0%,41%{transform:scale(.8);opacity:.25}48%,68%{transform:none;opacity:1}74%,100%{opacity:0}}',
    '@keyframes summaryPanelCycle{0%,4%{opacity:0;transform:translateY(16px) scale(.985)}9%,32%{opacity:1;transform:none}38%,79%{opacity:0;transform:translateY(-14px) scale(1.015)}85%,96%{opacity:1;transform:none}100%{opacity:0}}',
    '@keyframes summaryHumanCycle{0%,35%{opacity:0;transform:scale(1.02)}42%,50%{opacity:1;transform:none}55%,100%{opacity:0;transform:scale(1.02)}}',
    '@keyframes summaryMeetingCycle{0%,52%{opacity:0;transform:scale(.97)}59%,80%{opacity:1;transform:none}86%,100%{opacity:0;transform:scale(1.02)}}',
    '@keyframes spin{to{transform:rotate(360deg)}}',
    '@keyframes caniCtaSweep{0%{transform:translateX(-230%) rotate(17deg)}100%{transform:translateX(650%) rotate(17deg)}}',
    '@media (max-width:1180px){.showcase{grid-template-columns:1fr;gap:18px;min-height:0;padding-top:58px}.copy{align-items:center;text-align:center}.intro,.feature-panel p{max-width:650px}.feature-card,.feature-nav,.under-nav{max-width:690px}.feature-panel{text-align:left}.stage{width:100%;}.stage-shell{width:min(100%,760px)}.actions,.proof{justify-content:center}}',
    '@media (max-width:880px){.feature-nav .feature-tab{min-height:44px;}.under-nav .motion-toggle,.motion-toggle{min-height:44px;}}@media (max-width:767px){.showcase{padding:44px 22px 52px}.eyebrow{font-size:10.5px}h2{font-size:clamp(34px,10vw,46px);max-width:560px}.intro{font-size:15px}.feature-card{min-height:240px;margin-top:28px}.feature-panel{padding:25px 23px}.feature-panel h3{font-size:18.5px}.feature-nav{grid-template-columns:repeat(2,1fr)}.feature-tab{min-height:44px;font-size:11.5px}.actions{width:100%;flex-direction:column;gap:8px}.cta{width:100%;min-height:48px}.proof{font-size:12px}.stage-shell{aspect-ratio:.92/1}.scene{inset:2%}.desktop-device{left:1%;top:30%;width:66%;height:45%}.phone-device{right:0;top:8%;width:35%;height:63%}.tablet-device{right:4%;bottom:3%;width:50%}.app-window{inset:10% 0}.call-grid{grid-template-columns:1fr}.call-profile{display:none}.call-content{padding:19px}.message-card{width:58%}.msg-london{left:0}.msg-newyork{right:0}.msg-sydney{left:8%}.timezone-strip{display:none}.chat-window{inset:7% 0}.chat-history{padding:24px 18px 10px}.file-delivery{margin-inline:18px}.composer{left:18px;right:18px}.phone-chat{left:17%;width:66%}.meeting-window{inset:6% 0}.video-grid{grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(3,1fr)}.summary-window{inset:6% 0;padding:17px}.summary-columns{grid-template-columns:1fr;gap:12px}.summary-copy{display:none}.board-window{inset:4% 0}.board-tools{transform:scale(.85);transform-origin:left top}.mini-stat,.delivery-toast,.reply-status,.meeting-clock,.ai-toast,.board-toast{transform:scale(.88);transform-origin:right bottom}}',
    '@media (max-width:420px){.showcase{padding-inline:16px}h2{font-size:34px}.feature-card{min-height:258px}.feature-kicker span{width:36px;height:36px}.stage-shell{width:112%;margin-inline:-6%;}.desktop-device{width:70%}.phone-device{width:37%}.message-card{width:64%}.summary-head{gap:8px}.summary-head h4{font-size:13px}.action-list label{padding:7px}.board-tools{left:8px}.under-nav{align-items:flex-start}.state-count{padding-top:9px}}',
    '@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.progress-bar{width:100%!important}}',
    ':host([motion="reduced"]) *{animation:none!important;transition:none!important}',
    ':host([motion="reduced"]) .progress-bar{width:100%!important}',
    '@media (max-width:767px){.reference-frame{border-radius:20px}.reference-label{left:10px;bottom:10px;font-size:8px}.incoming-card{right:3%;bottom:4%;min-width:180px;padding:9px}.ring-set{width:120px;height:120px}.live-transcript{left:4%;bottom:19%;width:62%;padding:10px}.recording-strip{left:4%;right:4%;bottom:5%;padding:8px}.geo-message{padding:7px;font-size:7px}.geo-message b{font-size:8px}.file-share-card{left:5%;width:80%;padding:12px}.response-thread{right:4%;top:16%;width:76%;padding:12px}.ai-summary-panel{inset:7% 4%;padding:14px}.ai-heading b{font-size:11px}.ai-summary-panel>p{font-size:9px;margin:10px 0}.ai-actions label{padding:6px;font-size:8px}.whiteboard-panel{inset:5% 2%}.participant-locations{bottom:5%;gap:3px}.participant-locations span{padding:4px 6px;font-size:7px}.motion-phone{left:3%;top:8%;width:38%;height:78%;border-width:3px;border-radius:17px}.motion-thread p{font-size:6.5px;padding:6px}.conversation-status{right:3%;bottom:5%;min-width:170px}.meeting-chat-demo{left:3%;top:13%;width:43%;padding:9px}.meeting-board-demo{inset:7% 2%;padding:10px}.board-demo-grid{gap:5px;padding:20px 8px}.summary-sequence-image{object-fit:cover}}',
    '@media (prefers-reduced-motion:reduce){.motion-thread.thread-a,.meeting-live-image,.meeting-chat-demo,.ai-summary-panel{opacity:1!important;transform:none!important}.thread-empty,.thread-b,.meeting-grid-image,.meeting-board-demo,.summary-sequence-image{opacity:0!important}.status-a{opacity:1!important}.status-b{opacity:0!important}}',
    ':host([motion="reduced"]) .motion-thread.thread-a,:host([motion="reduced"]) .meeting-live-image,:host([motion="reduced"]) .meeting-chat-demo,:host([motion="reduced"]) .ai-summary-panel{opacity:1!important;transform:none!important}',
    ':host([motion="reduced"]) .thread-empty,:host([motion="reduced"]) .thread-b,:host([motion="reduced"]) .meeting-grid-image,:host([motion="reduced"]) .meeting-board-demo,:host([motion="reduced"]) .summary-sequence-image{opacity:0!important}',
    '[data-root]{--accent:#e6007e;--accent-ink:#cf0072;font-family:\"Instrument Sans\", -apple-system, system-ui, sans-serif;}.stage{font-family:\"Helvetica Neue\", Arial, sans-serif;}',
    '[data-root]{--rv-ease:cubic-bezier(0.22,1,0.36,1);--rv-ease-soft:cubic-bezier(0.22,1,0.36,1);--rv-copy:700ms;--rv-stage:850ms;--rv-travel:26px;--rv-travel-stage:20px;}:host([data-rv=\'armed\']) [data-rvg]{opacity:0;transition:none!important;}:host([data-rv=\'armed\']) [data-rvg=\'copy\']{transform:translateY(var(--rv-travel));}:host([data-rv=\'armed\']) [data-rvg=\'stage\']{transform:translateY(var(--rv-travel-stage)) scale(.988);}:host([data-rv=\'revealing\']) [data-rvg],:host([data-rv=\'revealed\']) [data-rvg]{opacity:1;transform:none;}:host([data-rv=\'revealing\']) [data-rvg=\'copy\']{transition:opacity var(--rv-copy) var(--rv-ease) var(--rv-d),transform var(--rv-copy) var(--rv-ease) var(--rv-d);}:host([data-rv=\'revealing\']) [data-rvg=\'stage\']{transition:opacity var(--rv-stage) var(--rv-ease) var(--rv-d),transform var(--rv-stage) var(--rv-ease) var(--rv-d);}.copy h2{font-weight:600;}[data-rvg=\'copy\']{min-width:0;align-self:stretch;width:100%;}[data-rvg=\'stage\']{min-width:0;}@media (max-width:767px){[data-root]{--rv-copy:560ms;--rv-stage:680ms;--rv-travel:20px;--rv-travel-stage:14px;}}@media(prefers-reduced-motion:reduce){:host([data-rv]) [data-rvg]{opacity:1!important;transform:none!important;transition:none!important;}}',
    '.showcase{grid-template-columns:minmax(430px,.9fr) minmax(620px,1.24fr);gap:clamp(48px,5.2vw,92px);max-width:1540px;min-height:min(900px,96vh);padding-block:68px;}',
    '.eyebrow{font-size:11px;letter-spacing:.16em;color:#5c5b59}.eyebrow i{width:4px;height:4px;background:var(--accent)}',
    'h2{max-width:650px;margin-top:0;font-size:clamp(48px,3.85vw,62px);line-height:1.01;font-weight:500;letter-spacing:-.042em}h2 span{color:#929195}',
    '.intro{max-width:565px;margin-top:26px;font-size:16.5px;line-height:1.58;color:#57565b}',
    '.feature-card{max-width:570px;min-height:204px;margin-top:36px;border-color:#dedddb;border-radius:12px;box-shadow:0 1px 1px rgba(20,20,20,.04),0 15px 34px -30px rgba(20,20,20,.48)}',
    '.feature-panel{padding:27px 29px}.feature-panel h3{font-size:21px;line-height:1.18;font-weight:500;letter-spacing:-.026em}.feature-panel p{font-size:14px;line-height:1.52;color:#66656a}.feature-kicker{font-size:10.5px;letter-spacing:.135em}.feature-kicker span{width:38px;height:38px;background:#f0efed}',
    '.feature-nav{max-width:570px;margin-top:12px;padding:0;border:1px solid #dedddb;border-radius:2px;background:#fff;gap:0;overflow:hidden}.feature-tab{position:relative;min-height:43px;border-radius:0;background:#fff;border-right:1px solid #ecebea;color:#5c5b60;font-size:10.5px}.feature-tab:nth-child(4n){border-right:0}.feature-tab:nth-child(-n+4){border-bottom:1px solid #ecebea}.feature-tab[aria-selected="true"]{background:#f5f4f1;color:#151517;box-shadow:none}.feature-tab[aria-selected="true"]::after{content:"";position:absolute;left:20%;right:20%;bottom:-1px;height:2px;background:var(--accent)}',
    '.motion-toggle{border-radius:2px;border-color:#d9d8d5;background:#fff}.cta{border-radius:3px}.cta.primary{position:relative;isolation:isolate;overflow:hidden;background:#e6007e;color:#fff;box-shadow:0 13px 30px -13px rgba(230,0,126,.55);transition:transform .28s cubic-bezier(.16,1,.3,1),box-shadow .28s ease,background-color .28s ease}.cta.primary span{position:relative;z-index:2}.cta.primary::after{content:"";position:absolute;z-index:1;top:-70%;bottom:-70%;left:-24%;width:24%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.52),rgba(255,255,255,0));transform:translateX(-230%) rotate(17deg);pointer-events:none}.cta.primary:hover,.cta.primary:focus-visible{background:#cf0072;box-shadow:0 18px 38px -12px rgba(230,0,126,.48),0 0 0 5px rgba(230,0,126,.10);transform:translateY(-3px) scale(1.015)}.cta.primary:hover::after,.cta.primary:focus-visible::after{animation:caniCtaSweep .72s cubic-bezier(.2,.8,.2,1) both}.cta.secondary{color:#252527}.proof strong{color:var(--accent)}',
    '.stage-shell{width:min(100%,780px);aspect-ratio:1.52/1}.stage-rings,.stage-glow{display:none}',
    '.reference-frame{border-radius:0;background:#fff;box-shadow:none;overflow:visible}.reference-wash{background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.025))}.reference-label{display:none}',
    '.reference-image,.message-reference .reference-image,.meeting-grid-reference .reference-image,.transcript-reference .reference-image{object-fit:contain;filter:none}',
    '.ring-set i{border-width:2px;border-color:rgba(200,32,63,.34)}.incoming-card{border:1px solid #d9d8d5;border-radius:5px;box-shadow:0 16px 30px rgba(16,16,17,.14)}.caller-avatar{background:#f4e8e8;color:#a71531}.answer-pulse{background:#36975c}',
    '.recording-strip{border-radius:3px;background:#252527;box-shadow:0 13px 28px rgba(10,10,11,.2)}.recording-strip .waveform i{background:#c8203f}.live-transcript{border:1px solid #d8d8d5;border-radius:3px;box-shadow:0 14px 32px rgba(20,20,20,.16)}.live-transcript span{color:#c8203f}',
    '.motion-phone{left:8%;top:6%;width:27%;height:84%;border:3px solid #3a3a3d;border-radius:17px;box-shadow:0 16px 34px rgba(20,20,20,.2)}.motion-phone-head{height:52px;padding:9px 10px}.mini-avatar{background:#eeeae7;color:#333}.motion-thread{top:52px;padding:11px 9px}.motion-thread p{border-radius:4px;font-size:7.6px}.incoming-bubble{background:#f0efed}.outgoing-bubble{background:#fff;color:#232326;border-left:2px solid #c8203f;box-shadow:0 0 0 1px #deddda}.outgoing-bubble small{color:#1559a7}.motion-composer i{background:#c8203f}.conversation-status{right:7%;bottom:6%;border-radius:3px;background:#2c2c2e;box-shadow:0 10px 24px rgba(20,20,20,.18)}',
    '.file-reference .reference-image,.response-reference-frame .reference-image{filter:saturate(.88) brightness(.92)}.file-share-card,.response-thread{border:1px solid #d8d8d5;border-radius:4px;box-shadow:0 16px 34px rgba(15,15,16,.18)}.file-type{border-radius:3px;background:#f1e8e9;color:#a71531}.file-progress i{background:#c8203f}.delivery-confirm{border-radius:3px;background:#2c2c2e}.sent-line{border-radius:4px;background:#c8203f}.typing-line-v2{border-radius:4px;background:#f2efed}.typing-line-v2 i{background:#c8203f}',
    '.meeting-sequence-image,.summary-sequence-image{background:#fff}.meeting-chat-demo{left:7%;top:12%;width:30%;height:70%;border:1px solid #444;border-radius:2px;box-shadow:0 17px 34px rgba(10,10,10,.24)}.meeting-board-demo{inset:6% 4%;border:1px solid #cfcfcd;border-radius:3px;box-shadow:0 18px 38px rgba(15,15,16,.22)}.board-demo-grid{grid-template-columns:70px repeat(4,1fr);gap:5px;padding:24px 16px}.board-demo-grid::before{content:"Base training";display:grid;place-items:center;font-size:8px;font-weight:700;color:#444}.board-demo-grid i{border-radius:2px;aspect-ratio:1.65}.board-pointer{border-radius:2px}.meeting-live,.participant-locations span{border-radius:2px}.speaker-orbit{border-width:2px;border-color:#c8203f;box-shadow:0 0 0 4px rgba(200,32,63,.12)}',
    '.summary-reference-frame .reference-image,.board-reference-frame .reference-image{filter:saturate(.78) brightness(.82)}.summary-reference-frame .reference-wash,.board-reference-frame .reference-wash{background:rgba(238,236,228,.23)}.ai-summary-panel{inset:8% 7%;border:1px solid #cececb;border-radius:3px;box-shadow:0 18px 38px rgba(15,15,16,.22)}.ai-heading>span{border-radius:3px;background:#f1e8e9;color:#a71531}.ai-heading em{border-radius:2px}.ai-actions label{border-radius:2px;background:#f1f0ed}.whiteboard-panel{inset:6% 4%;border:1px solid #cececb;border-radius:3px;box-shadow:0 18px 38px rgba(15,15,16,.22)}.whiteboard-panel rect{rx:3}.whiteboard-panel rect:nth-of-type(2){fill:#f4e8e8;stroke:#c8203f}.whiteboard-panel path{stroke:#c8203f}',
    '@media (max-width:1180px){.showcase{grid-template-columns:1fr}.stage-shell{width:min(100%,780px);aspect-ratio:1.52/1}.feature-nav{max-width:690px}.feature-card{max-width:690px}}',
    '@media (max-width:767px){h2{font-size:clamp(35px,10vw,46px);line-height:1}.stage-shell{width:112%;aspect-ratio:.92/1}.reference-frame{overflow:hidden}.motion-phone{left:3%;top:8%;width:38%;height:78%;border-radius:15px}.feature-card{border-radius:8px}.feature-nav{border-radius:2px}.feature-tab{min-height:44px;font-size:10.5px}.motion-toggle{min-height:44px}.meeting-board-demo{inset:7% 2%}.board-demo-grid{grid-template-columns:40px repeat(3,1fr);padding:18px 8px}.board-demo-grid i:nth-last-child(-n+3){display:none}.conversation-status{right:3%}}',
    '',
    '/* ---- V5 polish: staging, depth and the owned globe ---- */',
    '.stage-shell::before{content:"";position:absolute;inset:-2% -3% -4%;border-radius:34px;background:linear-gradient(160deg,#fbfbfc 0%,#f4f4f7 46%,#eeeef2 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 26px 70px -34px rgba(16,16,22,.30);z-index:0;}',
    '.stage-shell::after{content:"";position:absolute;inset:-2% -3% -4%;border-radius:34px;z-index:0;pointer-events:none;background:linear-gradient(rgba(16,16,22,.028) 1px,transparent 1px),linear-gradient(90deg,rgba(16,16,22,.028) 1px,transparent 1px);background-size:34px 34px;-webkit-mask-image:radial-gradient(ellipse at 50% 42%,#000 30%,transparent 78%);mask-image:radial-gradient(ellipse at 50% 42%,#000 30%,transparent 78%);}',
    '.stage-shell{--elev-1:0 2px 6px -2px rgba(16,16,22,.10);--elev-2:0 12px 30px -12px rgba(16,16,22,.20);--elev-3:0 34px 68px -30px rgba(16,16,22,.34);}',
    '.stage{position:relative;}',
    '.stage::before{content:"";position:absolute;width:56%;aspect-ratio:1;left:50%;top:46%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(230,0,126,.13),rgba(230,0,126,0) 66%);filter:blur(14px);pointer-events:none;z-index:0;}',
    '.app-window,.chat-window,.meeting-window,.summary-window,.board-window,.phone-chat,.device{box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 18px 44px -20px rgba(16,16,22,.34),0 4px 12px -6px rgba(16,16,22,.16);}',
    '.mini-stat,.delivery-toast,.reply-status,.meeting-clock,.ai-toast,.board-toast{box-shadow:0 16px 36px -16px rgba(16,16,22,.36),0 2px 6px -2px rgba(16,16,22,.14);}',
    '.world-map{position:absolute;inset:5%;border-radius:26px;background:none;overflow:visible;}',
    '.world-map::before{display:none;}',
    '.globe{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}',
    '.globe .globe-face{fill:#f2f2f6;}',
    '.globe .globe-rim{fill:none;stroke:rgba(16,16,22,.16);stroke-width:1.2;}',
    '.globe .grat{fill:none;stroke:rgba(16,16,22,.11);stroke-width:1;}',
    '.globe .arc{fill:none;stroke:#e6007e;stroke-width:2.2;stroke-linecap:round;stroke-dasharray:var(--len,320);stroke-dashoffset:var(--len,320);opacity:.9;}',
    '.globe .node circle{fill:#e6007e;stroke:#fff;stroke-width:3;opacity:0;transform-box:fill-box;transform-origin:center;}',
    '.messages-scene.active .globe .arc{animation:arcDraw .9s cubic-bezier(.32,.72,0,1) forwards;}',
    '.messages-scene.active .globe .arc-1{animation-delay:.10s}',
    '.messages-scene.active .globe .arc-2{animation-delay:.42s}',
    '.messages-scene.active .globe .arc-3{animation-delay:.74s}',
    '.messages-scene.active .globe .node circle{animation:nodeLand .5s cubic-bezier(.2,1.5,.4,1) forwards;}',
    '.messages-scene.active .globe .node-ny circle{animation-delay:.16s}',
    '.messages-scene.active .globe .node-ldn circle{animation-delay:.48s}',
    '.messages-scene.active .globe .node-syd circle{animation-delay:.80s}',
    '@keyframes arcDraw{to{stroke-dashoffset:0}}',
    '@keyframes nodeLand{0%{opacity:0;transform:scale(.2)}100%{opacity:1;transform:scale(1)}}',
    '.board-tools{top:auto;bottom:14px;left:50%;transform:translateX(-50%);flex-direction:row;background:rgba(255,255,255,.94);backdrop-filter:blur(6px);border-radius:999px;padding:6px 10px;box-shadow:0 10px 26px -12px rgba(16,16,22,.34);}',
    '.summary-columns{align-items:start;}',
    '.summary-copy .meta-row{margin-top:14px;}',
    '@media (prefers-reduced-motion:reduce){.messages-scene .globe .arc{stroke-dashoffset:0;animation:none!important}.messages-scene .globe .node circle{opacity:1;animation:none!important}}',
    '',
    '/* ---- V6: layered-window motion, after the Smarter Collaboration timing ---- */',
    '.beat{position:absolute;z-index:6;opacity:0;pointer-events:none;background:rgba(255,255,255,.97);backdrop-filter:blur(8px);border:1px solid rgba(16,16,22,.09);border-radius:14px;padding:13px 15px;box-shadow:0 26px 60px -24px rgba(16,16,22,.46),0 4px 12px -6px rgba(16,16,22,.18);transform:translate3d(0,14px,0) scale(.975);}',
    '.beat-head{display:flex;align-items:center;gap:8px;margin-bottom:9px;}',
    '.beat-head b{font-size:11.5px;font-weight:700;letter-spacing:-.01em;color:#0a0a0b;}',
    '.beat-live{margin-left:auto;display:inline-flex;align-items:center;gap:5px;font-size:9px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#66666d;}',
    '.beat-live i{width:5px;height:5px;border-radius:50%;background:#e6007e;}',
    '.beat-line{margin:0 0 7px;font-size:10.5px;line-height:1.5;color:#3a3a41;opacity:0;transform:translate3d(0,5px,0);}',
    '.beat-line b{color:#0a0a0b;font-weight:700;margin-right:4px;}',
    '.beat-line:last-child{margin-bottom:0;}',
    '.scene.active .beat-chat,.scene.active .beat-recap{animation:beatIn .62s cubic-bezier(.2,.8,.2,1) .55s forwards;}',
    '.scene.active .beat-chat .beat-line,.scene.active .beat-recap .beat-line{animation:lineIn .44s cubic-bezier(.2,.8,.2,1) forwards;}',
    '.scene.active .beat-chat .bl-1,.scene.active .beat-recap .bl-1{animation-delay:1.05s}',
    '.scene.active .beat-chat .bl-2,.scene.active .beat-recap .bl-2{animation-delay:1.55s}',
    '.scene.active .beat-chat .bl-3,.scene.active .beat-recap .bl-3{animation-delay:2.05s}',
    '.meeting-scene.active .beat-chat{animation:beatIn .62s cubic-bezier(.2,.8,.2,1) .55s forwards,beatOut .8s cubic-bezier(.4,0,.5,1) 5.4s forwards;}',
    '.meeting-scene.active .beat-poll{animation:beatIn .8s cubic-bezier(.2,.8,.2,1) 5.7s forwards;}',
    '.meeting-scene.active .beat-poll .poll-bar i{animation:pollFill 1.1s cubic-bezier(.3,.9,.3,1) 6.5s forwards;}',
    '@keyframes beatIn{to{opacity:1;transform:translate3d(0,0,0) scale(1)}}',
    '@keyframes beatOut{to{opacity:0;transform:translate3d(0,-10px,0) scale(.985)}}',
    '@keyframes lineIn{to{opacity:1;transform:translate3d(0,0,0)}}',
    '@keyframes pollFill{from{width:0}to{width:100%}}',
    '.beat-chat,.beat-poll{right:-4%;bottom:-6%;width:39%;}',
    '.beat-recap{right:-4%;bottom:-7%;width:44%;}',
    '.poll-q{margin:0 0 8px;font-size:10.5px;color:#3a3a41;}',
    '.poll-bar{height:6px;border-radius:999px;background:rgba(16,16,22,.09);overflow:hidden;}',
    '.poll-bar i{display:block;height:100%;width:0;border-radius:999px;background:#e6007e;}',
    '.poll-r{margin:8px 0 0;font-size:10px;color:#66666d;}',
    '.poll-r strong{color:#0a0a0b;}',
    '@media (max-width:767px){.beat-chat,.beat-poll,.beat-recap{position:relative;right:auto;bottom:auto;width:100%;margin-top:10px;}.meeting-scene.active .beat-chat{animation:beatIn .5s .4s forwards;}.meeting-scene.active .beat-poll{display:none;}}',
    '@media (prefers-reduced-motion:reduce){.meeting-scene.active .meeting-window,.summary-scene.active .summary-window{animation:none!important}.beat{opacity:1!important;transform:none!important;animation:none!important}.beat-chat{display:none!important}.beat-line{opacity:1!important;transform:none!important;animation:none!important}.poll-bar i{width:100%!important;animation:none!important}}',
    '',
    '/* ---- V7: the messaging demonstration ---- */',
    '.msg-phone{position:absolute;right:4%;top:50%;width:32%;max-width:236px;transform:translateY(-50%);z-index:5;display:flex;flex-direction:column;overflow:hidden;aspect-ratio:9/18.6;background:#fff;border:3px solid #17171c;border-radius:26px;box-shadow:0 40px 80px -30px rgba(16,16,22,.5),0 8px 20px -10px rgba(16,16,22,.24);}',
    '.msg-bar{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:5px 12px 2px;font-size:8px;font-weight:700;color:#0a0a0b;}',
    '.msg-sig{display:inline-flex;align-items:flex-end;gap:1.5px;}',
    '.msg-sig i{width:2px;background:#0a0a0b;border-radius:1px;}',
    '.msg-sig i:nth-child(1){height:3px}.msg-sig i:nth-child(2){height:5px}.msg-sig i:nth-child(3){height:7px}',
    '.msg-head{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:4px 9px 7px;border-bottom:1px solid rgba(16,16,22,.08);}',
    '.msg-back{font-size:13px;color:#66666d;line-height:1;}',
    '.msg-av{width:19px;height:19px;border-radius:50%;background:#e6007e;color:#fff;font-size:7.5px;font-weight:700;display:grid;place-items:center;flex:0 0 auto;}',
    '.msg-who{min-width:0;line-height:1.15;}',
    '.msg-who b{display:block;font-size:9px;font-weight:700;color:#0a0a0b;}',
    '.msg-who small{display:block;font-size:7px;color:#8a8a92;}',
    '.msg-tools{margin-left:auto;display:inline-flex;gap:4px;}',
    '.msg-tools i{width:9px;height:9px;border-radius:2px;border:1.2px solid #b6b6bd;}',
    '.msg-thread{flex:1 1 auto;min-height:0;padding:7px 8px 4px;display:flex;flex-direction:column;justify-content:flex-end;gap:5px;overflow:hidden;}',
    '.msg-day{align-self:center;font-size:6.5px;color:#a6a6ad;letter-spacing:.06em;text-transform:uppercase;margin-bottom:1px;}',
    '.msg-item{opacity:0;transform:translate3d(0,9px,0);}',
    '.msg-quote{border-left:2px solid #e6007e;padding:3px 0 3px 6px;}',
    '.msg-quote small{display:block;font-size:6.5px;font-weight:700;color:#e6007e;letter-spacing:.04em;text-transform:uppercase;margin-bottom:1px;}',
    '.msg-quote p{margin:0;font-size:7.5px;line-height:1.35;color:#8a8a92;}',
    '.msg-in,.msg-out{margin:0;font-size:7.8px;line-height:1.4;padding:6px 8px;border-radius:11px;max-width:88%;position:relative;}',
    '.msg-in{background:#f1f1f4;color:#2c2c33;border-bottom-left-radius:3px;align-self:flex-start;}',
    '.msg-out{background:#fce4f1;color:#2c2c33;border-bottom-right-radius:3px;align-self:flex-end;}',
    '.msg-item:has(.msg-out){align-self:flex-end;max-width:88%;}',
    '.msg-in b,.msg-out b{color:#e6007e;font-weight:700;}',
    '.msg-in em,.msg-out em{display:block;margin-top:3px;font-style:normal;font-size:6.2px;color:#9a9aa2;}',
    '.msg-composer{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:6px 9px 9px;border-top:1px solid rgba(16,16,22,.08);}',
    '.msg-composer span{flex:1 1 auto;font-size:7.5px;color:#a6a6ad;background:#f4f4f6;border-radius:999px;padding:4px 8px;}',
    '.msg-send{width:15px;height:15px;border-radius:50%;background:#e6007e;color:#fff;font-size:7px;font-style:normal;display:grid;place-items:center;flex:0 0 auto;}',
    '.messages-scene.active .msg-item{animation:msgIn .5s cubic-bezier(.2,.9,.3,1) forwards;}',
    '.messages-scene.active .mi-1{animation-delay:.75s}',
    '.messages-scene.active .mi-2{animation-delay:1.50s}',
    '.messages-scene.active .mi-3{animation-delay:2.35s}',
    '.messages-scene.active .mi-4{animation-delay:3.25s}',
    '.messages-scene.active .mi-5{animation-delay:4.25s}',
    '.messages-scene.active .msg-thread{animation:msgScroll 10s cubic-bezier(.4,0,.4,1) both;}',
    '@keyframes msgIn{to{opacity:1;transform:translate3d(0,0,0)}}',
    '@keyframes msgScroll{0%,32%{transform:translate3d(0,0,0)}58%{transform:translate3d(0,-6px,0)}100%{transform:translate3d(0,-13px,0)}}',
    '.messages-scene .world-map{inset:5% 34% 5% 2%;}',
    '.messages-scene .globe{opacity:.85;}',
    '.messages-scene .timezone-strip{left:0;right:38%;width:auto;z-index:4;}',
    '@media (max-width:1180px){.msg-phone{right:6%;width:36%;max-width:210px}.messages-scene .world-map{inset:6% 40% 6% 2%}}',
    '@media (max-width:767px){.msg-phone{position:relative;right:auto;top:auto;transform:none;width:63%;max-width:200px;margin:0 auto;}.messages-scene .world-map{display:none}.messages-scene{display:flex;align-items:center;justify-content:center}}',
    '@media (prefers-reduced-motion:reduce){.messages-scene .msg-item{opacity:1!important;transform:none!important;animation:none!important}.messages-scene.active .msg-thread{animation:none!important;transform:none!important}}',
    '',
    '/* ---- V8: softphone + mobile app calling ---- */',
    '.incoming-scene{position:absolute;inset:4%;}',
    '.sp-window{position:absolute;left:8%;right:0;top:50%;transform:translateY(-50%);height:78%;background:#fff;border:1px solid rgba(16,16,22,.10);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;z-index:3;}',
    '.sp-head-tools{margin-left:auto;display:inline-flex;gap:5px;}',
    '.sp-head-tools i{width:8px;height:8px;border-radius:2px;border:1.2px solid #c4c4cb;}',
    '.sp-body{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:41% 1fr;}',
    '.sp-list{border-right:1px solid rgba(16,16,22,.08);padding:8px 9px;overflow:hidden;display:flex;flex-direction:column;gap:5px;background:#fcfcfd;}',
    '.sp-tabs{display:flex;gap:11px;font-size:8.5px;color:#8a8a92;}',
    '.sp-tabs b{color:#0a0a0b;font-weight:700;border-bottom:2px solid #e6007e;padding-bottom:2px;}',
    '.sp-search{font-size:8px;color:#a6a6ad;background:#f2f2f5;border-radius:5px;padding:4px 7px;}',
    '.sp-sect{font-size:7px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#a6a6ad;margin-top:2px;}',
    '.sp-row{display:flex;align-items:center;gap:6px;}',
    '.sp-av{width:17px;height:17px;border-radius:50%;background:#ececf0;color:#5a5a62;font-size:6.8px;font-weight:700;display:grid;place-items:center;flex:0 0 auto;}',
    '.sp-av-on{background:#e6007e;color:#fff;}',
    '.sp-row-t{min-width:0;line-height:1.2;}',
    '.sp-row-t b{display:block;font-size:8.2px;font-weight:600;color:#0a0a0b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
    '.sp-row-t small{display:block;font-size:6.8px;color:#a6a6ad;}',
    '.sp-row em{margin-left:auto;font-style:normal;font-size:6.8px;color:#b6b6bd;flex:0 0 auto;}',
    '.sp-row-live{background:#fff;border:1px solid rgba(230,0,126,.22);border-radius:7px;padding:5px 6px;}',
    '.sp-drop{margin-left:auto;width:0;height:0;border-left:3px solid transparent;border-right:3px solid transparent;border-top:4px solid #c4c4cb;}',
    '.sp-panel{position:relative;display:grid;place-items:center;background:#f7f7f5;padding:10px;}',
    '.sp-panel-title{position:absolute;top:9px;left:50%;transform:translateX(-50%);font-size:8.5px;font-weight:600;color:#5a5a62;}',
    '.sp-card{position:absolute;width:min(78%,150px);background:#fff;border:1px solid rgba(16,16,22,.09);border-radius:10px;padding:10px 11px;display:flex;flex-direction:column;align-items:center;box-shadow:0 12px 28px -14px rgba(16,16,22,.3);}',
    '.sp-num{font-size:8.5px;color:#0a0a0b;background:#f4f4f6;border-radius:5px;padding:4px 8px;width:100%;text-align:center;margin-bottom:8px;}',
    '.sp-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:5px 4px;width:100%;margin-bottom:9px;}',
    '.sp-pad i{font-style:normal;font-size:9.5px;font-weight:600;color:#2c2c33;text-align:center;padding:2px 0;}',
    '.sp-call{width:100%;border:0;border-radius:5px;background:#e6007e;color:#fff;font-size:8px;font-weight:700;padding:5px 0;}',
    '.sp-av-lg{width:30px;height:30px;font-size:9.5px;margin-bottom:5px;}',
    '.sp-live b{font-size:9px;font-weight:700;color:#0a0a0b;}',
    '.sp-timer{font-size:7.5px;color:#8a8a92;margin-bottom:8px;}',
    '.sp-ctrls{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 4px;width:100%;margin-bottom:9px;}',
    '.sp-ctrls span{font-size:6.4px;color:#8a8a92;text-align:center;padding-top:12px;position:relative;}',
    '.sp-ctrls span::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:11px;height:11px;border-radius:50%;border:1.2px solid #c4c4cb;}',
    '.sp-end{width:100%;border:0;border-radius:5px;background:#d92c3c;color:#fff;font-size:8px;font-weight:700;padding:5px 0;}',
    '.sp-mobile{position:absolute;left:0;top:50%;width:23%;max-width:158px;aspect-ratio:9/18.4;transform:translate(-46%,-50%);opacity:0;z-index:6;background:#fff;border:3px solid #17171c;border-radius:22px;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:0 8px 9px;box-shadow:0 44px 84px -30px rgba(16,16,22,.56),0 8px 18px -8px rgba(16,16,22,.26);}',
    '.sp-m-bar{align-self:stretch;display:flex;align-items:center;justify-content:space-between;padding:4px 2px 2px;font-size:7px;font-weight:700;color:#0a0a0b;}',
    '.sp-m-notch{width:34%;height:9px;border-radius:999px;background:#17171c;}',
    '.sp-m-sig{display:inline-flex;align-items:flex-end;gap:1.2px;}',
    '.sp-m-sig i{width:1.8px;background:#0a0a0b;border-radius:1px;}',
    '.sp-m-sig i:nth-child(1){height:3px}.sp-m-sig i:nth-child(2){height:5px}.sp-m-sig i:nth-child(3){height:6.5px}',
    '.sp-m-head{align-self:stretch;display:flex;align-items:center;gap:5px;padding:2px 0 7px;font-size:7.5px;color:#66666d;}',
    '.sp-m-head b{font-size:7.5px;font-weight:600;color:#0a0a0b;}',
    '.sp-m-dot{margin-left:auto;width:6px;height:6px;border-radius:50%;background:#4fc36b;}',
    '.sp-m-num{font-size:9.5px;font-weight:600;color:#0a0a0b;text-align:center;line-height:1.25;}',
    '.sp-m-num small{display:block;font-size:6.8px;font-weight:400;color:#a6a6ad;}',
    '.sp-m-av{width:40px;height:40px;font-size:12px;margin:8px 0 4px;background:#e6007e;color:#fff;}',
    '.sp-m-timer{font-size:7.2px;color:#8a8a92;margin-bottom:9px;}',
    '.sp-m-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px 4px;width:100%;margin-bottom:10px;}',
    '.sp-m-grid span{font-size:6px;color:#8a8a92;text-align:center;padding-top:13px;position:relative;}',
    '.sp-m-grid span::before{content:"";position:absolute;top:0;left:50%;transform:translateX(-50%);width:12px;height:12px;border-radius:50%;border:1.2px solid #c4c4cb;}',
    '.sp-m-end{margin-top:auto;width:26px;height:26px;border-radius:50%;background:#d92c3c;flex:0 0 auto;}',
    '.incoming-scene.active .sp-dial{animation:spDialOut .7s cubic-bezier(.4,0,.5,1) 2.1s forwards,spDialIn .7s cubic-bezier(.2,.8,.2,1) 8.5s forwards;}',
    '.incoming-scene.active .sp-live{opacity:0;transform:scale(.97);animation:spLiveIn .7s cubic-bezier(.2,.8,.2,1) 2.35s forwards,spLiveOut .6s cubic-bezier(.4,0,.5,1) 8.4s forwards;}',
    '.incoming-scene.active .sp-mobile{animation:spPhoneIn .75s cubic-bezier(.2,.85,.25,1) 3.4s forwards,spPhoneOut .6s cubic-bezier(.4,0,.6,1) 7.7s forwards;}',
    '@keyframes spDialOut{to{opacity:0;transform:scale(.97)}}',
    '@keyframes spDialIn{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}}',
    '@keyframes spLiveIn{to{opacity:1;transform:scale(1)}}',
    '@keyframes spLiveOut{to{opacity:0;transform:scale(.97)}}',
    '@keyframes spPhoneIn{to{opacity:1;transform:translate(-8%,-50%)}}',
    '@keyframes spPhoneOut{from{opacity:1;transform:translate(-8%,-50%)}to{opacity:0;transform:translate(-46%,-50%)}}',
    '@media (max-width:1180px){.sp-window{left:4%}.sp-mobile{width:26%;max-width:140px}}',
    '@media (max-width:767px){.incoming-scene{display:flex;align-items:center;justify-content:center}.sp-window{position:relative;left:auto;right:auto;top:auto;transform:none;height:auto;width:100%}.sp-body{grid-template-columns:1fr}.sp-list{display:none}.sp-panel{min-height:190px}.incoming-scene .sp-mobile{display:none}}',
    '@media (prefers-reduced-motion:reduce){.incoming-scene .sp-dial{display:none!important}.incoming-scene .sp-live{opacity:1!important;transform:none!important;animation:none!important}.incoming-scene .sp-mobile{opacity:1!important;transform:translate(-8%,-50%)!important;animation:none!important}}',
    '',
    '/* ---- V9: modernised messaging ground ---- */',
    '.messages-scene .msg-ground{position:absolute;inset:0;border-radius:22px;overflow:hidden;background:radial-gradient(120% 100% at 18% 18%,#fffdfb 0%,#faf6f1 42%,#f2ece5 100%);}',
    '.messages-scene .orb{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 38% 34%,var(--c1) 0%,var(--c2) 46%,transparent 70%);filter:blur(6px);}',
    '.messages-scene .o1{width:9%;aspect-ratio:1;left:9%;top:20%;--c1:rgba(255,196,110,.85);--c2:rgba(255,170,70,.34);}',
    '.messages-scene .o2{width:5.5%;aspect-ratio:1;left:26%;top:44%;--c1:rgba(255,120,180,.62);--c2:rgba(230,0,126,.22);}',
    '.messages-scene .o3{width:4%;aspect-ratio:1;left:15%;top:63%;--c1:rgba(255,206,140,.72);--c2:rgba(255,170,70,.26);}',
    '.messages-scene .o4{width:6.5%;aspect-ratio:1;left:34%;top:15%;--c1:rgba(255,225,170,.78);--c2:rgba(255,196,110,.28);}',
    '.messages-scene .o5{width:3.5%;aspect-ratio:1;left:40%;top:70%;--c1:rgba(255,140,190,.55);--c2:rgba(230,0,126,.18);}',
    '.messages-scene.active .orb{animation:orbDrift 12s ease-in-out infinite alternate;}',
    '.messages-scene.active .o2{animation-delay:-3s}.messages-scene.active .o3{animation-delay:-6s}',
    '.messages-scene.active .o4{animation-delay:-1.5s}.messages-scene.active .o5{animation-delay:-8s}',
    '@keyframes orbDrift{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(3%,-4%,0) scale(1.12)}}',
    '.messages-scene .msg-field{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}',
    '.messages-scene .msg-field .ring{fill:none;stroke:#e6007e;stroke-width:2.6;stroke-linecap:round;opacity:.55;stroke-dasharray:var(--c,1700);stroke-dashoffset:var(--c,1700);transform-origin:610px 300px;transform:rotate(128deg);}',
    '.messages-scene .msg-field .r1{stroke-width:3.2;opacity:.7}',
    '.messages-scene .msg-field .r2{opacity:.58}.messages-scene .msg-field .r3{opacity:.46}',
    '.messages-scene .msg-field .r4{opacity:.34}.messages-scene .msg-field .r5{opacity:.24}',
    '.messages-scene.active .msg-field .ring{animation:ringDraw 1.5s cubic-bezier(.25,.8,.25,1) forwards;}',
    '.messages-scene.active .msg-field .r1{animation-delay:.15s}',
    '.messages-scene.active .msg-field .r2{animation-delay:.30s}',
    '.messages-scene.active .msg-field .r3{animation-delay:.45s}',
    '.messages-scene.active .msg-field .r4{animation-delay:.60s}',
    '.messages-scene.active .msg-field .r5{animation-delay:.75s}',
    '@keyframes ringDraw{to{stroke-dashoffset:calc(var(--c,1700) * .74)}}',
    '.messages-scene .msg-phone{right:6%;width:34%;max-width:246px;max-height:86%;border-color:#14141a;border-radius:30px;transform:translateY(-50%) rotate(-1.1deg);box-shadow:0 60px 110px -38px rgba(60,38,20,.52),0 16px 34px -14px rgba(60,38,20,.26),0 0 0 1px rgba(255,255,255,.5) inset;}',
    '.messages-scene .msg-thread{padding:8px 9px 5px;gap:6px;}',
    '.messages-scene .msg-in{background:#f4f1ed;color:#3a3730;}',
    '.messages-scene .msg-out{background:#fde3f0;color:#3a3730;}',
    '.messages-scene .msg-in u{color:#c4006b;text-decoration-color:rgba(196,0,107,.4);}',
    '.messages-scene .msg-in em,.messages-scene .msg-out em{color:#a29a8d;}',
    '.messages-scene .msg-who small,.messages-scene .msg-day{color:#a29a8d;}',
    '.messages-scene .msg-composer span{background:#f4f1ed;color:#a29a8d;}',
    '.messages-scene .mi-2 .msg-in{max-width:94%}',
    '.messages-scene .mi-3 .msg-out{max-width:72%}',
    '.messages-scene .mi-4 .msg-in{max-width:92%}',
    '.messages-scene .mi-5 .msg-out{max-width:80%}',
    '.messages-scene .mi-6 .msg-in{max-width:66%}',
    '.messages-scene.active .mi-6{animation:msgIn .5s cubic-bezier(.2,.9,.3,1) 5.15s forwards;}',
    '.messages-scene .timezone-strip{color:#a29a8d;left:3%;right:42%;bottom:5%;}',
    '@media (max-width:767px){.messages-scene .msg-ground{display:none}.messages-scene .msg-phone{transform:none;width:64%;max-width:210px;}}',
    '@media (prefers-reduced-motion:reduce){.messages-scene .orb{animation:none!important}.messages-scene .msg-field .ring{stroke-dashoffset:calc(var(--c,1700) * .74)!important;animation:none!important}}',
    '',
    '/* ---- V10: four-tab carousel ---- */',
    '.feature-nav{grid-template-columns:repeat(4,1fr);max-width:560px;}',
    '@media (max-width:767px){.feature-nav{grid-template-columns:repeat(2,1fr);}}',
    '.mobileapp-scene{position:absolute;inset:4%;display:grid;place-items:center;}',
    '.ma-phone{position:relative!important;left:auto!important;right:auto!important;top:auto!important;transform:none!important;opacity:1!important;animation:none!important;width:36%!important;max-width:278px!important;z-index:4;}',
    '.ma-rings{position:absolute;left:50%;top:50%;width:52%;aspect-ratio:1;transform:translate(-50%,-50%);}',
    '.ma-rings i{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(230,0,126,.34);opacity:0;}',
    '.mobileapp-scene.active .ma-rings i{animation:maRing 2.4s cubic-bezier(.2,.7,.3,1) infinite;}',
    '.mobileapp-scene.active .ma-rings i:nth-child(2){animation-delay:.5s}',
    '.mobileapp-scene.active .ma-rings i:nth-child(3){animation-delay:1s}',
    '@keyframes maRing{0%{transform:scale(.55);opacity:.75}100%{transform:scale(1.25);opacity:0}}',
    '.ma-answer{display:flex;gap:26px;margin-top:auto;margin-bottom:4px;}',
    '.ma-answer i{width:26px;height:26px;border-radius:50%;flex:0 0 auto;}',
    '.ma-decline{background:#d92c3c;}.ma-accept{background:#33b862;}',
    '.mobileapp-scene .ma-grid,.mobileapp-scene .ma-end{opacity:0;}',
    '.mobileapp-scene.active .ma-answer{animation:maFade .45s ease 3.1s forwards;}',
    '.mobileapp-scene.active .ma-grid{animation:maShow .5s cubic-bezier(.2,.8,.2,1) 3.3s forwards;}',
    '.mobileapp-scene.active .ma-end{animation:maShow .5s cubic-bezier(.2,.8,.2,1) 3.5s forwards;}',
    '.mobileapp-scene.active .ma-rings{animation:maFade .5s ease 3.1s forwards;}',
    '@keyframes maFade{to{opacity:0;visibility:hidden}}',
    '@keyframes maShow{from{opacity:0;transform:translate3d(0,6px,0)}to{opacity:1;transform:none}}',
    '.ma-state{position:relative;display:block;min-height:1.15em;}',
    '.ma-state span{position:absolute;left:0;right:0;text-align:center;}',
    '.ma-s2{opacity:0;}',
    '.mobileapp-scene.active .ma-s1{animation:maFade .3s ease 3.05s forwards;}',
    '.mobileapp-scene.active .ma-s2{animation:maShow .4s ease 3.2s forwards;}',
    '.ma-note{position:absolute;right:6%;bottom:12%;background:#fff;border:1px solid rgba(16,16,22,.08);border-radius:11px;padding:9px 12px;opacity:0;box-shadow:0 18px 40px -18px rgba(16,16,22,.34);}',
    '.ma-note b{display:block;font-size:11px;font-weight:700;color:#0a0a0b;}',
    '.ma-note small{font-size:9.5px;color:#77777e;}',
    '.mobileapp-scene.active .ma-note{animation:maShow .55s cubic-bezier(.2,.8,.2,1) 3.9s forwards;}',
    '.mtg-board{position:absolute;inset:6% 3%;border-radius:22px;z-index:5;background:#f6f5f2;border:1px solid rgba(16,16,22,.10);padding:12px 14px;overflow:hidden;box-shadow:0 26px 60px -26px rgba(16,16,22,.42);}',
    '.mtg-board-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;}',
    '.mtg-board-head b{font-size:11px;font-weight:700;color:#0a0a0b;}',
    '.mtg-board-head span{margin-left:auto;font-size:9px;color:#8a8a92;}',
    '.mtg-board-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;}',
    '.mtg-board-grid i{display:block;height:26px;border-radius:6px;opacity:0;transform:scale(.86);}',
    '.mtg-board-grid .c1{background:#f7c9dd}.mtg-board-grid .c2{background:#cfd7f2}',
    '.mtg-board-grid .c3{background:#cfe9d5}.mtg-board-grid .c4{background:#f6e2b8}',
    '.meeting-scene.active .mtg-board-grid i{animation:mtgCell .34s cubic-bezier(.2,.9,.3,1) forwards;}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(1){animation-delay:0.250s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(2){animation-delay:0.305s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(3){animation-delay:0.360s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(4){animation-delay:0.415s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(5){animation-delay:0.470s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(6){animation-delay:0.525s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(7){animation-delay:0.580s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(8){animation-delay:0.635s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(9){animation-delay:0.690s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(10){animation-delay:0.745s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(11){animation-delay:0.800s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(12){animation-delay:0.855s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(13){animation-delay:0.910s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(14){animation-delay:0.965s}',
    '.meeting-scene.active .mtg-board-grid i:nth-child(15){animation-delay:1.020s}',
    '@keyframes mtgCell{to{opacity:1;transform:scale(1)}}',
    '.mtg-cur{position:absolute;font-size:8.5px;font-weight:700;color:#fff;border-radius:999px;padding:2px 7px;opacity:0;}',
    '.mc-1{background:#e6007e;left:26%;top:42%;}.mc-2{background:#2f6df6;left:58%;top:63%;}',
    '.meeting-scene.active .mc-1{animation:maShow .4s ease 1.1s forwards}',
    '.meeting-scene.active .mc-2{animation:maShow .4s ease 1.5s forwards}',
    '.meeting-scene.active .mtg-board{animation:mtgOut .85s cubic-bezier(.4,0,.5,1) 3.2s forwards;}',
    '@keyframes mtgOut{to{opacity:0;transform:scale(.985)}}',
    '.meeting-scene.active .beat-chat{animation:beatIn .62s cubic-bezier(.2,.8,.2,1) 3.9s forwards,beatOut .8s cubic-bezier(.4,0,.5,1) 6.6s forwards!important;}',
    '.meeting-scene.active .beat-poll{animation:beatIn .8s cubic-bezier(.2,.8,.2,1) 6.9s forwards!important;}',
    '.meeting-scene.active .beat-poll .poll-bar i{animation:pollFill 1.1s cubic-bezier(.3,.9,.3,1) 7.7s forwards!important;}',
    '@media (max-width:767px){.ma-phone{width:60%!important;max-width:206px!important}.ma-note{display:none}.mtg-board{inset:4% 2%}}',
    '@media (prefers-reduced-motion:reduce){.ma-rings,.ma-answer{display:none!important}.mobileapp-scene .ma-grid,.mobileapp-scene .ma-end,.ma-note{opacity:1!important;animation:none!important}.mtg-board{display:none!important}.mtg-board-grid i{opacity:1!important;transform:none!important;animation:none!important}}',
    '/* ---- D-03: interactive targets >=44px at every width (WCAG 2.5.8) ---- */',
    '.feature-tab{min-height:44px;}',
    '.motion-toggle{position:relative;}',
    '/* visible pill stays 34px; the target reaches 44px+ via a transparent',
    '   extension, so no rendered pixel changes */',
    '.motion-toggle::before{content:"";position:absolute;left:0;right:0;top:-8px;bottom:-8px;}',
    '/* ==== V18.1 Messages \u2014 reference-matched ==== */',
    '.messages-scene{position:absolute;inset:0;}',
    '.messages-scene .msg-plate{position:absolute;inset:0;border-radius:22px;overflow:hidden;background:#20242c;}',
    '/* owned stand-in for the reference photograph: a defocused window wall',
    '   with warm bokeh. Set --cani-msg-photo to a url() to drop an approved',
    '   asset in without touching anything else. */',
    '.messages-scene .msg-photo{position:absolute;inset:0;background-image:var(--cani-msg-photo,none),radial-gradient(26% 34% at 71% 26%,rgba(255,222,176,.30),transparent 68%),radial-gradient(17% 22% at 84% 48%,rgba(255,206,150,.24),transparent 70%),radial-gradient(20% 26% at 62% 71%,rgba(214,226,255,.16),transparent 72%),repeating-linear-gradient(93deg,rgba(255,255,255,.028) 0 1px,rgba(255,255,255,0) 1px 42px),linear-gradient(151deg,#3c4453 0%,#2c3440 46%,#1b2029 100%);background-size:cover,auto,auto,auto,auto,auto;background-position:center;filter:saturate(.94) blur(.2px);}',
    '.messages-scene .msg-photo-warm{position:absolute;inset:0;background:radial-gradient(38% 30% at 78% 22%,rgba(255,196,120,.34),transparent 70%),radial-gradient(22% 18% at 64% 44%,rgba(255,214,150,.26),transparent 72%),radial-gradient(30% 26% at 88% 62%,rgba(255,178,96,.22),transparent 74%),linear-gradient(180deg,rgba(12,14,18,.10),rgba(12,14,18,.34));}',
    '.messages-scene .msg-arcs{position:absolute;inset:0;width:100%;height:100%;overflow:visible;}',
    '.messages-scene .msg-arcs .arc{fill:none;stroke:#F2A932;stroke-width:7;stroke-linecap:round;opacity:0;}',
    '.messages-scene.active .msg-arcs .arc{animation:msgArc .9s cubic-bezier(.22,.75,.25,1) forwards;}',
    '.messages-scene.active .a1{animation-delay:.10s}.messages-scene.active .a2{animation-delay:.22s}',
    '.messages-scene.active .a3{animation-delay:.34s}.messages-scene.active .a4{animation-delay:.46s}',
    '.messages-scene.active .a5{animation-delay:.58s}',
    '@keyframes msgArc{from{opacity:0;transform:scale(.965);transform-origin:18% 118%}to{opacity:.92;transform:none}}',
    '/* phone: measured at x 11.9%, y 6.4%, w 25.9%, h 87.2%, aspect 1:2.09 */',
    '.messages-scene .msg-device{position:absolute;left:11.9%;top:6.4%;width:25.9%;height:87.2%;border-radius:26px;background:#0e1013;padding:5px;box-shadow:0 44px 90px -34px rgba(6,8,12,.72),0 12px 28px -12px rgba(6,8,12,.5),0 0 0 1px rgba(255,255,255,.10) inset;opacity:0;transform:translateY(16px);}',
    '.messages-scene.active .msg-device{animation:msgDevice .72s cubic-bezier(.2,.8,.2,1) .18s forwards;}',
    '@keyframes msgDevice{to{opacity:1;transform:none}}',
    '.messages-scene .msg-screen{position:relative;height:100%;border-radius:22px;background:#fbfbfc;overflow:hidden;display:flex;flex-direction:column;}',
    '.messages-scene .msg-status{display:flex;justify-content:space-between;align-items:center;padding:6px 12px 2px;font-size:8px;font-weight:700;color:#25252a;}',
    '.messages-scene .msg-status i{width:16px;height:5px;border-radius:2px;background:#25252a;opacity:.55;}',
    '.messages-scene .msg-head{display:flex;align-items:center;gap:6px;padding:4px 10px 7px;border-bottom:1px solid #ececef;position:relative;z-index:3;background:#fbfbfc;flex:0 0 auto;}.messages-scene .msg-status{position:relative;z-index:3;background:#fbfbfc;flex:0 0 auto}.messages-scene .msg-thread{position:relative;z-index:1}',
    '.messages-scene .msg-back{font-size:12px;color:#8a8a92;}',
    '.messages-scene .msg-ava{width:17px;height:17px;border-radius:50%;background:#e6007e;color:#fff;font-size:7px;font-weight:700;display:flex;align-items:center;justify-content:center;}',
    '.messages-scene .msg-who{display:grid;}',
    '.messages-scene .msg-who b{font-size:9px;color:#17171c;}',
    '.messages-scene .msg-who small{font-size:7px;color:#8a8a92;}',
    '.messages-scene .msg-thread{flex:1;padding:8px 9px 0;display:grid;gap:6px;align-content:start;}',
    '.messages-scene.active .msg-thread{animation:msgScroll 7.17s cubic-bezier(.36,0,.32,1) both;}',
    '/* thread travels 25% of its own height, matching the reference scroll */',
    '@keyframes msgScroll{0%,14%{transform:translateY(0)}100%{transform:translateY(-25%)}}',
    '.messages-scene .msg-line{opacity:0;transform:translateY(9px);}',
    '.messages-scene.active .msg-line{animation:msgIn .42s cubic-bezier(.2,.85,.3,1) forwards;}',
    '.messages-scene.active .ml-1{animation-delay:.55s}.messages-scene.active .ml-2{animation-delay:1.35s}',
    '.messages-scene.active .ml-3{animation-delay:2.15s}.messages-scene.active .ml-4{animation-delay:2.95s}',
    '.messages-scene.active .ml-5{animation-delay:3.75s}.messages-scene.active .ml-6{animation-delay:4.55s}',
    '@keyframes msgIn{to{opacity:1;transform:none}}',
    '.messages-scene .msg-quote{border-left:2px solid #e6007e;padding:2px 0 2px 6px;margin-bottom:3px;display:grid;gap:1px;}',
    '.messages-scene .msg-quote b{font-size:7px;color:#e6007e;}',
    '.messages-scene .msg-quote span{font-size:7px;color:#8a8a92;}',
    '.messages-scene .bub{position:relative;max-width:88%;padding:6px 8px 12px;border-radius:11px;font-size:7.6px;line-height:1.45;color:#2b2b31;}',
    '.messages-scene .bub em{position:absolute;right:7px;bottom:3px;font-style:normal;font-size:6px;color:#a4a4ac;}',
    '.messages-scene .bub.in{background:#f1f1f4;border-top-left-radius:4px;}',
    '.messages-scene .bub.out{background:#fde3f0;border-top-right-radius:4px;margin-left:auto;}',
    '.messages-scene .bub u{color:#c4006b;text-decoration-color:rgba(196,0,107,.4);}',
    '.messages-scene .msg-composer{display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 9px;border-top:1px solid #ececef;background:#fff;}',
    '.messages-scene .msg-composer span{flex:1;font-size:7px;color:#a4a4ac;background:#f4f4f6;border-radius:99px;padding:4px 8px;}',
    '.messages-scene .msg-composer i{width:13px;height:13px;border-radius:50%;background:#e6007e;}',
    '.messages-scene .msg-zones{position:absolute;left:5%;right:5%;bottom:3.4%;display:flex;justify-content:space-between;font-size:8px;letter-spacing:.14em;color:rgba(255,255,255,.62);}',
    '@media (max-width:767px){.messages-scene .msg-device{left:8%;width:34%}.messages-scene .msg-zones{display:none}}',
    '@media (prefers-reduced-motion:reduce){.messages-scene .msg-device,.messages-scene .msg-line{opacity:1!important;transform:none!important;animation:none!important}.messages-scene .msg-arcs .arc{opacity:.92!important;animation:none!important}.messages-scene.active .msg-thread{animation:none!important;transform:none!important}}',
    '/* ==== V18.1 Soft phone \u2014 reference-matched ==== */',
    '.incoming-scene{position:absolute;inset:0;}',
    '.incoming-scene .spx-plate{position:absolute;inset:0;border-radius:22px;background:linear-gradient(158deg,#f7f7f9 0%,#eef0f3 100%);}',
    '/* desktop window: w 87.5%, x slides 7.0% -> 13.6% -> 7.0% across 6.80s */',
    '.incoming-scene .spx-window{position:absolute;left:7%;top:6.5%;width:87.5%;height:88%;border-radius:13px;background:#fff;overflow:hidden;box-shadow:0 34px 70px -30px rgba(16,18,24,.34),0 10px 22px -10px rgba(16,18,24,.18),0 0 0 1px rgba(16,18,24,.07);}',
    '.incoming-scene.active .spx-window{animation:spxWin 6.8s cubic-bezier(.45,0,.35,1) infinite;}',
    '@keyframes spxWin{0%,14%{transform:translateX(0)}44%{transform:translateX(7.55%)}72%{transform:translateX(.69%)}100%{transform:translateX(0)}}',
    '.incoming-scene .spx-titlebar{display:flex;align-items:center;gap:8px;padding:6px 10px;border-bottom:1px solid #ececef;background:#fafafb;}',
    '.incoming-scene .spx-dots{display:flex;gap:3px}.incoming-scene .spx-dots i{width:5px;height:5px;border-radius:50%;background:#d6d6db}',
    '.incoming-scene .spx-titlebar b{font-size:8px;color:#3a3a41;letter-spacing:.01em}',
    '.incoming-scene .spx-tools{margin-left:auto;display:flex;gap:5px}.incoming-scene .spx-tools i{width:7px;height:7px;border-radius:2px;background:#e2e2e6}',
    '.incoming-scene .spx-body{display:grid;grid-template-columns:46% 1fr;height:calc(100% - 22px);}',
    '.incoming-scene .spx-list{border-right:1px solid #ececef;padding:6px 7px 6px 40%;overflow:hidden;background:#fff;}',
    '.incoming-scene .spx-tabs{display:flex;gap:9px;padding:0 2px 5px}',
    '.incoming-scene .spx-tabs span{font-size:7px;color:#6e6e77;padding-bottom:3px}',
    '.incoming-scene .spx-tabs .on{color:#17171c;font-weight:700;box-shadow:inset 0 -1.5px 0 #e6007e}',
    '.incoming-scene .spx-search{font-size:6.5px;color:#6b6b73;background:#f4f4f6;border-radius:4px;padding:3px 6px;margin-bottom:5px}',
    '.incoming-scene .spx-sect{font-size:6px;letter-spacing:.1em;text-transform:uppercase;color:#7c7c85;margin:4px 2px 3px}',
    '.incoming-scene .spx-row{display:flex;align-items:center;gap:5px;padding:1.9px 2px;}',
    '.incoming-scene .spx-row+.spx-row{border-top:1px solid #f4f4f6}',
    '.incoming-scene .spx-av{width:13px;height:13px;border-radius:50%;background:#eceef2;color:#5c5c63;font-size:5.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:0 0 auto}',
    '.incoming-scene .spx-av-on{background:#e6007e;color:#fff}',
    '.incoming-scene .spx-rt{display:grid;min-width:0;flex:1}',
    '.incoming-scene .spx-rt b{font-size:7.4px;color:#25252a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.incoming-scene .spx-rt small{font-size:6.1px;color:#63636b}',
    '.incoming-scene .spx-row em{font-size:6.1px;color:#63636b;font-style:normal}',
    '.incoming-scene .spx-end-mini{width:11px;height:6px;border-radius:3px;background:#d92c3c}',
    '.incoming-scene .spx-pane{position:relative;background:#f7f6f4;display:flex;flex-direction:column;align-items:center;padding-top:9px}',
    '.incoming-scene .spx-pane-h{font-size:7.5px;color:#3a3a41;font-weight:600;margin-bottom:8px}',
    '.incoming-scene .spx-card{position:absolute;top:26px;left:50%;transform:translateX(-50%);width:min(62%,168px);background:#fff;border-radius:8px;padding:10px 9px;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:0 10px 24px -12px rgba(16,18,24,.24),0 0 0 1px rgba(16,18,24,.05);}',
    '/* the pane alternates card and dial pad on the reference cadence */',
    '.incoming-scene.active .spx-card-call{animation:spxCall 6.8s linear infinite}',
    '.incoming-scene.active .spx-card-dial{animation:spxDial 6.8s linear infinite}',
    '@keyframes spxCall{0%,20%{opacity:1}26%,64%{opacity:0}70%,100%{opacity:1}}',
    '@keyframes spxDial{0%,20%{opacity:0}26%,64%{opacity:1}70%,100%{opacity:0}}',
    '.incoming-scene .spx-av-lg{width:30px;height:30px;font-size:9px;background:#eceef2;color:#4c4c53}',
    '.incoming-scene .spx-card b{font-size:8px;color:#17171c}',
    '.incoming-scene .spx-timer{font-size:6.5px;color:#a4a4ac}',
    '.incoming-scene .spx-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 4px;width:100%;margin:5px 0 3px}',
    '.incoming-scene .spx-grid span,.incoming-scene .spx-m-grid span{display:grid;justify-items:center;gap:2px;font-size:5px;color:#8a8a92}',
    '.incoming-scene .spx-grid i,.incoming-scene .spx-m-grid i{width:15px;height:15px;border-radius:50%;background:#f1f1f4;box-shadow:inset 0 0 0 1px #e6e6e9}',
    '.incoming-scene .spx-end{width:100%;border:0;border-radius:5px;background:#d92c3c;color:#fff;font-size:7px;font-weight:700;padding:4px 0}',
    '.incoming-scene .spx-call{width:100%;border:0;border-radius:5px;background:#e6007e;color:#fff;font-size:7px;font-weight:700;padding:4px 0}',
    '.incoming-scene .spx-dial-h{font-size:6px;color:#6b6b73}',
    '.incoming-scene .spx-dial-num{font-size:8.5px;color:#17171c;font-weight:600;letter-spacing:.02em}',
    '.incoming-scene .spx-fav{position:absolute;top:190px;left:50%;transform:translateX(-50%);width:min(62%,168px);display:grid;gap:3px}.incoming-scene .spx-fav-h{font-size:6px;letter-spacing:.1em;text-transform:uppercase;color:#7c7c85;margin-bottom:1px}.incoming-scene .spx-fav-r{display:flex;align-items:center;gap:5px;background:#fff;border-radius:5px;padding:3px 5px;box-shadow:0 0 0 1px rgba(16,18,24,.045)}.incoming-scene .spx-fav-r .spx-rt b{font-size:6.6px}.incoming-scene .spx-fav-r .spx-rt small{font-size:5.6px}.incoming-scene .spx-fav-d{width:5px;height:5px;border-radius:50%;background:#27a567;flex:0 0 auto}.incoming-scene .spx-fav-busy{background:#d92c3c}.incoming-scene .spx-fav-away{background:#e0a32e}.incoming-scene .spx-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;width:100%;margin:4px 0 3px}',
    '.incoming-scene .spx-pad span{font-size:8px;color:#2b2b31;text-align:center;padding:1px 0}',
    '/* handset: x 0%, w 25.0%, h 87.1%, y rises 20.8% -> 12.9% -> 20.8% */',
    '.incoming-scene .spx-mobile{position:absolute;left:0;top:20.8%;width:25%;height:87.1%;max-height:87.1%;border-radius:20px;background:#0e1013;padding:4px;box-shadow:0 40px 80px -30px rgba(10,12,18,.55),0 12px 26px -12px rgba(10,12,18,.34);}',
    '.incoming-scene.active .spx-mobile{animation:spxMob 6.8s cubic-bezier(.45,0,.35,1) infinite;}',
    '@keyframes spxMob{0%,14%{transform:translateY(0)}44%{transform:translateY(-9.07%)}72%{transform:translateY(-4.59%)}100%{transform:translateY(0)}}',
    '.incoming-scene .spx-m-screen{position:relative;height:100%;border-radius:17px;background:#fff;overflow:hidden;display:flex;flex-direction:column;align-items:center;padding-top:5px}',
    '.incoming-scene .spx-m-status{display:flex;justify-content:space-between;align-items:center;width:100%;padding:0 8px;font-size:6px;font-weight:700;color:#25252a}',
    '.incoming-scene .spx-m-status i{width:12px;height:4px;border-radius:2px;background:#25252a;opacity:.5}',
    '.incoming-scene .spx-m-head{display:flex;align-items:center;gap:5px;width:100%;padding:4px 8px 6px;border-bottom:1px solid #f1f1f4}',
    '.incoming-scene .spx-m-head span{font-size:9px;color:#8a8a92}',
    '.incoming-scene .spx-m-head b{font-size:7px;color:#17171c}',
    '.incoming-scene .spx-m-num{font-size:9px;font-weight:600;color:#17171c;margin-top:9px}',
    '.incoming-scene .spx-m-sub{font-size:6px;color:#a4a4ac}',
    '.incoming-scene .spx-m-av{width:30px;height:30px;font-size:9px;margin-top:8px;background:#e6007e;color:#fff}',
    '.incoming-scene .spx-m-timer{font-size:6.5px;color:#a4a4ac;margin-top:4px}',
    '.incoming-scene .spx-m-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px 4px;width:82%;margin-top:9px}',
    '.incoming-scene .spx-m-end{position:absolute;bottom:9%;width:22px;height:22px;border-radius:50%;background:#d92c3c}',
    '@media (max-width:767px){.incoming-scene .spx-body{grid-template-columns:44% 1fr}.incoming-scene .spx-mobile{width:31%}}',
    '@media (prefers-reduced-motion:reduce){.incoming-scene.active .spx-window,.incoming-scene.active .spx-mobile{animation:none!important;transform:none!important}.incoming-scene.active .spx-card-call{animation:none!important;opacity:1}.incoming-scene.active .spx-card-dial{animation:none!important;opacity:0}}',
    '/* ==== V18.1 Meetings \u2014 reference-matched cascade ==== */',
    '.meeting-scene{position:absolute;inset:0;}',
    '.meeting-scene .mtx-plate{position:absolute;inset:0;border-radius:22px;background:linear-gradient(160deg,#f4f5f7 0%,#e9ebef 100%);}',
    '.meeting-scene .mtx-bar{display:flex;align-items:center;gap:7px;padding:5px 9px;border-bottom:1px solid #ececef;background:#fafafb;}',
    '.meeting-scene .mtx-bar b{font-size:7px;color:#3a3a41;}',
    '.meeting-scene .mtx-dots{display:flex;gap:3px}.meeting-scene .mtx-dots i{width:4.5px;height:4.5px;border-radius:50%;background:#d6d6db}',
    '/* rear calendar: w 85.5%, x -0.5% -> 5.0%, y -0.7% -> 8.5% */',
    '.meeting-scene .mtx-cal{position:absolute;left:-.5%;top:-.7%;width:85.5%;height:88%;border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 20px 44px -22px rgba(16,18,24,.26),0 0 0 1px rgba(16,18,24,.06);}',
    '.meeting-scene.active .mtx-cal{animation:mtxCal 14.96s cubic-bezier(.4,0,.3,1) infinite;}',
    '@keyframes mtxCal{0%,62%{transform:translate(0,0)}88%,100%{transform:translate(6.43%,10.45%)}}',
    '.meeting-scene .mtx-cal-b{padding:7px 9px;display:grid;gap:3px;align-content:start}',
    '.meeting-scene .mtx-cal-h{font-size:7.5px;font-weight:700;color:#17171c;margin-bottom:2px}',
    '.meeting-scene .mtx-cal-h2{margin-top:7px}',
    '.meeting-scene .mtx-cal-row{display:flex;align-items:center;gap:7px;padding:3px 5px;border-radius:5px;background:#f7f7f9}',
    '.meeting-scene .mtx-cal-row em{font-size:6px;color:#a4a4ac;font-style:normal;min-width:34px}',
    '.meeting-scene .mtx-cal-row b{font-size:7px;color:#3a3a41;font-weight:500}',
    '.meeting-scene .mtx-cal-row.is-now{background:#1b1d22}',
    '.meeting-scene .mtx-cal-row.is-now b,.meeting-scene .mtx-cal-row.is-now em{color:#fff}',
    '/* foreground meeting: w 86.8% h 87.5%, x 9.7% -> 3.8%, y 20.9% -> 9.5% */',
    '.meeting-scene .mtx-meet{position:absolute;left:9.7%;top:20.9%;width:86.8%;height:87.5%;border-radius:12px;background:#fff;overflow:hidden;box-shadow:0 40px 84px -34px rgba(16,18,24,.42),0 12px 26px -12px rgba(16,18,24,.2),0 0 0 1px rgba(16,18,24,.07);}',
    '.meeting-scene.active .mtx-meet{animation:mtxMeet 14.96s cubic-bezier(.4,0,.3,1) infinite;}',
    '@keyframes mtxMeet{0%,18%{transform:translate(0,0)}52%,100%{transform:translate(-6.8%,-13.0%)}}',
    '.meeting-scene .mtx-bar-d{background:#16181c;border-bottom-color:#26282e}',
    '.meeting-scene .mtx-bar-d b{color:#eceef2}',
    '.meeting-scene .mtx-bar-d .mtx-dots i{background:#3a3d45}',
    '.meeting-scene .mtx-rec{margin-left:auto;font-size:6px;color:#f2a932;background:rgba(242,169,50,.14);border-radius:99px;padding:1px 6px}',
    '.meeting-scene .mtx-meet-b{display:grid;grid-template-columns:26% 1fr 15%;height:calc(100% - 46px);background:#0f1114}',
    '.meeting-scene .mtx-chat{background:#16181c;padding:7px;display:grid;gap:4px;align-content:start;border-right:1px solid #23262c}',
    '.meeting-scene .mtx-chat-h{font-size:7px;font-weight:700;color:#eceef2;margin-bottom:2px}',
    '.meeting-scene .mtx-file{display:flex;align-items:center;gap:5px;background:#1d2026;border-radius:5px;padding:5px}',
    '.meeting-scene .mtx-file i{width:11px;height:13px;border-radius:2px;background:#2f333b;flex:0 0 auto}',
    '.meeting-scene .mtx-file span{display:grid;min-width:0}',
    '.meeting-scene .mtx-file b{font-size:6px;line-height:1.4;color:#e6e9ef;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.meeting-scene .mtx-file em{font-size:5.5px;line-height:1.4;color:#9aa0aa;font-style:normal}',
    '.meeting-scene .mtx-share{margin-top:2px;text-align:center;font-size:6.5px;font-weight:700;color:#fff;background:#e6007e;border-radius:5px;padding:4px 0}',
    '.meeting-scene .mtx-stage-v{position:relative;display:flex;align-items:center;justify-content:center;background:radial-gradient(70% 70% at 50% 42%,#2b3a44 0%,#1a2229 70%,#141a20 100%)}',
    '.meeting-scene .mtx-speaker{width:38%;aspect-ratio:1;border-radius:50%;background:linear-gradient(150deg,#3d4b57,#2a343d);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px rgba(230,0,126,.5)}',
    '.meeting-scene .mtx-speaker i{font-style:normal;font-size:15px;font-weight:700;color:#eef1f5}',
    '.meeting-scene .mtx-cap{position:absolute;left:7px;bottom:6px;font-size:6px;color:#cfd5dd;background:rgba(0,0,0,.42);border-radius:99px;padding:2px 7px}',
    '.meeting-scene .mtx-film{background:#101317;display:grid;grid-auto-rows:1fr;gap:2px;padding:3px}',
    '.meeting-scene .mtx-film-t{position:relative;border-radius:4px;background:linear-gradient(150deg,#28323b,#1b232a);display:flex;align-items:center;justify-content:center;opacity:0}',
    '.meeting-scene.active .mtx-film-t{animation:mtxTile .4s ease forwards}',
    '.meeting-scene.active .f1{animation-delay:.5s}.meeting-scene.active .f2{animation-delay:.62s}',
    '.meeting-scene.active .f3{animation-delay:.74s}.meeting-scene.active .f4{animation-delay:.86s}',
    '.meeting-scene.active .f5{animation-delay:.98s}.meeting-scene.active .f6{animation-delay:1.10s}',
    '.meeting-scene.active .f7{animation-delay:1.22s}.meeting-scene.active .f8{animation-delay:1.34s}',
    '@keyframes mtxTile{to{opacity:1}}',
    '.meeting-scene .mtx-film-t i{font-style:normal;font-size:6.5px;font-weight:700;color:#cfd5dd}',
    '.meeting-scene .mtx-film-t em{position:absolute;left:2px;bottom:1px;font-size:4.5px;font-style:normal;color:#8a8f99}',
    '.meeting-scene .mtx-ctrl{display:flex;align-items:center;justify-content:center;gap:7px;height:40px;background:#16181c}',
    '.meeting-scene .mtx-ctrl i{width:17px;height:17px;border-radius:50%;background:#262a31}',
    '.meeting-scene .mtx-ctrl i.on{background:#e6007e}',
    '.meeting-scene .mtx-ctrl button{border:0;border-radius:99px;background:#d92c3c;color:#fff;font-size:6.5px;font-weight:700;padding:4px 10px;margin-left:5px}',
    '/* transcript panel rises 34.4% -> 17.8% -> 9.8% and fades in late */',
    '.meeting-scene .mtx-tx{position:absolute;left:9.8%;top:34.4%;width:87.2%;height:83.7%;border-radius:12px;background:#fff;overflow:hidden;opacity:0;box-shadow:0 54px 104px -36px rgba(16,18,24,.52),0 16px 34px -14px rgba(16,18,24,.26),0 0 0 1px rgba(16,18,24,.08);}.meeting-scene .mtx-tx-b{display:grid;grid-template-columns:1fr 34%;height:calc(100% - 26px)}.meeting-scene .mtx-tx-main{padding:11px 14px;display:grid;gap:11px;align-content:start;overflow:hidden;position:relative}.meeting-scene .mtx-tx-main:after{content:"";position:absolute;left:0;right:0;bottom:0;height:34px;background:linear-gradient(to bottom,rgba(255,255,255,0),#fff)}.meeting-scene .mtx-tx-r{display:grid;grid-template-columns:26px 1fr;gap:7px;align-items:start}.meeting-scene .mtx-tx-t{font-size:6.5px;color:#a4a4ac;font-variant-numeric:tabular-nums;padding-top:.5px}.meeting-scene .mtx-tx-title{font-size:7px;color:#3a3a41;font-weight:600}.meeting-scene .mtx-tx-rec{display:flex;align-items:center;gap:4px;font-size:6.5px;color:#8a6a1e;background:#fdf3dd;border-radius:999px;padding:2px 7px}.meeting-scene .mtx-tx-rec i{width:4px;height:4px;border-radius:50%;background:#f2a932;display:inline-block}.meeting-scene .mtx-tx-bar{display:flex;align-items:center;gap:9px;padding:0 11px;height:26px;border-bottom:1px solid #ececf0;background:#fbfbfc}.meeting-scene .mtx-tx-ppl{display:grid;gap:3px}.meeting-scene .mtx-tx-ppl u{text-decoration:none;font-size:6.5px;color:#3a3a41;display:flex;align-items:center;gap:5px}.meeting-scene .mtx-tx-files u i{border-radius:2px;font-size:4.2px;letter-spacing:0;background:#e9ecf1;color:#5a5a63}.meeting-scene .mtx-tx-ppl u i{width:11px;height:11px;border-radius:50%;background:#ececf0;color:#5a5a63;font-size:5px;font-style:normal;display:flex;align-items:center;justify-content:center;letter-spacing:.02em}.meeting-scene .mtx-tx-side{padding:11px 13px;border-left:1px solid #ececf0;background:#fafafb;display:grid;gap:7px;align-content:start}.meeting-scene .mtx-tx-live{display:flex;align-items:center;gap:5px;font-size:6.5px;letter-spacing:.1em;text-transform:uppercase;color:#a4a4ac}.meeting-scene .mtx-tx-live i{width:4px;height:4px;border-radius:50%;background:#e6007e;display:inline-block}.meeting-scene .mtx-tx-act{display:grid;gap:3px}.meeting-scene .mtx-tx-act u{text-decoration:none;font-size:6.5px;color:#3a3a41;display:flex;gap:5px;align-items:flex-start;line-height:1.35}.meeting-scene .mtx-tx-act u:before{content:"";flex:0 0 auto;width:5px;height:5px;margin-top:1px;border-radius:1.5px;border:1px solid #c9c9d0}',
    '.meeting-scene.active .mtx-tx{animation:mtxTx 14.96s cubic-bezier(.3,.8,.3,1) infinite;}',
    '@keyframes mtxTx{0%,44%{opacity:0;transform:translate(0,0)}46.3%,57%{opacity:1;transform:translate(0,0)}73.5%{opacity:1;transform:translate(0,-19.83%)}90%{opacity:1;transform:translate(-5.39%,-26.76%)}100%{opacity:1;transform:translate(-7.34%,-29.39%)}}',
    '.meeting-scene .mtx-tx-h{font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:#a4a4ac}',
    '.meeting-scene .mtx-tx-l{font-size:7.5px;color:#3a3a41;line-height:1.45}',
    '.meeting-scene .mtx-tx-l b{color:#17171c}',
    '.meeting-scene .mtx-tx-sum{border-left:2px solid #e6007e;padding-left:7px;display:grid;gap:2px}',
    '.meeting-scene .mtx-tx-sum b{font-size:7px;color:#e6007e;line-height:1.35}',
    '.meeting-scene .mtx-tx-sum span{font-size:6.5px;color:#6e6e73;line-height:1.4}',
    '@media (max-width:767px){.meeting-scene .mtx-meet-b{grid-template-columns:1fr 15%}.meeting-scene .mtx-chat{display:none}.meeting-scene .mtx-tx-b{grid-template-columns:1fr}.meeting-scene .mtx-tx-side{display:none}}',
    '@media (prefers-reduced-motion:reduce){.meeting-scene.active .mtx-cal,.meeting-scene.active .mtx-meet{animation:none!important;transform:none!important}.meeting-scene.active .mtx-tx{animation:none!important;opacity:1;transform:none}.meeting-scene.active .mtx-film-t{animation:none!important;opacity:1}}'
  ].join('');

  var PANEL_ICONS = ['phone', 'wave', 'message', 'file', 'send', 'video', 'spark', 'board'];
  var panels = FEATURES.map(function (feature, i) {
    return '<article class="feature-panel' + (i === 0 ? ' active' : '') + '" data-panel="' + i + '" role="tabpanel" id="x8-panel-' + i + '" aria-labelledby="x8-tab-' + i + '"' + (i ? ' aria-hidden="true"' : '') + '>' +
      '<div class="feature-kicker"><span>' + icon(PANEL_ICONS[i]) + '</span>' + feature.kicker + '</div>' +
      '<h3>' + feature.title + '</h3><p>' + feature.body + '</p></article>';
  }).join('');

  var tabs = FEATURES.map(function (feature, i) {
    return '<button class="feature-tab" data-tab="' + i + '" type="button" role="tab" id="x8-tab-' + i + '" aria-controls="x8-panel-' + i + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '"' + (i ? ' tabindex="-1"' : '') + '>' + feature.tab + '</button>';
  }).join('');

  var HTML = '<div data-root><section class="showcase" aria-label="Cani Work unified communications">' +
    '<div class="copy">' +
      '<h2>Unified Communications<br>Made Simple With<br><span>Cani Work</span></h2>' +
      '<p class="intro">Cani Work brings calling, video meetings, team chat and files into one easy app, helping people stay connected and keep business moving.</p>' +
      '<div class="feature-card"><div class="progress-track" aria-hidden="true"><div class="progress-bar"></div></div>' + panels + '</div>' +
      '<div class="feature-nav" role="tablist" aria-label="Cani Work feature demonstrations">' + tabs + '</div>' +
      '<div class="under-nav"><button class="motion-toggle" type="button" aria-pressed="false"><span aria-hidden="true">\u2161</span> <span data-motion-label>Pause animation</span></button><span class="state-count" aria-live="polite"><b>01</b> / ' + String(FEATURES.length).padStart(2, '0') + '</span></div>' +
      '<div class="actions"><a class="cta primary" href="/hosted-telephony"><span>Take a Tour of Cani Work</span></a><a class="cta secondary" href="/contact">Request a Quote \u203A</a></div>' +
      '<div class="proof"><strong aria-hidden="true">\u2605\u2605\u2605\u2605\u2605</strong><span>Delivered and supported by Cani Communications</span></div>' +
    '</div>' +
    '<div class="stage" aria-hidden="true" inert><div class="stage-shell"><div class="stage-rings"></div><div class="stage-glow"></div>' + SCENES + '</div></div>' +
  '</section></div>';

  function Cani8x8Showcase() {
    var self = Reflect.construct(HTMLElement, [], Cani8x8Showcase);
    self._idx = 0;
    self._timer = null;
    self._paused = false;
    self._inView = false;
    self._pageVisible = !document.hidden;
    self._teardown = [];
    return self;
  }
  Cani8x8Showcase.prototype = Object.create(HTMLElement.prototype);
  Cani8x8Showcase.prototype.constructor = Cani8x8Showcase;
  Object.setPrototypeOf(Cani8x8Showcase, HTMLElement);
  Object.defineProperty(Cani8x8Showcase, 'observedAttributes', {
    get: function () { return ['motion']; }
  });
  Object.defineProperty(Cani8x8Showcase.prototype, 'activeIndex', {
    get: function () { return this._idx; }
  });

  Cani8x8Showcase.prototype._reduced = function () {
    return this.getAttribute('motion') === 'reduced' ||
      Boolean(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };

  /* Owned Cani placeholder used only in rights-safe mode. It keeps each frame's
     box and aspect so the composition is identical, but shows a neutral
     brand-tinted panel instead of a third-party screenshot. Deliberately CSS
     only - no external file to license, host or upload. */
  var RIGHTS_SAFE_CSS =
    'img[data-cani-placeholder="rights-safe"]{' +
      'background:linear-gradient(135deg,#f4f4f6 0%,#eceaef 48%,#f7eef4 100%);' +
      'box-shadow:inset 0 0 0 1px rgba(10,10,11,.07);' +
      'object-fit:cover;' +
    '}';

  /* ---- WIX STAGING INTEGRATION: deterministic asset resolution ----
     The component's markup carries relative `./assets/<file>.png` URLs, which
     only resolve when the page happens to sit one level above an `assets`
     folder. Inside Wix that assumption is false, so every reference image 404s.

     One hook replaces the assumption. After the shadow DOM is populated, every
     `<img>` whose src still starts with `./assets/` is rewritten against a base
     that the host element supplies:

       <cani-8x8-work-showcase
          data-asset-base="https://static.wixstatic.com/media/<folder>/">

     Rules:
       - `data-asset-base` absent  -> keep the local relative path (so the local
         preview and its QA battery behave exactly as before);
       - `data-asset-base` set     -> base + filename, trailing slash tolerated;
       - `data-partner-assets="off"` -> RIGHTS-SAFE MODE. The four 8x8 reference
         screenshots are not requested at all; each frame falls back to an
         owned Cani gradient placeholder, so no third-party imagery is
         republished while rights are unconfirmed. Layout is unchanged because
         the <img> keeps its box.
     This runs once per element, before any scene is shown. */
  function resolveAssets(root, host) {
    var base = host.getAttribute('data-asset-base');
    var partners = (host.getAttribute('data-partner-assets') || 'on').toLowerCase();
    var rightsSafe = partners === 'off';
    var imgs = root.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var src = img.getAttribute('src') || '';
      if (src.indexOf('./assets/') !== 0) continue;
      var file = src.slice('./assets/'.length);
      img.setAttribute('data-cani-asset', file);
      if (rightsSafe) {
        /* Never issue the request. Remove src entirely rather than blanking it,
           which would resolve to the page URL and log a console error. */
        img.removeAttribute('src');
        img.setAttribute('data-cani-placeholder', 'rights-safe');
        continue;
      }
      if (base) img.setAttribute('src', base.replace(/\/+$/, '') + '/' + file);
    }
  }

  Cani8x8Showcase.prototype.connectedCallback = function () {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = '<style>' + CSS + RIGHTS_SAFE_CSS + '</style>' + HTML;
    try { rvEnsureFont(); rvInstall(this, this.shadowRoot); } catch (e) {}
    resolveAssets(this.shadowRoot, this);
    /* Give each globe arc its true length so the draw-on is exact. */
    var rings = this.shadowRoot.querySelectorAll('.msg-field .ring');
    for (var g = 0; g < rings.length; g++) {
      try { rings[g].style.setProperty('--c', rings[g].getTotalLength().toFixed(1)); } catch (e) {}
    }
    var arcs = this.shadowRoot.querySelectorAll('.globe .arc');
    for (var a = 0; a < arcs.length; a++) {
      try { arcs[a].style.setProperty('--len', arcs[a].getTotalLength().toFixed(1)); } catch (e) {}
    }
    this._panels = Array.prototype.slice.call(this.shadowRoot.querySelectorAll('[data-panel]'));
    this._tabs = Array.prototype.slice.call(this.shadowRoot.querySelectorAll('[data-tab]'));
    this._scenes = Array.prototype.slice.call(this.shadowRoot.querySelectorAll('[data-scene]'));
    this._bar = this.shadowRoot.querySelector('.progress-bar');
    this._toggle = this.shadowRoot.querySelector('.motion-toggle');
    this._motionLabel = this.shadowRoot.querySelector('[data-motion-label]');
    this._counter = this.shadowRoot.querySelector('.state-count b');
    this._idx = 0;
    this._paused = false;
    this._pageVisible = !document.hidden;
    this._inView = false;
    this._show(0, true);
    this._wire();
    this._syncToggle();
  };

  Cani8x8Showcase.prototype.disconnectedCallback = function () {
    this._stop();
    this._teardown.forEach(function (fn) { fn(); });
    this._teardown = [];
  };

  Cani8x8Showcase.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
    if (name !== 'motion' || oldValue === newValue || !this.shadowRoot) return;
    this._show(this._idx, true);
    this._syncToggle();
    this._start();
  };

  Cani8x8Showcase.prototype.select = function (index) {
    if (typeof index !== 'number' || index < 0 || index >= FEATURES.length) return;
    this._show(index);
    this._start();
  };

  Cani8x8Showcase.prototype._wire = function () {
    var self = this;
    this._tabs.forEach(function (tab, index) {
      var click = function () { self.select(index); };
      var key = function (event) {
        var next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (self._idx + 1) % FEATURES.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (self._idx + FEATURES.length - 1) % FEATURES.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = FEATURES.length - 1;
        if (next === null) return;
        event.preventDefault();
        self.select(next);
        self._tabs[next].focus();
      };
      tab.addEventListener('click', click);
      tab.addEventListener('keydown', key);
      self._teardown.push(function () {
        tab.removeEventListener('click', click);
        tab.removeEventListener('keydown', key);
      });
    });

    var toggle = function () {
      self._paused = !self._paused;
      self._syncToggle();
      self._start();
    };
    this._toggle.addEventListener('click', toggle);
    this._teardown.push(function () { self._toggle.removeEventListener('click', toggle); });

    var visibility = function () {
      self._pageVisible = !document.hidden;
      self._start();
    };
    document.addEventListener('visibilitychange', visibility);
    this._teardown.push(function () { document.removeEventListener('visibilitychange', visibility); });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        self._inView = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.12;
        self.toggleAttribute('data-offscreen', !self._inView);
        self._start();
      }, { threshold: [0, 0.12, 0.5] });
      observer.observe(this);
      this._teardown.push(function () { observer.disconnect(); });
    } else {
      this._inView = true;
      this._start();
    }

    if (window.matchMedia) {
      var media = window.matchMedia('(prefers-reduced-motion: reduce)');
      var change = function () {
        self._show(self._idx, true);
        self._syncToggle();
        self._start();
      };
      if (media.addEventListener) media.addEventListener('change', change);
      else if (media.addListener) media.addListener(change);
      this._teardown.push(function () {
        if (media.removeEventListener) media.removeEventListener('change', change);
        else if (media.removeListener) media.removeListener(change);
      });
    }
  };

  Cani8x8Showcase.prototype._show = function (index, initial) {
    this._idx = index;
    this._panels.forEach(function (panel, i) {
      var active = i === index;
      panel.classList.toggle('active', active);
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    this._tabs.forEach(function (tab, i) {
      var active = i === index;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });
    this._scenes.forEach(function (scene, i) {
      scene.classList.toggle('active', i === index);
    });
    if (this._counter) this._counter.textContent = String(index + 1).padStart(2, '0');
    this._restartProgress(initial);
  };

  Cani8x8Showcase.prototype._restartProgress = function (initial) {
    if (!this._bar) return;
    this._bar.style.transition = 'none';
    this._bar.style.width = this._reduced() ? '100%' : '0';
    this._bar.getBoundingClientRect();
    if (!this._reduced() && !this._paused && this._inView && this._pageVisible) {
      this._bar.style.transition = 'width ' + PERIOD + 'ms linear';
      this._bar.style.width = '100%';
    } else if (initial && !this._reduced()) {
      this._bar.style.width = '0';
    }
  };

  Cani8x8Showcase.prototype._start = function () {
    this._stop();
    this._restartProgress();
    if (this._reduced() || this._paused || !this._inView || !this._pageVisible) return;
    var self = this;
    this._timer = setTimeout(function () {
      self._show((self._idx + 1) % FEATURES.length);
      self._start();
    }, PERIOD);
  };

  Cani8x8Showcase.prototype._stop = function () {
    if (this._timer) clearTimeout(this._timer);
    this._timer = null;
  };

  Cani8x8Showcase.prototype._syncToggle = function () {
    var reduced = this._reduced();
    this._toggle.disabled = reduced;
    this._toggle.setAttribute('aria-pressed', this._paused ? 'true' : 'false');
    this._toggle.setAttribute('aria-label', reduced ? 'Animation disabled by reduced motion' : (this._paused ? 'Play section animation' : 'Pause section animation'));
    this._toggle.firstElementChild.textContent = this._paused ? '\u25B6' : '\u2161';
    this._motionLabel.textContent = reduced ? 'Motion reduced' : (this._paused ? 'Play animation' : 'Pause animation');
  };

  /* Same Instrument Sans source and fallback strategy my.plan already proved.
   * Guarded on both ids so that when my.plan is on the page - as it is on the
   * homepage - this adds no second request. */
  var RV_FONT_ID = 'cani-work-fonts';
  var RV_FONT_HREF =
    'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&display=swap';
  function rvEnsureFont() {
    try {
      if (document.getElementById(RV_FONT_ID) || document.getElementById('cani-myplan-fonts')) return;
      var p1 = document.createElement('link');
      p1.rel = 'preconnect'; p1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(p1);
      var p2 = document.createElement('link');
      p2.rel = 'preconnect'; p2.href = 'https://fonts.gstatic.com'; p2.crossOrigin = '';
      document.head.appendChild(p2);
      var css = document.createElement('link');
      css.id = RV_FONT_ID; css.rel = 'stylesheet'; css.href = RV_FONT_HREF;
      document.head.appendChild(css);
    } catch (e) {}
  }

  /*
   * One-shot viewport-triggered entrance. Same four-state model and fail-open
   * contract as the accepted divider and my.plan implementations.
   * Wrappers only - no existing element is ever written.
   */
  function rvWrap(el, kind, list) {
    if (!el || !el.parentElement) return;
    var w = document.createElement('div');
    w.setAttribute('data-rvg', kind);
    el.parentElement.insertBefore(w, el);
    w.appendChild(el);
    list.push(w);
  }
  function rvBuildGroups(root) {
    var g = [];
    var copy = root.querySelector('.copy');
    if (copy) {
      // wrap each editorial block so the sequence reads heading -> intro ->
      // card -> tabs -> controls -> proof rather than one block fading in
      var order = ['h2', '.intro', '.feature-card', '.feature-nav', '.under-nav', '.actions', '.proof'];
      for (var i = 0; i < order.length; i++) rvWrap(copy.querySelector(order[i]), 'copy', g);
    }
    rvWrap(root.querySelector('.stage'), 'stage', g);
    return g;
  }
  function rvInZone(host) {
    var r = host.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!vh) return true;
    return r.top < vh * 0.9 && r.bottom > 0;
  }
  function rvInstall(host, root) {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      host.setAttribute('data-rv', 'static'); return;
    }
    if (typeof window.IntersectionObserver !== 'function' || typeof requestAnimationFrame !== 'function') {
      host.setAttribute('data-rv', 'static'); return;
    }
    if (rvInZone(host)) { host.setAttribute('data-rv', 'static');
      host.setAttribute('data-rv-reason', 'in-view-at-load'); return; }
    var groups = rvBuildGroups(root);
    if (!groups.length) { host.setAttribute('data-rv', 'static'); return; }
    for (var i = 0; i < groups.length; i++) {
      // the stage trails the copy rather than arriving with it
      var slot = groups[i].getAttribute('data-rvg') === 'stage' ? groups.length : i;
      groups[i].style.setProperty('--rv-d', Math.round(slot * 80) + 'ms');
    }
    var done = false, obs = null, grace = 0, tick = 0, guard = 0, onScroll = null;
    var settle = function () {
      if (done) return; done = true;
      if (grace) clearTimeout(grace);
      if (tick) cancelAnimationFrame(tick);
      if (obs) { obs.disconnect(); obs = null; }
      if (onScroll) { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); onScroll = null; }
      var toRevealing = function () {
        if (host.getAttribute('data-rv') !== 'armed') return;
        var gateWait = rvGate('work', 850);
        if (gateWait > 0) {
          setTimeout(function () {
            if (host.getAttribute('data-rv') !== 'armed') return;
            host.setAttribute('data-rv', 'revealing');
            try { setTimeout(function () { host.setAttribute('data-rv', 'revealed'); }, 2400); }
            catch (e) { host.setAttribute('data-rv', 'revealed'); }
          }, gateWait);
          return;
        }
        host.setAttribute('data-rv', 'revealing');
        try { setTimeout(function () { host.setAttribute('data-rv', 'revealed'); }, 2400); }
        catch (e) { host.setAttribute('data-rv', 'revealed'); }
      };
      try {
        void host.offsetHeight;
        requestAnimationFrame(function () {
          try { requestAnimationFrame(toRevealing); } catch (e) { toRevealing(); }
        });
        guard = setTimeout(toRevealing, 250);
      } catch (e) { host.setAttribute('data-rv', 'revealed'); }
    };
    try {
      host.setAttribute('data-rv', 'armed');
      obs = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++)
          if (entries[i].isIntersecting) { host.setAttribute('data-rv-reason', 'observed'); settle(); return; }
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
      obs.observe(host);
      onScroll = function () {
        if (done || tick) return;
        tick = requestAnimationFrame(function () {
          tick = 0; if (done) return;
          if (!rvInZone(host)) { if (grace) { clearTimeout(grace); grace = 0; } return; }
          if (!grace) grace = setTimeout(function () { host.setAttribute('data-rv-reason', 'watchdog'); settle(); }, 400);
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    } catch (e) { host.setAttribute('data-rv', 'revealed'); }
  }


  customElements.define(TAG, Cani8x8Showcase);
})();
