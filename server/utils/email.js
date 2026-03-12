const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'your_gmail_app_password_here') {
    console.log(`📧 Email skipped (SMTP not configured): ${subject} → ${to}`);
    return;
  }
  try {
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });
    console.log(`✅ Email sent: ${subject} → ${to}`);
  } catch (err) {
    console.error('❌ Email error:', err.message);
  }
};

// Email Templates
const appointmentConfirmEmail = (appt) => ({
  to: appt.email,
  subject: `✅ Appointment Confirmed — DoctorG24, Agra`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
      <div style="background:linear-gradient(135deg,#1A1035,#2D1B69);padding:32px;text-align:center">
        <div style="font-size:2.5rem">🐾</div>
        <h1 style="color:white;font-size:1.5rem;margin:10px 0">DoctorG24 Vet Clinic</h1>
        <p style="color:rgba(255,255,255,0.6);font-size:0.85rem">Dr. Manoj Kumar Gupta (M.V.Sc.) · Agra</p>
      </div>
      <div style="padding:32px">
        <h2 style="color:#1A1035;margin-bottom:6px">✅ Appointment Confirmed!</h2>
        <p style="color:#666;margin-bottom:24px">नमस्ते <strong>${appt.ownerName}</strong> जी,</p>
        <div style="background:#F9F5FF;border-radius:12px;padding:20px;margin-bottom:20px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:6px 0;color:#888;font-size:0.85rem">Pet का नाम</td><td style="padding:6px 0;font-weight:700;color:#1A1035">${appt.petName} (${appt.petType})</td></tr>
            <tr><td style="padding:6px 0;color:#888;font-size:0.85rem">Service</td><td style="padding:6px 0;font-weight:700;color:#1A1035">${appt.service}</td></tr>
            <tr><td style="padding:6px 0;color:#888;font-size:0.85rem">Date</td><td style="padding:6px 0;font-weight:700;color:#1A1035">${new Date(appt.date).toLocaleDateString('en-IN', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}</td></tr>
            <tr><td style="padding:6px 0;color:#888;font-size:0.85rem">Time</td><td style="padding:6px 0;font-weight:700;color:#1A1035">${appt.timeSlot}</td></tr>
            <tr><td style="padding:6px 0;color:#888;font-size:0.85rem">Doctor</td><td style="padding:6px 0;font-weight:700;color:#1A1035">Dr. Manoj Kumar Gupta</td></tr>
          </table>
        </div>
        <div style="background:#FFF3E0;border-radius:12px;padding:16px;margin-bottom:20px">
          <p style="margin:0;color:#E65100;font-size:0.88rem">📍 <strong>Clinic Address:</strong> Agra, Uttar Pradesh<br>📞 <strong>Phone:</strong> 7456064956<br>💬 <strong>WhatsApp:</strong> <a href="https://wa.me/917456064956">7456064956</a></p>
        </div>
        <p style="color:#666;font-size:0.85rem">Please arrive 10 minutes early. अगर कोई problem हो तो WhatsApp करें।</p>
      </div>
      <div style="background:#F5F5F5;padding:16px;text-align:center">
        <p style="color:#999;font-size:0.78rem;margin:0">© 2025 DoctorG24 Vet Clinic, Agra | Dr. Manoj Kumar Gupta (M.V.Sc.)</p>
      </div>
    </div>
  `
});

const appointmentStatusEmail = (appt, newStatus) => ({
  to: appt.email,
  subject: `${newStatus === 'confirmed' ? '✅' : newStatus === 'cancelled' ? '❌' : '📋'} Appointment ${newStatus} — DoctorG24`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
      <div style="background:linear-gradient(135deg,#1A1035,#2D1B69);padding:28px;text-align:center">
        <div style="font-size:2rem">🐾</div>
        <h1 style="color:white;font-size:1.3rem;margin:8px 0">DoctorG24 Vet Clinic</h1>
      </div>
      <div style="padding:28px">
        <h2 style="color:#1A1035">Appointment Update</h2>
        <p style="color:#666">नमस्ते <strong>${appt.ownerName}</strong> जी,</p>
        <p style="color:#666">आपके <strong>${appt.petName}</strong> का appointment <strong style="color:${newStatus==='confirmed'?'#2E7D32':newStatus==='cancelled'?'#C62828':'#1565C0'}">${newStatus.toUpperCase()}</strong> हो गया है।</p>
        <p style="color:#888;font-size:0.85rem">Date: ${new Date(appt.date).toLocaleDateString('en-IN')} | Time: ${appt.timeSlot}</p>
        ${newStatus === 'cancelled' ? '<p style="color:#C62828;font-size:0.88rem">नया appointment book करने के लिए website पर जाएं या 7456064956 पर call करें।</p>' : ''}
      </div>
    </div>
  `
});

const orderConfirmEmail = (order) => ({
  to: order.email,
  subject: `🛍️ Order Confirmed — PawCare Shop, Agra`,
  html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eee">
      <div style="background:linear-gradient(135deg,#1A1035,#2D1B69);padding:28px;text-align:center">
        <div style="font-size:2rem">🛍️</div>
        <h1 style="color:white;font-size:1.3rem;margin:8px 0">Order Confirmed!</h1>
      </div>
      <div style="padding:28px">
        <p style="color:#666">नमस्ते <strong>${order.customerName}</strong> जी, आपका order place हो गया!</p>
        <div style="background:#F9F5FF;border-radius:12px;padding:16px;margin:16px 0">
          ${order.items?.map(i => `<div style="padding:5px 0;border-bottom:1px solid #eee;font-size:0.88rem">${i.emoji || '📦'} ${i.name} × ${i.quantity} — <strong>₹${(i.price*i.quantity).toLocaleString('en-IN')}</strong></div>`).join('')}
          <div style="padding-top:10px;font-weight:700;color:#1A1035">Total: ₹${order.total?.toLocaleString('en-IN')}</div>
        </div>
        <p style="color:#888;font-size:0.85rem">Payment: ${order.paymentMethod} | हम जल्द deliver करेंगे।</p>
      </div>
    </div>
  `
});

module.exports = { sendEmail, appointmentConfirmEmail, appointmentStatusEmail, orderConfirmEmail };
