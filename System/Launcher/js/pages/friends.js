/* RQBBOX OS — Friends List */
const FriendsPage = {
  tab: 'list',

  async render() {
    const el = RQB.$('#page-friends');
    const user = RQB.state.currentUser;
    const token = user?.id ? RQBBOX_DATA.profiles?.users?.find(u => u.id === user.id)?.token : null;

    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:24px;">
        <div style="flex:1;"><div class="section-header" style="margin-bottom:0;"><h3>👥 Friends</h3></div></div>
        <button class="btn btn-ghost btn-sm ${this.tab === 'list' ? 'active' : ''}" onclick="FriendsPage.switchTab('list')">My Friends</button>
        <button class="btn btn-ghost btn-sm ${this.tab === 'requests' ? 'active' : ''}" onclick="FriendsPage.switchTab('requests')">Requests</button>
        <button class="btn btn-ghost btn-sm ${this.tab === 'search' ? 'active' : ''}" onclick="FriendsPage.switchTab('search')">Add Friend</button>
      </div>
      <div id="friends-content"></div>`;

    await this.renderTab();
  },

  switchTab(tab) {
    this.tab = tab;
    this.render();
  },

  async renderTab() {
    const content = RQB.$('#friends-content');
    const user = RQB.state.currentUser;
    if (!user) { content.innerHTML = '<p style="color:var(--text-muted);">Sign in to use friends</p>'; return; }

    if (this.tab === 'list') await this.renderList(content);
    else if (this.tab === 'requests') await this.renderRequests(content);
    else if (this.tab === 'search') await this.renderSearch(content);
  },

  async renderList(container) {
    const user = RQB.state.currentUser;
    let friends = user.friends || [];
    let requests = user.friendRequests || [];

    // Try to fetch from server
    if (RQBApi.online) {
      const res = await RQBApi.friends(user.id);
      if (res.ok) {
        friends = res.friends || [];
        requests = res.requests || [];
        // Cache locally
        user.friends = friends;
        user.friendRequests = requests;
      }
    }

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 280px;gap:20px;">
        <div>
          <div style="padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">${friends.length} friend${friends.length !== 1 ? 's' : ''}</div>
            ${friends.length ? friends.map(f => `
              <div class="friend-item">
                <div class="friend-avatar">${f.avatar || '?'}</div>
                <div class="friend-info">
                  <div class="friend-name">${f.name}</div>
                  <div style="display:flex;align-items:center;gap:4px;font-size:0.7rem;">
                    <span style="width:6px;height:6px;border-radius:50%;background:${f.online ? 'var(--neon-cyan)' : 'var(--text-muted)'};display:inline-block;"></span>
                    <span style="color:${f.online ? 'var(--neon-cyan)' : 'var(--text-muted)'};">${f.online ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <button class="btn btn-ghost btn-sm" onclick="FriendsPage.removeFriend('${f.id}')" style="color:var(--neon-pink);border-color:rgba(255,0,170,0.2);">Remove</button>
              </div>
            `).join('') : '<p style="font-size:0.85rem;color:var(--text-muted);padding:20px 0;text-align:center;">No friends yet. Search for players to add!</p>'}
          </div>
        </div>
        <div>
          <div style="padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);">
            <h4 style="font-size:0.85rem;margin-bottom:12px;display:flex;align-items:center;gap:6px;">📨 Pending Requests ${requests.length ? `<span style="background:var(--neon-pink);color:#fff;border-radius:10px;padding:0 8px;font-size:0.7rem;">${requests.length}</span>` : ''}</h4>
            ${requests.length ? requests.map(r => `
              <div class="friend-item" style="border-bottom:1px solid rgba(255,255,255,0.04);padding:10px 0;">
                <div class="friend-avatar">${r.avatar || '?'}</div>
                <div class="friend-info" style="flex:1;">
                  <div class="friend-name" style="font-size:0.85rem;">${r.name}</div>
                  <div style="font-size:0.65rem;color:var(--text-muted);">Wants to be friends</div>
                </div>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-primary btn-sm" onclick="FriendsPage.acceptFriend('${r.from}')" style="padding:6px 12px;font-size:0.7rem;">Accept</button>
                  <button class="btn btn-ghost btn-sm" onclick="FriendsPage.rejectFriend('${r.from}')" style="padding:6px 12px;font-size:0.7rem;">✕</button>
                </div>
              </div>
            `).join('') : '<p style="font-size:0.8rem;color:var(--text-muted);padding:12px 0;text-align:center;">No pending requests</p>'}
          </div>
        </div>
      </div>`;
  },

  async renderRequests(container) {
    const user = RQB.state.currentUser;
    let requests = user.friendRequests || [];
    if (RQBApi.online) {
      const res = await RQBApi.friends(user.id);
      if (res.ok) { requests = res.requests || []; user.friendRequests = requests; }
    }
    container.innerHTML = `
      <div style="padding:16px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);">
        <h4 style="font-size:0.9rem;margin-bottom:16px;">📨 Friend Requests (${requests.length})</h4>
        ${requests.length ? requests.map(r => `
          <div class="friend-item" style="border-bottom:1px solid rgba(255,255,255,0.04);">
            <div class="friend-avatar">${r.avatar || '?'}</div>
            <div class="friend-info" style="flex:1;">
              <div class="friend-name">${r.name}</div>
              <div style="font-size:0.7rem;color:var(--text-muted);">Sent ${r.sentAt ? new Date(r.sentAt).toLocaleDateString() : 'recently'}</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-primary btn-sm" onclick="FriendsPage.acceptFriend('${r.from}')">Accept</button>
              <button class="btn btn-ghost btn-sm" onclick="FriendsPage.rejectFriend('${r.from}')">Decline</button>
            </div>
          </div>
        `).join('') : '<p style="font-size:0.85rem;color:var(--text-muted);text-align:center;padding:20px;">No pending requests</p>'}
      </div>`;
  },

  async renderSearch(container) {
    container.innerHTML = `
      <div style="padding:20px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid rgba(255,255,255,0.06);">
        <h4 style="font-size:0.9rem;margin-bottom:16px;">🔍 Search Players</h4>
        <div style="display:flex;gap:12px;margin-bottom:16px;">
          <input type="text" id="friend-search-input" placeholder="Enter username or display name..." style="flex:1;padding:12px 16px;background:rgba(0,0,0,0.4);border:1px solid rgba(0,212,255,0.2);border-radius:var(--radius-md);color:var(--text-primary);font-size:0.9rem;outline:none;font-family:inherit;">
          <button class="btn btn-primary btn-sm" onclick="FriendsPage.searchUsers()" style="width:auto;padding:12px 24px;">Search</button>
        </div>
        <div id="friend-search-results" style="margin-top:12px;"></div>
      </div>`;
    const input = document.getElementById('friend-search-input');
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') FriendsPage.searchUsers(); });
  },

  async searchUsers() {
    const input = document.getElementById('friend-search-input');
    const results = document.getElementById('friend-search-results');
    const query = input?.value?.trim().toLowerCase();
    if (!query) { if (results) results.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">Enter a name to search</p>'; return; }

    let users = [];
    if (RQBApi.online) {
      const res = await RQBApi.listUsers();
      if (res.ok && res.users) users = res.users;
    } else {
      users = (RQBBOX_DATA.profiles?.users || []).map(u => ({ id: u.id, name: u.name, username: u.username, avatar: u.avatar, online: !!u.token }));
    }

    const matches = users.filter(u =>
      u.id !== RQB.state.currentUser?.id &&
      (u.name?.toLowerCase().includes(query) || u.username?.toLowerCase().includes(query))
    );

    if (!matches.length) {
      if (results) results.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;padding:16px 0;text-align:center;">No players found</p>';
      return;
    }

    if (results) results.innerHTML = matches.map(u => {
      const alreadyFriend = (RQB.state.currentUser?.friends || []).find(f => f.id === u.id);
      return `
        <div class="friend-item" style="border-bottom:1px solid rgba(255,255,255,0.04);">
          <div class="friend-avatar">${u.avatar || '?'}</div>
          <div class="friend-info" style="flex:1;">
            <div class="friend-name">${u.name}</div>
            <div style="font-size:0.7rem;color:var(--text-muted);">@${u.username || ''} · ${u.online ? '🟢 Online' : '⚫ Offline'}</div>
          </div>
          ${alreadyFriend ? '<span style="font-size:0.7rem;color:var(--text-muted);">✅ Friend</span>' :
            `<button class="btn btn-primary btn-sm" onclick="FriendsPage.addFriend('${u.id}')" style="padding:8px 16px;font-size:0.75rem;">+ Add Friend</button>`}
        </div>`;
    }).join('');
  },

  async addFriend(friendId) {
    const user = RQB.state.currentUser;
    const pu = RQBBOX_DATA.profiles?.users?.find(u => u.id === user?.id);
    const token = pu?.token;
    if (!token && !RQBApi.online) { RQB.toast('Sign in to add friends'); return; }

    if (RQBApi.online && token) {
      const res = await RQBApi.addFriend(token, friendId);
      if (res.ok) {
        RQB.toast(res.message || 'Friend request sent');
        if (RQBAudio && RQBAudio.select) RQBAudio.select();
        return;
      }
      RQB.toast(res.error || 'Failed to send request');
      return;
    }
    RQB.toast('Sign in online to use friends');
  },

  async acceptFriend(fromId) {
    const user = RQB.state.currentUser;
    const pu = RQBBOX_DATA.profiles?.users?.find(u => u.id === user?.id);
    const token = pu?.token;
    if (RQBApi.online && token) {
      const res = await RQBApi.acceptFriend(token, fromId);
      if (res.ok) {
        RQB.toast(res.message || 'Friend added');
        user.friendRequests = (user.friendRequests || []).filter(r => r.from !== fromId);
        if (RQBAudio && RQBAudio.achievement) RQBAudio.achievement();
        this.render();
        return;
      }
      RQB.toast(res.error || 'Failed to accept');
    }
  },

  async rejectFriend(fromId) {
    const user = RQB.state.currentUser;
    const pu = RQBBOX_DATA.profiles?.users?.find(u => u.id === user?.id);
    const token = pu?.token;
    if (RQBApi.online && token) {
      const res = await RQBApi.rejectFriend(token, fromId);
      if (res.ok) {
        RQB.toast('Request rejected');
        user.friendRequests = (user.friendRequests || []).filter(r => r.from !== fromId);
        this.render();
      }
    }
  },

  async removeFriend(friendId) {
    const user = RQB.state.currentUser;
    const pu = RQBBOX_DATA.profiles?.users?.find(u => u.id === user?.id);
    const token = pu?.token;
    if (RQBApi.online && token) {
      const res = await RQBApi.removeFriend(token, friendId);
      if (res.ok) {
        RQB.toast('Friend removed');
        user.friends = (user.friends || []).filter(f => f.id !== friendId);
        this.render();
      }
    }
  }
};
