const https = require('https');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'server.config.json');

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

function buildWelcomeHtml(name, username, email) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#050810;font-family:'Segoe UI',Inter,sans-serif;color:#e8f0ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050810;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:rgba(18,26,48,0.95);border-radius:22px;border:1px solid rgba(0,212,255,0.15);padding:40px;">
        <tr><td align="center" style="padding-bottom:16px;">
          <div style="width:56px;height:56px;border-radius:14px;background:#12182a;border:2px solid rgba(0,212,255,0.4);display:inline-flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:#00d4ff;font-family:'Segoe UI',sans-serif;">R</div>
        </td></tr>
        <tr><td align="center" style="font-size:24px;font-weight:700;color:#e8f0ff;padding-bottom:8px;">Welcome to RhysTech</td></tr>
        <tr><td align="center" style="font-size:14px;color:#8b9dc3;padding-bottom:24px;">Your RQBBOX account is ready</td></tr>
        <tr><td style="font-size:15px;color:#c0d0f0;line-height:1.7;padding-bottom:20px;">
          Hey ${name},<br><br>
          Thanks for joining RhysTech. Your account <strong style="color:#00d4ff;">@${username}</strong> has been created.
          ${email ? `<br><br>Registered with: <span style="color:#8b9dc3;">${email}</span>` : ''}
          <br><br>
          Plug in your RQBBOX USB, launch the app, and sign in to pick up where you left off.
        </td></tr>
        <tr><td align="center" style="padding:20px 0;">
          <a href="http://127.0.0.1:19777/" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#00d4ff,#9d4edd);color:#fff;text-decoration:none;border-radius:14px;font-size:14px;font-weight:600;">Launch RQBBOX</a>
        </td></tr>
        <tr><td align="center" style="font-size:12px;color:#5a6a8a;padding-top:16px;border-top:1px solid rgba(255,255,255,0.06);">
          RhysTech &middot; RQBBOX OS Portable USB<br>
          Not a bootable OS. Plug in. Play anywhere.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function sendEmail({ to, subject, html }) {
  return new Promise((resolve, reject) => {
    const config = loadConfig();
    if (!config || !config.resendApiKey) {
      console.warn('[Email] No API key configured — skipping email');
      resolve({ ok: false, error: 'No API key' });
      return;
    }

    const payload = JSON.stringify({
      from: config.fromEmail || 'RhysTech <support@rhystech.com>',
      to,
      subject,
      html,
    });

    const options = {
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        console.log(`[Email] ${ok ? 'Sent' : 'Failed'} to ${to} (${res.statusCode})`);
        if (!ok) console.warn(`[Email] Response: ${data.slice(0, 500)}`);
        resolve({ ok, status: res.statusCode, data: data ? JSON.parse(data) : null });
      });
    });

    req.on('error', err => {
      console.error(`[Email] Error sending to ${to}:`, err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

module.exports = { sendEmail, buildWelcomeHtml };
