const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  tls: { rejectUnauthorized: false }
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'your_gmail_app_password_here') {
    console.log(`📧 Email skipped (SMTP not configured): ${subject} → ${to}`);
    return;
  }
  if (!to) { console.log('📧 Email skipped: no recipient'); return; }
  try {
    await transporter.sendMail({
      from: `"DoctorG24 Vet Clinic" <${process.env.SMTP_USER}>`,
      to, subject, html
    });
    console.log(`✅ Email sent: ${subject} → ${to}`);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

const header = (emoji='🐾') => `
  <div style="background:linear-gradient(135deg,#1B4332,#0D2818);padding:28px 32px;text-align:center">
    <div style="font-size:2.2rem;margin-bottom:8px">${emoji}</div>
    <div style="font-family:Georgia,serif;font-size:1.4rem;color:#fff;font-weight:700;letter-spacing:.01em">DoctorG<span style="color:#90EE90">24</span></div>
    <div style="color:rgba(255,255,255,.55);font-size:.78rem;margin-top:3px">Dr. Manoj Kumar Gupta (M.V.Sc.) · Agra</div>
  </div>`;

const footer = () => `
  <div style="background:#F5F5F0;padding:16px 32px;text-align:center;border-top:1px solid #E4E0D8">
    <p style="color:#9A9288;font-size:.75rem;margin:0">
      📍 Agra, Uttar Pradesh &nbsp;|&nbsp; 📞 <a href="tel:7456064956" style="color:#2D6A4F">7456064956</a> &nbsp;|&nbsp;
      💬 <a href="https://wa.me/917456064956" style="color:#25D366">WhatsApp</a> &nbsp;|&nbsp;
      🌐 <a href="https://doctorg24.in" style="color:#2D6A4F">doctorg24.in</a>
    </p>
    <p style="color:#C0BAB0;font-size:.7rem;margin:6px 0 0">© 2025 DoctorG24 Vet Clinic — All rights reserved</p>
  </div>`;

const wrap = (content, emoji) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E4E0D8;box-shadow:0 4px 24px rgba(26,23,20,.10)">
    ${header(emoji)}
    <div style="padding:32px">${content}</div>
    ${footer()}
  </div>`;

const infoRow = (label, value) =>
  `<tr><td style="padding:8px 0;color:#9A9288;font-size:.82rem;width:140px">${label}</td><td style="padding:8px 0;font-weight:700;color:#1A1714;font-size:.88rem">${value}</td></tr>`;

// ── 1. APPOINTMENT CONFIRMATION (on booking) ──────────────────
const appointmentConfirmEmail = (appt) => ({
  to: appt.email,
  subject: `✅ Appointment Booked — DoctorG24, Agra`,
  html: wrap(`
    <h2 style="color:#1B4332;font-family:Georgia,serif;margin-bottom:6px">✅ Appointment Booked!</h2>
    <p style="color:#5A544A;margin-bottom:22px">नमस्ते <strong>${appt.ownerName}</strong> जी, आपकी appointment successfully book हो गई!</p>
    <div style="background:#F0F7F4;border-radius:12px;padding:20px;margin-bottom:20px;border-left:4px solid #2D6A4F">
      <table style="width:100%;border-collapse:collapse">
        ${infoRow('Pet का नाम', `${appt.petName} (${appt.petType})`)}
        ${infoRow('Service', appt.service)}
        ${infoRow('Date', new Date(appt.date).toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'}))}
        ${infoRow('Time', appt.timeSlot)}
        ${infoRow('Doctor', 'Dr. Manoj Kumar Gupta')}
        ${appt.address ? infoRow('Address', appt.address) : ''}
      </table>
    </div>
    <div style="background:#FFF8EC;border-radius:10px;padding:14px 18px;margin-bottom:20px;border:1px solid #E8D8A0">
      <p style="margin:0;color:#7D5A00;font-size:.84rem">⚠️ <strong>Remember:</strong> Please arrive 10 minutes early. अगर cancel/reschedule करना हो तो WhatsApp करें।</p>
    </div>
    <div style="text-align:center;margin-top:24px">
      <a href="https://wa.me/917456064956" style="display:inline-block;padding:12px 28px;background:#25D366;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:.88rem">💬 WhatsApp Us</a>
      &nbsp;
      <a href="https://doctorg24.in/appointment" style="display:inline-block;padding:12px 28px;background:#1B4332;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:.88rem">📅 Book Another</a>
    </div>`, '📅')
});

// ── 2. APPOINTMENT STATUS UPDATE ─────────────────────────────
const appointmentStatusEmail = (appt, newStatus) => {
  const statusConfig = {
    confirmed: { emoji:'✅', color:'#1B5E2D', bg:'#EAF7EF', text:'Confirmed', msg:'आपकी appointment confirm हो गई! Please समय पर आएं।' },
    cancelled:  { emoji:'❌', color:'#7A1A1A', bg:'#FDE8E8', text:'Cancelled',  msg:'आपकी appointment cancel हो गई। नई appointment book करने के लिए website पर जाएं।' },
    completed:  { emoji:'🎉', color:'#1A3A7A', bg:'#E8F0FE', text:'Completed',  msg:'Visit complete! अगली visit के लिए appointment book करें। अपने pet का ख्याल रखें! 🐾' },
    pending:    { emoji:'⏳', color:'#7D5A00', bg:'#FFF8E1', text:'Pending',    msg:'आपकी appointment pending है। जल्द confirm होगी।' },
  };
  const s = statusConfig[newStatus] || statusConfig.pending;
  return {
    to: appt.email,
    subject: `${s.emoji} Appointment ${s.text} — DoctorG24`,
    html: wrap(`
      <h2 style="color:${s.color};font-family:Georgia,serif">${s.emoji} Appointment ${s.text}</h2>
      <p style="color:#5A544A">नमस्ते <strong>${appt.ownerName}</strong> जी,</p>
      <div style="background:${s.bg};border-radius:12px;padding:18px;margin:18px 0;border-left:4px solid ${s.color}">
        <p style="margin:0 0 12px;color:${s.color};font-weight:700">${s.msg}</p>
        <table style="width:100%;border-collapse:collapse">
          ${infoRow('Pet', `${appt.petName} (${appt.petType})`)}
          ${infoRow('Service', appt.service)}
          ${infoRow('Date', new Date(appt.date).toLocaleDateString('en-IN',{weekday:'long',month:'long',day:'numeric'}))}
          ${infoRow('Time', appt.timeSlot)}
          ${appt.fee ? infoRow('Fee', `₹${appt.fee}`) : ''}
          ${appt.adminNote ? infoRow('Doctor Note', appt.adminNote) : ''}
        </table>
      </div>
      <div style="text-align:center;margin-top:20px">
        <a href="https://doctorg24.in/patient/dashboard" style="display:inline-block;padding:12px 28px;background:#1B4332;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:.88rem">View My Appointments</a>
      </div>`, s.emoji)
  };
};

// ── 3. ORDER CONFIRMATION (with full cart) ────────────────────
const orderConfirmEmail = (order) => {
  const itemRows = (order.items||[]).map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #E4E0D8;font-size:.86rem">
        <span style="font-size:1.1rem">${i.emoji||'📦'}</span> <strong>${i.name}</strong>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #E4E0D8;text-align:center;color:#5A544A;font-size:.84rem">× ${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E4E0D8;text-align:right;font-weight:700;color:#1B4332;font-size:.86rem">₹${(i.price*i.quantity).toLocaleString('en-IN')}</td>
    </tr>`).join('');
  return {
    to: order.email,
    subject: `🛍️ Order Confirmed #${order._id?.toString().slice(-6).toUpperCase()} — DoctorG24`,
    html: wrap(`
      <h2 style="color:#1B4332;font-family:Georgia,serif">🛍️ Order Confirmed!</h2>
      <p style="color:#5A544A;margin-bottom:22px">नमस्ते <strong>${order.customerName}</strong> जी, आपका order successfully place हो गया!</p>
      <div style="background:#F0F7F4;border-radius:12px;padding:20px;margin-bottom:20px">
        <div style="font-weight:800;font-size:.78rem;color:#2D6A4F;text-transform:uppercase;letter-spacing:.08em;margin-bottom:14px">Order Details</div>
        <table style="width:100%;border-collapse:collapse">
          <tr><th style="text-align:left;font-size:.72rem;color:#9A9288;padding-bottom:8px;text-transform:uppercase">Item</th><th style="text-align:center;font-size:.72rem;color:#9A9288;padding-bottom:8px">Qty</th><th style="text-align:right;font-size:.72rem;color:#9A9288;padding-bottom:8px">Price</th></tr>
          ${itemRows}
        </table>
        <table style="width:100%;border-collapse:collapse;margin-top:12px">
          <tr><td style="padding:4px 0;color:#9A9288;font-size:.82rem">Subtotal</td><td style="text-align:right;font-size:.82rem">₹${order.subtotal?.toLocaleString('en-IN')||0}</td></tr>
          <tr><td style="padding:4px 0;color:#9A9288;font-size:.82rem">Delivery</td><td style="text-align:right;font-size:.82rem">₹${order.deliveryFee||50}</td></tr>
          <tr><td style="padding:4px 0;color:#9A9288;font-size:.82rem">GST (5%)</td><td style="text-align:right;font-size:.82rem">₹${order.gst||0}</td></tr>
          <tr style="border-top:2px solid #1B4332"><td style="padding:10px 0 4px;font-weight:800;color:#1A1714">Total Paid</td><td style="text-align:right;font-weight:800;color:#1B4332;font-size:1rem">₹${order.total?.toLocaleString('en-IN')||0}</td></tr>
        </table>
      </div>
      <div style="background:#FFF8EC;border-radius:10px;padding:14px 18px;margin-bottom:20px;border:1px solid #E8D8A0">
        <p style="margin:0;color:#7D5A00;font-size:.84rem">💳 Payment: <strong>${order.paymentMethod||'UPI'}</strong> &nbsp;|&nbsp; 📍 Delivery to: <strong>${order.address||''}, ${order.city||'Agra'}</strong></p>
      </div>
      <div style="text-align:center">
        <a href="https://doctorg24.in/patient/dashboard" style="display:inline-block;padding:12px 28px;background:#1B4332;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:.88rem">Track My Order</a>
      </div>`, '🛍️')
  };
};

// ── 4. WELCOME EMAIL (on registration) ───────────────────────
const welcomeEmail = (patient) => ({
  to: patient.email,
  subject: `🐾 Welcome to DoctorG24, ${patient.name}!`,
  html: wrap(`
    <h2 style="color:#1B4332;font-family:Georgia,serif">Welcome, ${patient.name}! 🐾</h2>
    <p style="color:#5A544A;margin-bottom:20px">DoctorG24 family में आपका स्वागत है! Dr. Manoj Kumar Gupta (M.V.Sc.) आपके pet की देखभाल के लिए हमेशा तैयार हैं।</p>
    <div style="background:#F0F7F4;border-radius:12px;padding:20px;margin-bottom:20px">
      <div style="font-weight:800;font-size:.78rem;color:#2D6A4F;margin-bottom:12px;text-transform:uppercase;letter-spacing:.08em">Your Account</div>
      ${infoRow('Name', patient.name)}
      ${infoRow('Email', patient.email)}
      ${patient.phone ? infoRow('Phone', patient.phone) : ''}
    </div>
    <p style="color:#5A544A;font-size:.88rem;margin-bottom:20px">आप अब online कर सकते हैं:</p>
    <ul style="color:#5A544A;font-size:.86rem;line-height:2;padding-left:20px">
      <li>📅 Appointment online book करें</li>
      <li>📋 Appointment status track करें</li>
      <li>🛍️ Pet products order करें</li>
      <li>📦 Order history देखें</li>
    </ul>
    <div style="text-align:center;margin-top:24px">
      <a href="https://doctorg24.in/appointment" style="display:inline-block;padding:12px 28px;background:#1B4332;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:.88rem">📅 Book First Appointment</a>
    </div>`, '🐾')
});

// ── 5. FORGOT PASSWORD EMAIL ──────────────────────────────────
const forgotPasswordEmail = (patient, resetToken) => ({
  to: patient.email,
  subject: `🔐 Password Reset — DoctorG24`,
  html: wrap(`
    <h2 style="color:#1B4332;font-family:Georgia,serif">🔐 Password Reset Request</h2>
    <p style="color:#5A544A;margin-bottom:20px">नमस्ते <strong>${patient.name}</strong> जी,</p>
    <p style="color:#5A544A;margin-bottom:20px">आपने password reset request की है। नीचे दिए button पर click करके नया password set करें।</p>
    <div style="text-align:center;margin:28px 0">
      <a href="https://doctorg24.in/reset-password?token=${resetToken}" 
        style="display:inline-block;padding:14px 32px;background:#1B4332;color:#fff;border-radius:8px;text-decoration:none;font-weight:800;font-size:.92rem">
        🔑 Reset My Password
      </a>
    </div>
    <div style="background:#FDE8E8;border-radius:10px;padding:14px 18px;border:1px solid #F5A0A0">
      <p style="margin:0;color:#7A1A1A;font-size:.82rem">⚠️ यह link <strong>1 घंटे</strong> में expire हो जाएगा। अगर आपने request नहीं की तो ignore करें।</p>
    </div>`, '🔐')
});

module.exports = {
  sendEmail,
  appointmentConfirmEmail,
  appointmentStatusEmail,
  orderConfirmEmail,
  welcomeEmail,
  forgotPasswordEmail
};
