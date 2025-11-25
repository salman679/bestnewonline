import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useFacebookPixel(pixelId) {
  const location = useLocation();

  useEffect(() => {
    if (!pixelId) return; // pixelId না থাকলে কিছু করবে না

    // Load FB Pixel script once if not loaded
    if (!window.fbq) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );
    }

    // Init with the current pixelId (even if fbq exists already, init again)
    window.fbq('init', pixelId);

    // Send PageView event on route change
    window.fbq('track', 'PageView');
  }, [pixelId, location.pathname]);
}
