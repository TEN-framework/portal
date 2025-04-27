(function() {
  const pixelID = '1295f95b-eaaa-4f5c-8861-825c0e350978';
  let lastHref = null;

  function sendScarfPing() {
    const currentHref = window.location.href;
    if (currentHref === lastHref) return;
    lastHref = currentHref;

    const url = `https://static.scarf.sh/a.png?x-pxid=${pixelID}`;
    const img = new Image();
    img.referrerPolicy = 'no-referrer-when-downgrade';
    img.src = url;
  }

  ['pushState', 'replaceState'].forEach(fn => {
    const original = history[fn];
    history[fn] = function() {
      original.apply(this, arguments);
      window.dispatchEvent(new Event('scarf:locationchange'));
    };
  });

  window.addEventListener('hashchange', sendScarfPing);
  window.addEventListener('popstate', sendScarfPing);
  window.addEventListener('scarf:locationchange', sendScarfPing);

  sendScarfPing();
})();
