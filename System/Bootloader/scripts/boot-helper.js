// RQBBOX Phone Bootloader — Universal Bootstrap
(function() {
  const BOOT = {
    config: {
      serverPort: 19777,
      serverHost: window.location.hostname || '127.0.0.1',
    },

    // Detect phone brand/model from user agent
    detectPhone() {
      const ua = navigator.userAgent;
      const brands = [
        { id: 'google',    name: 'Google Pixel',      match: /Pixel|Google\s/ },
        { id: 'samsung',   name: 'Samsung Galaxy',     match: /SM-|Galaxy|Samsung/ },
        { id: 'oneplus',   name: 'OnePlus',            match: /OnePlus|ONEPLUS/ },
        { id: 'xiaomi',    name: 'Xiaomi',             match: /Xiaomi|Mi\s|Redmi|POCO/ },
        { id: 'oppo',      name: 'OPPO',               match: /OPPO|CPH/ },
        { id: 'vivo',      name: 'Vivo',               match: /Vivo|vivo/ },
        { id: 'huawei',    name: 'Huawei',             match: /Huawei|Honor/ },
        { id: 'nokia',     name: 'Nokia',              match: /Nokia|TA-/ },
        { id: 'sony',      name: 'Sony Xperia',        match: /Xperia|Sony/ },
        { id: 'lg',        name: 'LG',                 match: /LG-|LGE/ },
        { id: 'motorola',  name: 'Motorola',           match: /Moto|XT\d{4}/ },
        { id: 'microsoft', name: 'Microsoft Lumia',    match: /Lumia|RM-\d{4}/ },
        { id: 'htc',       name: 'HTC',                match: /HTC/ },
        { id: 'asus',      name: 'ASUS Zenfone',       match: /ASUS|Zenfone/ },
        { id: 'lenovo',    name: 'Lenovo',             match: /Lenovo/ },
        { id: 'realme',    name: 'Realme',             match: /Realme|RMX/ },
        { id: 'nothing',   name: 'Nothing Phone',      match: /Nothing|A063/ },
        { id: 'fairphone', name: 'Fairphone',          match: /Fairphone|FP/ },
      ];
      for (const b of brands) {
        if (b.match.test(ua)) return b;
      }
      return { id: 'generic', name: 'Android Device' };
    },

    // Detect OS
    detectOS() {
      const ua = navigator.userAgent;
      if (/Android/.test(ua))         return { os: 'android', label: 'Android' };
      if (/iPad|iPhone|iPod/.test(ua)) return { os: 'ios', label: 'iOS/iPadOS' };
      if (/Windows Phone/.test(ua))    return { os: 'wp', label: 'Windows Phone' };
      if (/KAIOS/.test(ua))           return { os: 'kaios', label: 'KaiOS' };
      if (/CrOS/.test(ua))            return { os: 'chromeos', label: 'ChromeOS' };
      return { os: 'unknown', label: 'Unknown' };
    },

    // Recommended boot method per OS
    getBootMethod(os) {
      const methods = {
        android:   { type: 'app',  label: 'Termux + Node.js',  steps: ['Install Termux from F-Droid', 'Install Node.js: pkg install nodejs', 'Run: node System/Server/server.js'] },
        ios:       { type: 'pwa',  label: 'Safari PWA',        steps: ['Open server URL in Safari', 'Tap Share → Add to Home Screen', 'Launch RQBBOX from home screen'] },
        wp:        { type: 'web',  label: 'Browser Access',    steps: ['Open Edge browser', 'Navigate to http://<server-ip>:19777', 'Pin to Start for quick access'] },
        kaios:     { type: 'web',  label: 'KaiOS Browser',     steps: ['Open Browser app', 'Navigate to http://<server-ip>:19777', 'Bookmark for quick access'] },
        chromeos:  { type: 'app',  label: 'Linux Container',   steps: ['Enable Linux in ChromeOS settings', 'Install Node.js: sudo apt install nodejs', 'Run: node System/Server/server.js'] },
        unknown:   { type: 'web',  label: 'Browser Web App',   steps: ['Open your browser', 'Navigate to http://<server-ip>:19777', 'Add to home screen if supported'] },
      };
      return methods[os] || methods.unknown;
    },

    // Get server URL
    getServerURL() {
      return `http://${this.config.serverHost}:${this.config.serverPort}`;
    },

    // Test connection to RQBBOX server
    async testConnection() {
      try {
        const r = await fetch(`${this.getServerURL()}/api/storage`, { signal: AbortSignal.timeout(3000) });
        return r.ok;
      } catch { return false; }
    },

    // Launch RQBBOX
    launch() {
      window.location.href = this.getServerURL();
    }
  };

  window.RQBBoot = BOOT;
})();
