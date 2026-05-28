/* RQBBOX OS - System Status Bar (battery, WiFi, Bluetooth, controller) */
const SysBar = {
  batteryLevel: -1,
  batteryCharging: false,
  wifiSSID: '',
  wifiSignal: 0,
  wifiConnected: false,
  bluetoothOn: false,
  btCount: 0,
  controllerCount: 0,
  controllerConnected: false,

  async init() {
    this.injectHTML();
    await this.refreshAll();
    setInterval(() => this.refreshAll(), 15000);
    if (navigator.getBattery) {
      try {
        const bat = await navigator.getBattery();
        bat.addEventListener('levelchange', () => this.updateBatteryUI(bat.level * 100, bat.charging));
        bat.addEventListener('chargingchange', () => this.updateBatteryUI(bat.level * 100, bat.charging));
        if (bat.level !== undefined) {
          this.batteryLevel = Math.round(bat.level * 100);
          this.batteryCharging = bat.charging;
        }
      } catch {}
    }
    window.addEventListener('online', () => this.refreshAll());
    window.addEventListener('offline', () => this.refreshAll());
  },

  injectHTML() {
    const container = document.querySelector('.top-icons');
    if (!container) return;
    container.insertAdjacentHTML('afterbegin', `
      <div class="sysbar-icons" id="sysbar">
        <span class="sysbar-item" id="sysbar-battery" title="Battery — click for details" onclick="SysBar.showDetails()">🔋 --</span>
        <span class="sysbar-item" id="sysbar-wifi" title="Network">📶 --</span>
        <span class="sysbar-item" id="sysbar-bluetooth" title="Bluetooth">🔵 --</span>
        <span class="sysbar-item" id="sysbar-controller" title="Controller">🎮 --</span>
      </div>
    `);
  },

  async refreshAll() {
    await Promise.all([this.refreshBattery(), this.refreshNetwork(), this.refreshBluetooth(), this.refreshController()]);
  },

  async refreshBattery() {
    const el = document.getElementById('sysbar-battery');
    if (!el) return;
    try {
      if (navigator.getBattery) {
        const bat = await navigator.getBattery();
        this.batteryLevel = Math.round(bat.level * 100);
        this.batteryCharging = bat.charging;
      } else if (RQBApi.online) {
        const data = await RQBApi.get('/api/battery');
        if (data.ok) { this.batteryLevel = data.level; this.batteryCharging = data.charging; }
      }
    } catch {}
    this.updateBatteryUI(this.batteryLevel, this.batteryCharging);
  },

  updateBatteryUI(level, charging) {
    const el = document.getElementById('sysbar-battery');
    if (!el) return;
    let icon = '🔋';
    if (level < 0) { icon = '⚡'; el.textContent = `${icon} AC`; el.title = 'Desktop mode (no battery)'; return; }
    if (charging) icon = level >= 80 ? '⚡' : '🔌';
    else if (level <= 10) icon = '🪫';
    else if (level <= 25) icon = '🔋';
    else icon = '🔋';
    const color = level <= 10 ? '#ff6b6b' : level <= 25 ? '#ffd700' : '#00ffc8';
    el.textContent = `${icon} ${level}%`;
    el.title = charging ? `Charging — ${level}%` : `Battery — ${level}%`;
    el.style.color = color;
  },

  async refreshNetwork() {
    const el = document.getElementById('sysbar-wifi');
    if (!el) return;
    try {
      if (!navigator.onLine) {
        this.wifiConnected = false;
        el.textContent = '📶 Offline';
        el.title = 'No network connection';
        el.style.color = '#ff6b6b';
        return;
      }
      this.wifiConnected = true;
      if (RQBApi.online) {
        const data = await RQBApi.get('/api/network');
        if (data.ok) {
          this.wifiSSID = data.ssid || '';
          this.wifiSignal = data.signal || 0;
          this.wifiConnected = data.connected || !!data.ip;
        }
      }
    } catch { this.wifiConnected = navigator.onLine; }
    const label = this.wifiSSID ? this.wifiSSID.substring(0, 14) + (this.wifiSSID.length > 14 ? '…' : '') : (this.wifiConnected ? 'Online' : 'Offline');
    const bars = this.wifiSignal > 70 ? '█' : this.wifiSignal > 30 ? '▆' : '▃';
    const signalIcon = `<span style="color:${this.wifiSignal > 50 ? '#00d4ff' : this.wifiSignal > 20 ? '#ffaa00' : '#ff6b6b'}">${bars}</span>`;
    el.innerHTML = `${signalIcon} ${label}`;
    el.title = this.wifiSSID ? `WiFi: ${this.wifiSSID} (${this.wifiSignal}%)` : (this.wifiConnected ? 'Connected (wired)' : 'Offline');
    el.style.color = this.wifiConnected ? '#00d4ff' : '#ff6b6b';
  },

  async refreshBluetooth() {
    const el = document.getElementById('sysbar-bluetooth');
    if (!el) return;
    try {
      if (navigator.bluetooth && navigator.bluetooth.getAvailability) {
        const available = await navigator.bluetooth.getAvailability();
        this.bluetoothOn = available;
        this.btCount = available ? 1 : 0;
      }
      if (RQBApi.online) {
        const data = await RQBApi.get('/api/bluetooth');
        if (data.ok) { this.bluetoothOn = data.enabled; this.btCount = data.count; }
      }
    } catch {}
    el.textContent = `🔵 ${this.bluetoothOn ? `${this.btCount} device${this.btCount !== 1 ? 's' : ''}` : 'Off'}`;
    el.title = this.bluetoothOn ? `Bluetooth ON — ${this.btCount} device${this.btCount !== 1 ? 's' : ''}` : 'Bluetooth OFF';
    el.style.color = this.bluetoothOn ? '#00d4ff' : '#5a6a8a';
  },

  async refreshController() {
    const el = document.getElementById('sysbar-controller');
    if (!el) return;
    try {
      if (RQBApi.online) {
        const data = await RQBApi.get('/api/controller');
        if (data.ok) { this.controllerConnected = data.connected; this.controllerCount = data.count; }
      }
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = Array.from(gamepads).find(g => g);
      if (pad) {
        this.controllerConnected = true;
        this.controllerCount = 1;
      }
    } catch {}
    el.textContent = `🎮 ${this.controllerConnected ? `${this.controllerCount} connected` : 'None'}`;
    el.title = this.controllerConnected ? `Controller${this.controllerCount > 1 ? 's' : ''} connected` : 'No controller';
    el.style.color = this.controllerConnected ? '#00ffc8' : '#5a6a8a';
  },

  showDetails() {
    RQB.toast(`⚡ ${this.batteryLevel >= 0 ? `${this.batteryLevel}% ${this.batteryCharging ? '(charging)' : ''}` : 'Desktop power'}
📶 ${this.wifiSSID || (this.wifiConnected ? 'Online' : 'Offline')}
🔵 Bluetooth: ${this.bluetoothOn ? `ON (${this.btCount} devices)` : 'OFF'}
🎮 Controller: ${this.controllerConnected ? 'Connected' : 'None'}`);
  }
};
