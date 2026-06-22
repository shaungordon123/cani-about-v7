/*
 * cani-about-host — auto-height host for the Design 7 /about embed.
 * A Wix HtmlComponent (iframe) cannot be resized at runtime. A Wix Custom
 * Element is a real DOM element in page flow, so IT can grow. This element
 * hosts the exact proven safe-copy bundle in an iframe and resizes itself to
 * the bundle's true height (via postMessage). Pixel-identical Design 7, no
 * nested scrollbar, native page scroll, responsive auto-height. Zero copy/
 * fidelity risk: the visual payload is the unchanged bundle.
 * Wix Custom Element tag name must be: cani-about-host
 */
(function () {
  var TAG = 'cani-about-host';
  if (window.customElements && customElements.get(TAG)) return;
  var EMBED_URL = 'https://shaungordon123.github.io/cani-about-v7/embed.html';
  var EMBED_ORIGIN = 'https://shaungordon123.github.io';
  var MIN_H = 1200;

  function CaniAboutHost() { return Reflect.construct(HTMLElement, [], CaniAboutHost); }
  CaniAboutHost.prototype = Object.create(HTMLElement.prototype);
  CaniAboutHost.prototype.constructor = CaniAboutHost;

  CaniAboutHost.prototype.connectedCallback = function () {
    if (this._init) return; this._init = true;
    var self = this;
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.minHeight = MIN_H + 'px';

    var iframe = document.createElement('iframe');
    iframe.src = EMBED_URL;
    iframe.title = 'About Cani Communications';
    iframe.setAttribute('loading', 'eager');
    iframe.setAttribute('scrolling', 'no');
    iframe.style.cssText = 'display:block;width:100%;border:0;overflow:hidden;height:' + MIN_H + 'px;';
    this.appendChild(iframe);
    this._iframe = iframe;

    function applyHeight(h) {
      h = Math.ceil(h);
      if (!h || h < 100) return;
      iframe.style.height = h + 'px';
      self.style.height = h + 'px';
      self.style.minHeight = h + 'px';
    }
    function onMessage(ev) {
      if (ev.origin !== EMBED_ORIGIN) return;
      var d = ev.data;
      if (d && d.type === 'cani-embed-height' && typeof d.height === 'number') applyHeight(d.height);
    }
    window.addEventListener('message', onMessage);
    iframe.addEventListener('load', function () {
      try { iframe.contentWindow.postMessage({ type: 'cani-request-height' }, EMBED_ORIGIN); } catch (e) {}
    });
  };
  customElements.define(TAG, CaniAboutHost);
})();
