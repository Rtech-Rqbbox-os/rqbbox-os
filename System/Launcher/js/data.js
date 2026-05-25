/* RQBBOX OS - Embedded Data */
const RQBBOX_DATA = {
  store: null,
  profiles: null,
  config: {
    system: { name: 'RQBBOX OS Portable USB', version: '1.1.0', company: 'RhysTech', tagline: 'Plug Into Gaming.', edition: 'lite' },
    display: { theme: 'neon-dark', animations: true, performanceMode: false, showFps: false },
    audio: { masterVolume: 0.8, startupSound: true, backgroundMusic: true, uiSounds: true }
  },
  nav: [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'games', icon: '🎮', label: 'Games' },
    { id: 'apps', icon: '📱', label: 'Apps' },
    { id: 'store', icon: '🛒', label: 'Store' },
    { id: 'files', icon: '📁', label: 'Files' },
    { id: 'ai', icon: '🤖', label: 'AI' },
    { id: 'friends', icon: '👥', label: 'Friends' },
    { id: 'browser', icon: '🌐', label: 'Web' },
    { id: 'media', icon: '🎬', label: 'Media' },
    { id: 'downloads', icon: '⬇️', label: 'DL' },
    { id: 'settings', icon: '⚙️', label: 'Set' },
    { id: 'profile', icon: '👤', label: 'Profile' }
  ],
  fileTree: [
    { name: 'Games', icon: '🎮', path: 'Games' },
    { name: 'Apps', icon: '📱', path: 'Apps' },
    { name: 'Store', icon: '🛒', path: 'Store' },
    { name: 'Profiles', icon: '👤', path: 'Profiles' },
    { name: 'Settings', icon: '⚙️', path: 'Settings' },
    { name: 'AI', icon: '🤖', path: 'AI' },
    { name: 'Media', icon: '🎬', path: 'Media' },
    { name: 'Downloads', icon: '⬇️', path: 'Downloads' },
    { name: 'System', icon: '💻', path: 'System' }
  ],
  aiPrompts: [
    'Generate a cyberpunk gaming wallpaper',
    'Suggest games like Neon Drift',
    'What are my recent achievements?',
    'How much USB storage is left?'
  ]
};
