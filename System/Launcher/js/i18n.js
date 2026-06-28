/* RQBBOX OS — Multi-language i18n */
const I18n = {
  lang: 'en',
  fallback: 'en',
  strings: {},

  async init() {
    const saved = localStorage.getItem('rqbbox_lang');
    this.lang = saved || navigator.language?.split('-')[0] || 'en';
    if (!this.strings[this.lang]) await this.load(this.lang);
    this.apply();
  },

  async load(code) {
    const builtIn = {
      en: {
        home: 'Home', games: 'Games', apps: 'Apps', store: 'Store',
        files: 'Files', settings: 'Settings', profile: 'Profile',
        search: 'Smart search games, apps, files...',
        fullscreen: 'Fullscreen Mode', exit: 'Exit', save: 'Save',
        cancel: 'Cancel', delete: 'Delete', confirm: 'Confirm',
        online: 'Online', offline: 'Offline', loading: 'Loading...',
        notifications: 'Notifications', noNotifs: 'No notifications',
        install: 'Install', launch: 'Launch', installed: 'Installed',
        version: 'Version', storage: 'Storage', controller: 'Controller',
        rqbboxMode: 'RQBBOX Mode', performance: 'Performance Mode',
        language: 'Language',
      },
      es: {
        home: 'Inicio', games: 'Juegos', apps: 'Apps', store: 'Tienda',
        files: 'Archivos', settings: 'Ajustes', profile: 'Perfil',
        search: 'Búsqueda inteligente...',
        fullscreen: 'Pantalla Completa', exit: 'Salir', save: 'Guardar',
        cancel: 'Cancelar', delete: 'Eliminar', confirm: 'Confirmar',
        online: 'En línea', offline: 'Desconectado', loading: 'Cargando...',
        notifications: 'Notificaciones', noNotifs: 'Sin notificaciones',
        install: 'Instalar', launch: 'Iniciar', installed: 'Instalado',
        version: 'Versión', storage: 'Almacenamiento', controller: 'Control',
        rqbboxMode: 'Modo RQBBOX', performance: 'Modo Rendimiento',
        language: 'Idioma',
      },
      fr: {
        home: 'Accueil', games: 'Jeux', apps: 'Apps', store: 'Magasin',
        files: 'Fichiers', settings: 'Paramètres', profile: 'Profil',
        search: 'Recherche intelligente...',
        fullscreen: 'Plein Écran', exit: 'Quitter', save: 'Enregistrer',
        cancel: 'Annuler', delete: 'Supprimer', confirm: 'Confirmer',
        online: 'En ligne', offline: 'Hors ligne', loading: 'Chargement...',
        notifications: 'Notifications', noNotifs: 'Aucune notification',
        install: 'Installer', launch: 'Lancer', installed: 'Installé',
        version: 'Version', storage: 'Stockage', controller: 'Manette',
        rqbboxMode: 'Mode RQBBOX', performance: 'Mode Performance',
        language: 'Langue',
      },
      ja: {
        home: 'ホーム', games: 'ゲーム', apps: 'アプリ', store: 'ストア',
        files: 'ファイル', settings: '設定', profile: 'プロフィール',
        search: 'スマート検索...',
        fullscreen: 'フルスクリーン', exit: '終了', save: '保存',
        cancel: 'キャンセル', delete: '削除', confirm: '確認',
        online: 'オンライン', offline: 'オフライン', loading: '読み込み中...',
        notifications: '通知', noNotifs: '通知なし',
        install: 'インストール', launch: '起動', installed: 'インストール済み',
        version: 'バージョン', storage: 'ストレージ', controller: 'コントローラー',
        rqbboxMode: 'RQBBOXモード', performance: 'パフォーマンスモード',
        language: '言語',
      },
    };
    this.strings = { ...builtIn };
    if (builtIn[code]) {
      this.strings[code] = { ...builtIn.en, ...builtIn[code] };
    }
  },

  t(key, fallbackText) {
    if (this.strings[this.lang] && this.strings[this.lang][key]) return this.strings[this.lang][key];
    if (this.strings[this.fallback] && this.strings[this.fallback][key]) return this.strings[this.fallback][key];
    return fallbackText || key;
  },

  apply() {
    document.documentElement.lang = this.lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key, el.textContent);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      el.placeholder = this.t(key, el.placeholder);
    });
  },

  setLang(code) {
    this.lang = code;
    localStorage.setItem('rqbbox_lang', code);
    if (!this.strings[code]) this.load(code);
    this.apply();
    RQB.toast(`Language: ${code.toUpperCase()}`);
  },
};
