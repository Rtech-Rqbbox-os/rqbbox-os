/* RQBBOX OS - Live Stats (start at 0, grow with usage) */
const Stats = {
  timer: null,

  ensure(user) {
    if (!user.stats) {
      user.stats = {
        sessions: 0, minutesActive: 0, gamesLaunched: 0, appsLaunched: 0,
        achievements: 0, storeInstalls: 0, screenshots: 0, aiImages: 0
      };
    }
    user.achievements = user.stats.achievements;
    user.playTime = Stats.formatTime(user.stats.minutesActive);
    return user.stats;
  },

  getUser() {
    const u = RQB.state.currentUser;
    if (!u) return null;
    const pu = RQBBOX_DATA.profiles?.users?.find(x => x.id === u.id);
    if (pu) {
      RQB.state.currentUser = pu;
      return Stats.ensure(pu);
    }
    return Stats.ensure(u);
  },

  formatTime(mins) {
    if (mins < 1) return '0m';
    if (mins < 60) return mins + 'm';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  },

  async track(event, amount = 1) {
    const s = Stats.getUser();
    if (!s) return;

    switch (event) {
      case 'session': s.sessions += amount; Stats.grantAchievement('First Boot', s.sessions >= 1); break;
      case 'minute': s.minutesActive += amount; break;
      case 'gameLaunch': s.gamesLaunched += amount; Stats.grantAchievement('First Game', s.gamesLaunched >= 1); Stats.grantAchievement('Gamer', s.gamesLaunched >= 5); break;
      case 'appLaunch': s.appsLaunched += amount; Stats.grantAchievement('App Explorer', s.appsLaunched >= 1); break;
      case 'storeInstall': s.storeInstalls += amount; Stats.grantAchievement('Collector', s.storeInstalls >= 3); break;
      case 'screenshot': s.screenshots += amount; break;
      case 'aiImage': s.aiImages += amount; Stats.grantAchievement('AI Artist', s.aiImages >= 1); break;
      case 'navigate': break;
    }

    const u = RQB.state.currentUser;
    u.achievements = s.achievements;
    u.playTime = Stats.formatTime(s.minutesActive);

    await saveProfiles();
    Stats.updateUI();
  },

  grantAchievement(name, earned) {
    if (!earned) return;
    const s = Stats.getUser();
    if (!s) return;
    s._achNames = s._achNames || [];
    if (s._achNames.includes(name)) return;
    s._achNames.push(name);
    s.achievements = s._achNames.length;
    if (RQBAudio && RQBAudio.achievement) RQBAudio.achievement();
    RQB.toast(`Achievement unlocked: ${name}!`);
  },

  startSessionTimer() {
    if (Stats.timer) clearInterval(Stats.timer);
    Stats.timer = setInterval(() => Stats.track('minute', 1), 60000);
  },

  animateEl(el, target, suffix = '') {
    if (!el) return;
    const start = parseInt(el.textContent, 10) || 0;
    const end = typeof target === 'number' ? target : 0;
    if (start === end) { el.textContent = end + suffix; return; }
    const steps = 20;
    let step = 0;
    const iv = setInterval(() => {
      step++;
      const val = Math.round(start + (end - start) * (step / steps));
      el.textContent = val + suffix;
      if (step >= steps) clearInterval(iv);
    }, 30);
  },

  updateUI() {
    const s = Stats.getUser();
    if (!s) return;

    Stats.animateEl(RQB.$('#stat-games'), s.gamesLaunched);
    Stats.animateEl(RQB.$('#stat-apps'), s.appsLaunched);
    Stats.animateEl(RQB.$('#stat-achievements'), s.achievements);
    Stats.animateEl(RQB.$('#stat-minutes'), s.minutesActive, 'm');

    const hero = RQB.$('#hero-stats');
    if (hero) hero.textContent = `${s.gamesLaunched} games · ${s.appsLaunched} apps · ${Stats.formatTime(s.minutesActive)} active`;

    if (RQB.state.currentPage === 'profile' && typeof ProfilePage !== 'undefined') ProfilePage.render();
  },

  onLogin() {
    if (Stats._sessionStarted) return;
    Stats._sessionStarted = true;
    Stats.track('session', 1);
    Stats.startSessionTimer();
  }
};
