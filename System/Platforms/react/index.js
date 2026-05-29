import React from 'react';

const RQBBOX_OS = {
  name: 'RQBBOX OS',
  version: '1.2.0',
  tagline: 'Portable USB Gaming Operating System',
  author: 'RhysTech',
  download: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os/releases',
  repo: 'https://github.com/Rtech-Rqbbox-os/rqbbox-os',
  card: 'https://rtech-rqbbox-os.github.io/rqbbox-os/System/Website/os-info-card.html',
  youtube: 'https://www.youtube.com/@RQBBOX-REAL',
  email: 'rqbbox.support@groups.outlook.com',
  features: [
    { icon: '🎮', label: '6 Games', desc: 'HTML5 native titles' },
    { icon: '🛒', label: '43+ Packages', desc: 'Store + Google Play' },
    { icon: '🎨', label: 'PS5 UI', desc: 'Dark minimal, glassmorphism' },
    { icon: '🔊', label: 'Pro Audio', desc: '40+ synth sounds, DSP' },
    { icon: '📱', label: 'Phone Boot', desc: 'Auto-detect + PWA' },
    { icon: '👤', label: 'Multi-User', desc: 'Auth, cloud sync' },
  ],
  platforms: ['Windows', 'macOS', 'Linux', 'Android', 'iOS', 'KaiOS'],
};

const styles = {
  card: {
    background: 'rgba(20,22,28,.95)',
    backdropFilter: 'blur(24px) saturate(1.3)',
    WebkitBackdropFilter: 'blur(24px) saturate(1.3)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 16,
    padding: 24,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: '#fff',
    margin: '20px 0',
    boxShadow: '0 20px 60px rgba(0,0,0,.6)',
    maxWidth: '100%',
  },
  header: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 },
  logo: { flexShrink: 0, width: 48, height: 48 },
  title: { fontSize: '1.2rem', fontWeight: 700 },
  subtitle: { fontSize: '.75rem', color: 'rgba(255,255,255,.4)' },
  badges: { display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 },
  badge: {
    background: 'rgba(0,212,255,.08)',
    border: '1px solid rgba(0,212,255,.1)',
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: '.65rem',
    color: '#00d4ff',
    textTransform: 'uppercase',
  },
  desc: { fontSize: '.82rem', lineHeight: 1.6, color: 'rgba(255,255,255,.55)', marginBottom: 14 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 14 },
  feature: {
    padding: '6px 8px',
    borderRadius: 6,
    background: 'rgba(255,255,255,.02)',
    border: '1px solid rgba(255,255,255,.04)',
    fontSize: '.7rem',
    color: 'rgba(255,255,255,.5)',
  },
  featureStrong: { color: 'rgba(255,255,255,.7)' },
  actions: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', borderRadius: 8, fontSize: '.78rem', fontWeight: 600,
    textDecoration: 'none', background: 'linear-gradient(135deg,#007bff,#00d4ff)',
    color: '#fff', boxShadow: '0 4px 16px rgba(0,212,255,.2)',
  },
  btnGhost: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '8px 16px', borderRadius: 8, fontSize: '.78rem', fontWeight: 600,
    textDecoration: 'none', background: 'rgba(255,255,255,.05)',
    color: 'rgba(255,255,255,.7)', border: '1px solid rgba(255,255,255,.06)',
  },
  footer: {
    paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.04)',
    fontSize: '.65rem', color: 'rgba(255,255,255,.25)',
    display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 14,
  },
};

const Logo = () => (
  <svg viewBox="0 0 100 100" style={styles.logo}>
    <rect width="100" height="100" rx="20" fill="#0a0e1a" stroke="url(#rqb-react-lg)" strokeWidth="2"/>
    <text x="50" y="66" textAnchor="middle" fontSize="52" fontWeight="800" fill="url(#rqb-react-lg)" fontFamily="Segoe UI">R</text>
    <defs><linearGradient id="rqb-react-lg"><stop offset="0%" stopColor="#00d4ff"/><stop offset="100%" stopColor="#9d4edd"/></linearGradient></defs>
  </svg>
);

export const RQBBOXOSInfoCard = ({ compact = false }) => (
  <div style={styles.card}>
    <div style={styles.header}>
      <Logo />
      <div>
        <div style={styles.title}>{RQBBOX_OS.name}</div>
        <div style={styles.subtitle}>{RQBBOX_OS.tagline} by {RQBBOX_OS.author}</div>
      </div>
    </div>

    <div style={styles.badges}>
      {['v' + RQBBOX_OS.version, 'Open Source', 'Free', 'PS5 UI'].map(tag => (
        <span key={tag} style={styles.badge}>{tag}</span>
      ))}
    </div>

    {!compact && (
      <>
        <div style={styles.desc}>
          A portable USB-based gaming OS that runs entirely from a USB drive without installation.
          PS5-inspired UI, pro audio engine, 43+ store packages, phone bootloader.
          Works on {RQBBOX_OS.platforms.join(', ')}.
        </div>
        <div style={styles.grid}>
          {RQBBOX_OS.features.map(f => (
            <div key={f.label} style={styles.feature}>
              <strong style={styles.featureStrong}>{f.icon} {f.label}</strong> &bull; {f.desc}
            </div>
          ))}
        </div>
      </>
    )}

    <div style={styles.actions}>
      <a href={RQBBOX_OS.download} target="_blank" rel="noopener noreferrer" style={styles.btnPrimary}>⬇ Download</a>
      <a href={RQBBOX_OS.repo} target="_blank" rel="noopener noreferrer" style={styles.btnGhost}>GitHub</a>
      <a href={RQBBOX_OS.card} target="_blank" rel="noopener noreferrer" style={styles.btnGhost}>Info Card</a>
    </div>

    <div style={styles.footer}>
      <span>&copy; 2026 RhysTech &bull; MIT</span>
      <span style={{ display: 'flex', gap: 8 }}>
        <a href={RQBBOX_OS.youtube} style={{ color: 'rgba(0,212,255,.4)', textDecoration: 'none' }}>YouTube</a>
        <a href={'mailto:' + RQBBOX_OS.email} style={{ color: 'rgba(0,212,255,.4)', textDecoration: 'none' }}>Support</a>
      </span>
    </div>
  </div>
);

export default RQBBOXOSInfoCard;
