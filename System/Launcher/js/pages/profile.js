const ProfilePage = {
  render() {
    const el = RQB.$('#page-profile');
    const user = RQB.state.currentUser;
    const s = user ? Stats.ensure(user) : null;
    const profiles = RQBBOX_DATA.profiles?.users || [];
    const allSessions = RQBBOX_DATA.profiles?.sessions || [];
    const sessions = allSessions.filter(ses => ses.userId === user?.id) || [];
    const installed = RQBBOX_DATA.profiles?.installed || { games: [], apps: [] };
    const store = RQBBOX_DATA.store;
    const downloads = RQBBOX_DATA.profiles?.downloads || [];
    const notifs = RQBBOX_DATA.profiles?.notifications || [];
    const installedGames = (installed.games || []).map(id => store?.games?.find(g => g.id === id)).filter(Boolean);
    const installedApps = (installed.apps || []).map(id => store?.apps?.find(a => a.id === id)).filter(Boolean);
    const gamerscore = ((s?._achNames?.length || 0) * 50) + ((s?.gamesLaunched || 0) * 10);
    const profilePct = Math.min(100, Math.round(
      ((s?.gamesLaunched > 0 ? 15 : 0) + (s?.appsLaunched > 0 ? 10 : 0) +
      (s?.achievements > 0 ? 20 : 0) + (user?.email ? 15 : 0) +
      (user?.pin ? 10 : 0) + (user?.avatar ? 10 : 0) +
      ((s?.storeInstalls || 0) > 0 ? 10 : 0) + ((s?.aiImages || 0) > 0 ? 5 : 0) +
      ((s?.screenshots || 0) > 0 ? 5 : 0))
    ));
    const rank = profilePct >= 80 ? 'Elite' : profilePct >= 50 ? 'Veteran' : profilePct >= 25 ? 'Gamer' : 'Rookie';
    const recentActivity = [
      ...(downloads || []).map(d => ({ type: 'download', text: `Installed ${d.title}`, time: d.completedAt })),
      ...(notifs || []).map(n => ({ type: 'notif', text: `${n.title}: ${n.message}`, time: n.time })),
    ].sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0)).slice(0, 10);

    el.innerHTML = `
      <div style="display:grid;grid-template-columns:320px 1fr;gap:24px;">
        <!-- LEFT: Profile Card + Security -->
        <div style="display:flex;flex-direction:column;gap:16px;">
          <div class="settings-panel" style="text-align:center;padding:24px;">
            <div class="profile-avatar" style="width:96px;height:96px;font-size:2.5rem;margin:0 auto 12px;cursor:pointer;" id="acct-avatar" title="Click to change avatar">${user?.avatar || 'P'}</div>
            <h2 id="acct-name-display" style="font-size:1.3rem;">${user?.name || 'Player'}</h2>
            <p style="font-size:0.8rem;background:rgba(0,212,255,0.1);padding:2px 12px;border-radius:10px;display:inline-block;margin:4px 0;">@${user?.username || ''}</p>
            <p style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;">${user?.role || 'Member'} · ${user?.email || 'No email'}</p>
            <div style="margin-top:12px;display:flex;justify-content:center;gap:16px;">
              <div style="text-align:center;"><div style="font-size:1.3rem;font-weight:700;color:var(--neon-blue);">${gamerscore}</div><div style="font-size:0.6rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Score</div></div>
              <div style="text-align:center;"><div style="font-size:1.3rem;font-weight:700;color:var(--neon-purple);">${rank}</div><div style="font-size:0.6rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Rank</div></div>
              <div style="text-align:center;"><div style="font-size:1.3rem;font-weight:700;color:var(--neon-cyan);">${profilePct}%</div><div style="font-size:0.6rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;">Complete</div></div>
            </div>
            <!-- Profile completion bar -->
            <div style="margin-top:12px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;">
              <div style="height:100%;width:${profilePct}%;background:linear-gradient(90deg,var(--neon-blue),var(--neon-purple));border-radius:2px;transition:width 0.5s;"></div>
            </div>
            <div style="margin-top:16px;display:flex;flex-direction:column;gap:6px;">
              <button class="btn btn-primary btn-sm" style="width:100%;" onclick="ProfilePage.showEdit()">✏️ Edit Account</button>
              <button class="btn btn-ghost btn-sm" style="width:100%;" onclick="ProfilePage.switchProfile()">🔄 Switch Profile</button>
              <button class="btn btn-ghost btn-sm" style="width:100%;" onclick="ProfilePage.signOut()">🚪 Sign Out</button>
              <button class="btn btn-ghost btn-sm" style="width:100%;color:var(--neon-pink);border-color:rgba(255,0,170,0.3);" onclick="ProfilePage.signOutAll()">🔒 Sign Out All Devices</button>
            </div>
          </div>

          <!-- Account Security -->
          <div class="settings-panel" style="padding:20px;">
            <h4 style="font-size:0.85rem;margin-bottom:12px;display:flex;align-items:center;gap:6px;">🔒 Account Security</h4>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">PIN Protection</span><span style="font-size:0.8rem;color:${user?.pin ? 'var(--neon-cyan)' : 'var(--text-muted)'};">${user?.pin ? '✅ Enabled' : '❌ Not set'}</span></div>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">Email Verified</span><span style="font-size:0.8rem;color:${user?.email ? 'var(--neon-cyan)' : 'var(--text-muted)'};">${user?.email ? '✅ Set' : '❌ Not set'}</span></div>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">Active Sessions</span><span style="font-size:0.8rem;color:var(--neon-blue);">${sessions.length}</span></div>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">Account ID</span><span style="font-size:0.65rem;color:var(--text-muted);font-family:monospace;">${user?.id || '—'}</span></div>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">Theme</span><span style="font-size:0.8rem;color:var(--text-muted);">${user?.theme || 'neon-dark'}</span></div>
          </div>

          <!-- Device Info -->
          <div class="settings-panel" style="padding:20px;">
            <h4 style="font-size:0.85rem;margin-bottom:12px;display:flex;align-items:center;gap:6px;">💻 Device</h4>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">Platform</span><span style="font-size:0.8rem;color:var(--text-muted);">${navigator.platform || 'Unknown'}</span></div>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">User Agent</span><span style="font-size:0.65rem;color:var(--text-muted);font-family:monospace;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${navigator.userAgent?.substring(0, 50) || 'Unknown'}</span></div>
            <div class="setting-row" style="padding:8px 0;"><span style="font-size:0.8rem;color:var(--text-secondary);">API Status</span><span style="font-size:0.8rem;color:${RQBApi.online ? 'var(--neon-cyan)' : 'var(--neon-pink)'};">${RQBApi.online ? '🟢 Online' : '🔴 Offline'}</span></div>
          </div>
        </div>

        <!-- RIGHT: Everything else -->
        <div style="display:flex;flex-direction:column;gap:20px;">
          <!-- Stats -->
          <div class="section-header" style="margin-bottom:8px;"><h3>Live Stats</h3></div>
          <div class="widget-row" style="grid-template-columns:repeat(4,1fr);margin-bottom:0;">
            <div class="widget compact"><div class="widget-value">${s?.sessions || 0}</div><div class="widget-label">Sessions</div></div>
            <div class="widget compact"><div class="widget-value" id="profile-stat-games">${s?.gamesLaunched || 0}</div><div class="widget-label">Games Launched</div></div>
            <div class="widget compact"><div class="widget-value" id="profile-stat-apps">${s?.appsLaunched || 0}</div><div class="widget-label">Apps Launched</div></div>
            <div class="widget compact"><div class="widget-value" id="profile-stat-achievements">${s?.achievements || 0}</div><div class="widget-label">Achievements</div></div>
          </div>
          <div class="widget-row" style="grid-template-columns:repeat(4,1fr);margin-bottom:0;">
            <div class="widget compact"><div class="widget-value" id="profile-stat-minutes">${s ? Stats.formatTime(s.minutesActive) : '0m'}</div><div class="widget-label">Time Active</div></div>
            <div class="widget compact"><div class="widget-value">${s?.storeInstalls || 0}</div><div class="widget-label">Store Installs</div></div>
            <div class="widget compact"><div class="widget-value">${s?.aiImages || 0}</div><div class="widget-label">AI Images</div></div>
            <div class="widget compact"><div class="widget-value">${s?.screenshots || 0}</div><div class="widget-label">Screenshots</div></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:4px;flex-wrap:wrap;">
            <span style="font-size:0.7rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:8px;">🎮 ${s?.gamesLaunched || 0} games played</span>
            <span style="font-size:0.7rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:8px;">📱 ${s?.appsLaunched || 0} apps used</span>
            <span style="font-size:0.7rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:8px;">🏆 ${s?.achievements || 0} achievements</span>
            <span style="font-size:0.7rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:8px;">⏱️ ${s ? Stats.formatTime(s.minutesActive) : '0m'} active</span>
            <span style="font-size:0.7rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:8px;">⬇️ ${s?.storeInstalls || 0} installs</span>
            <span style="font-size:0.7rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:8px;">🤖 ${s?.aiImages || 0} AI images</span>
            <span style="font-size:0.7rem;color:var(--text-muted);background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:8px;">📷 ${s?.screenshots || 0} screenshots</span>
          </div>

          <!-- Achievements -->
          <div class="section-header" style="margin-bottom:8px;"><h3>🏆 Achievements (${(s?._achNames||[]).length})</h3></div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);margin-bottom:4px;">
            ${(s?._achNames||[]).length ? (s._achNames.map(a => `<span style="padding:8px 16px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:14px;font-size:0.85rem;color:var(--neon-blue);display:flex;align-items:center;gap:6px;">🏆 ${a} <span style="font-size:0.6rem;color:var(--text-muted);">+50</span></span>`).join('')) : '<p style="font-size:0.85rem;color:var(--text-muted);padding:12px 0;">No achievements yet. Play games and explore to unlock them! Each achievement is worth 50 gamerscore.</p>'}
          </div>

          <!-- Installed Library -->
          <div class="section-header" style="margin-bottom:8px;"><h3>📚 Library (${installedGames.length + installedApps.length} items)</h3></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:4px;">
            <div style="padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;display:flex;align-items:center;gap:6px;">🎮 Games (${installedGames.length})</div>
              ${installedGames.length ? installedGames.map(g => `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.85rem;"><span>${g.banner || '🎮'}</span><span style="flex:1;">${g.title}</span><span style="font-size:0.7rem;color:var(--neon-cyan);">●</span></div>`).join('') : '<p style="font-size:0.8rem;color:var(--text-muted);">No games installed</p>'}
            </div>
            <div style="padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:8px;display:flex;align-items:center;gap:6px;">📱 Apps (${installedApps.length})</div>
              ${installedApps.length ? installedApps.map(a => `<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.85rem;"><span>${a.banner || '📱'}</span><span style="flex:1;">${a.title}</span><span style="font-size:0.7rem;color:var(--neon-cyan);">●</span></div>`).join('') : '<p style="font-size:0.8rem;color:var(--text-muted);">No apps installed</p>'}
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="section-header" style="margin-bottom:8px;"><h3>📋 Recent Activity</h3></div>
          <div style="padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);max-height:200px;overflow-y:auto;">
            ${recentActivity.length ? recentActivity.map(a => `
              <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:0.8rem;">
                <span style="font-size:0.9rem;">${a.type === 'download' ? '⬇️' : '🔔'}</span>
                <div style="flex:1;"><span style="color:var(--text-secondary);">${a.text}</span></div>
                <span style="font-size:0.65rem;color:var(--text-muted);white-space:nowrap;">${a.time ? (typeof a.time === 'string' && a.time.includes('T') ? new Date(a.time).toLocaleDateString() : a.time) : ''}</span>
              </div>
            `).join('') : '<p style="font-size:0.8rem;color:var(--text-muted);">No recent activity</p>'}
          </div>

          <!-- Active Sessions -->
          <div class="section-header" style="margin-bottom:8px;"><h3>🌐 Active Sessions (${sessions.length})</h3></div>
          <div style="padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);margin-bottom:4px;">
${sessions.length ? sessions.slice(0,5).map(ses => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
                <div style="display:flex;align-items:center;gap:10px;">
                  <span style="font-size:1.1rem;">💻</span>
                  <div><div style="font-size:0.85rem;">${ses.device || 'Unknown device'}</div><div style="font-size:0.65rem;color:var(--text-muted);">${ses.createdAt ? new Date(ses.createdAt).toLocaleString() : 'Unknown'}</div></div>
                </div>
                <span style="font-size:0.65rem;color:var(--neon-cyan);">● Active</span>
              </div>
            `).join('') : '<p style="font-size:0.8rem;color:var(--text-muted);">No active sessions.</p>'}
          </div>

          <!-- All Profiles -->
          <div class="section-header" style="margin-bottom:8px;"><h3>👥 All Profiles (${profiles.length})</h3></div>
          <div class="profile-grid" id="all-profiles" style="justify-content:flex-start;margin:0;"></div>
        </div>
      </div>

      <!-- Edit Account Modal -->
      <div class="modal-overlay" id="edit-acct-modal" style="display:none;">
        <div class="auth-panel" style="position:relative;">
          <button class="modal-close" onclick="ProfilePage.hideEdit()">✕</button>
          <h2>Edit Account</h2>
          <p class="subtitle">Update your RhysTech profile</p>
          <div id="edit-error" style="background:rgba(255,0,0,0.1);border:1px solid rgba(255,0,0,0.2);color:#ff6b6b;padding:10px 16px;border-radius:8px;font-size:0.85rem;margin-bottom:16px;display:none;"></div>
          <form id="edit-form">
            <div class="form-group"><label>Display Name</label><input type="text" id="edit-name" value="${user?.name || ''}" required></div>
            <div class="form-group"><label>Username</label><input type="text" id="edit-username" value="${user?.username || ''}" required></div>
            <div class="form-group"><label>Email</label><input type="email" id="edit-email" value="${user?.email || ''}" placeholder="email@example.com"></div>
            <div class="form-group"><label>New Password (leave blank to keep current)</label><input type="password" id="edit-pass" placeholder="New password"></div>
            <div class="form-group"><label>Avatar Character</label><input type="text" id="edit-avatar" value="${user?.avatar || 'P'}" maxlength="1" style="text-align:center;font-size:1.5rem;font-weight:700;"></div>
            <button type="submit" class="btn btn-primary">💾 Save Changes</button>
          </form>
        </div>
      </div>`;

    // Edit form handler
    const editForm = el.querySelector('#edit-form');
    if (editForm) {
      editForm.onsubmit = async (e) => {
        e.preventDefault();
        const errEl = el.querySelector('#edit-error');
        errEl.style.display = 'none';
        const name = el.querySelector('#edit-name').value.trim();
        const username = el.querySelector('#edit-username').value.trim();
        const email = el.querySelector('#edit-email').value.trim();
        const password = el.querySelector('#edit-pass').value;
        const avatar = el.querySelector('#edit-avatar').value.trim().toUpperCase() || user?.avatar || 'P';
        if (!name || !username) { errEl.textContent = 'Name and username are required'; errEl.style.display = 'block'; return; }
        const token = RQBBOX_DATA.profiles?.users?.find(u => u.id === user?.id)?.token;
        if (RQBApi.online && token) {
          const res = await RQBApi.updateAccount(token, { name, username, email, password: password || undefined, avatar });
          if (res.ok) {
            RQB.state.currentUser = res.user;
            localStorage.setItem('rqbbox_user', JSON.stringify(res.user));
            RQB.$('#user-avatar').textContent = res.user.avatar || avatar;
            ProfilePage.hideEdit();
            ProfilePage.render();
            RQB.toast('Account updated');
          } else {
            errEl.textContent = res.error || 'Update failed';
            errEl.style.display = 'block';
          }
        } else {
          if (user) { user.name = name; user.username = username; user.email = email; user.avatar = avatar; if (password) user.pin = password; }
          localStorage.setItem('rqbbox_user', JSON.stringify(user));
          RQB.$('#user-avatar').textContent = avatar;
          ProfilePage.hideEdit();
          ProfilePage.render();
          RQB.toast('Account updated locally');
        }
      };
    }

    // Avatar click randomize
    const avatarEl = el.querySelector('#acct-avatar');
    if (avatarEl) {
      avatarEl.onclick = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const newAvatar = chars[Math.floor(Math.random() * chars.length)];
        if (user) { user.avatar = newAvatar; ProfilePage.render(); RQB.$('#user-avatar').textContent = newAvatar; saveProfiles(); RQB.toast(`Avatar changed to "${newAvatar}"`); }
      };
    }

    // Profile grid
    const grid = el.querySelector('#all-profiles');
    if (grid) {
      profiles.filter(p => p.id !== user?.id).forEach(p => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        const ps = p.stats || {};
        card.innerHTML = `<div class="profile-avatar">${p.avatar}</div><div class="name">${p.name}</div><div class="role">${ps.achievements || 0} achievements</div><div style="font-size:0.65rem;color:var(--text-muted);margin-top:4px;">@${p.username || ''}</div>`;
        card.onclick = () => { RQB.state.currentUser = p; localStorage.setItem('rqbbox_user', JSON.stringify(p)); RQB.$('#user-avatar').textContent = p.avatar; RQB.$('#user-name').textContent = p.name; ProfilePage.render(); RQB.toast(`Switched to ${p.name}`); };
        grid.appendChild(card);
      });
    }
  },

  showEdit() { const m = RQB.$('#edit-acct-modal'); if (m) m.style.display = 'flex'; },
  hideEdit() { const m = RQB.$('#edit-acct-modal'); if (m) m.style.display = 'none'; },

  switchProfile() { RQB.$('#main-shell').classList.remove('active'); Boot.showProfiles(); },

  async signOut() {
    if (RQBAudio && RQBAudio.signout) RQBAudio.signout();
    if (Stats.timer) clearInterval(Stats.timer);
    const token = RQBBOX_DATA.profiles?.users?.find(u => u.id === RQB.state.currentUser?.id)?.token;
    if (token && RQBApi.online) await RQBApi.signout(token);
    localStorage.removeItem('rqbbox_user'); RQB.state.currentUser = null;
    RQB.$('#main-shell').classList.remove('active'); RQB.showScreen('welcome-screen'); RQB.toast('Signed out');
  },

  async signOutAll() {
    if (RQBAudio && RQBAudio.signout) RQBAudio.signout();
    if (!confirm('Sign out of all devices? This will end your session everywhere.')) return;
    if (Stats.timer) clearInterval(Stats.timer);
    const token = RQBBOX_DATA.profiles?.users?.find(u => u.id === RQB.state.currentUser?.id)?.token;
    if (token && RQBApi.online) await RQBApi.signoutAll(token);
    localStorage.removeItem('rqbbox_user'); RQB.state.currentUser = null;
    RQB.$('#main-shell').classList.remove('active'); RQB.showScreen('welcome-screen'); RQB.toast('Signed out of all devices');
  }
};
