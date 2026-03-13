const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const router   = express.Router();

const { makeUploader, resizeImage } = require('../middleware/upload');
const { protect, adminOnly }        = require('../middleware/auth');
const {
  User, Patient, Product, Appointment, Order, Review, Blog, Video, SiteSettings
} = require('../models');
const {
  sendEmail, appointmentConfirmEmail, appointmentStatusEmail,
  orderConfirmEmail, welcomeEmail, forgotPasswordEmail
} = require('../utils/email');

// ══════════════════════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════════════════════
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user; let role = 'admin';
    user = await User.findOne({ email: email.toLowerCase() });
    if (!user) { user = await Patient.findOne({ email: email.toLowerCase() }); role = 'patient'; }
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role, phone: user.phone, city: user.city } });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email & password required' });
    if (await Patient.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    const hash = await bcrypt.hash(password, 10);
    const patient = await Patient.create({ name, email: email.toLowerCase(), password: hash, phone, address, city });
    const token = jwt.sign({ id: patient._id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Welcome email
    sendEmail(welcomeEmail(patient));
    res.status(201).json({ token, user: { _id: patient._id, name: patient.name, email: patient.email, role: 'patient', phone: patient.phone, city: patient.city } });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Forgot password
router.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    // Always return same message (security)
    res.json({ message: 'If this email exists, a reset link has been sent.' });
    // Find user in both collections
    let user = await Patient.findOne({ email: email?.toLowerCase() });
    if (!user) user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return;
    const token = require('crypto').randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();
    sendEmail(forgotPasswordEmail(user, token));
  } catch(e) { console.error('Forgot password error:', e.message); }
});

// Reset password
router.post('/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    let user = await Patient.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset link. Please request again.' });
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully! Please login.' });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Change password (logged-in patient)
router.post('/auth/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Both passwords required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'New password must be at least 6 characters' });
    const user = await Patient.findById(req.user._id) || await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully!' });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Update profile
router.put('/auth/profile', protect, async (req, res) => {
  try {
    const { name, phone, city, address } = req.body;
    const user = await Patient.findByIdAndUpdate(req.user._id, { name, phone, city, address }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: 'patient', phone: user.phone, city: user.city, address: user.address });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Health check
router.get('/health', (req, res) => res.json({ status: 'ok', message: 'DoctorG24 API running', time: new Date() }));

// ── DASHBOARD STATS ───────────────────────────────────────────
router.get('/dashboard/stats', protect, adminOnly, async (req, res) => {
  try {
    const [patients, appointments, orders, products, reviews, blogs] = await Promise.all([
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Review.countDocuments({ approved: true }),
      Blog.countDocuments({ published: true }),
    ]);
    const pendingAppts    = await Appointment.countDocuments({ status: 'pending' });
    const todayStart      = new Date(); todayStart.setHours(0,0,0,0);
    const todayAppts      = await Appointment.countDocuments({ createdAt: { $gte: todayStart } });
    const recentOrders    = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentAppts     = await Appointment.find().sort({ createdAt: -1 }).limit(5).lean();
    const totalRevenue    = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
    res.json({
      patients, appointments, orders, products, reviews, blogs,
      pendingAppts, todayAppts,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders, recentAppts,
    });
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  PRODUCTS
// ══════════════════════════════════════════════════════════════
const prodUpload = makeUploader('products');
router.get('/products', async (req, res) => {
  try {
    const q = {};
    if (req.query.category && req.query.category !== 'all') q.category = req.query.category;
    if (req.query.subType) q.subType = req.query.subType;
    if (req.query.featured === 'true') q.featured = true;
    if (req.query.search) q.name = { $regex: req.query.search, $options: 'i' };
    res.json(await Product.find(q).sort({ featured: -1, createdAt: -1 }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});
router.get('/products/:id', async (req, res) => {
  try { res.json(await Product.findById(req.params.id)); }
  catch(e) { res.status(404).json({ message: 'Not found' }); }
});
router.post('/products', protect, adminOnly, prodUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, price: Number(req.body.price), mrp: req.body.mrp ? Number(req.body.mrp) : undefined };
    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`;
      await resizeImage(req.file.path, { width: 800, quality: 85 });
    }
    res.status(201).json(await Product.create(data));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
router.put('/products/:id', protect, adminOnly, prodUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, price: Number(req.body.price) };
    if (req.body.mrp) data.mrp = Number(req.body.mrp);
    if (req.file) {
      data.image = `/uploads/products/${req.file.filename}`;
      await resizeImage(req.file.path, { width: 800, quality: 85 });
    }
    res.json(await Product.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
router.delete('/products/:id', protect, adminOnly, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch(e) { res.status(400).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  APPOINTMENTS
// ══════════════════════════════════════════════════════════════
router.post('/appointments', async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    // Confirmation email to patient
    if (appt.email) {
      sendEmail(appointmentConfirmEmail(appt));
    }
    // Notification to admin
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `📅 New Appointment — ${appt.petName} (${appt.ownerName})`,
      html: `<div style="font-family:Arial;padding:20px;max-width:500px">
        <h3 style="color:#1B4332">New Appointment Booked!</h3>
        <p><strong>Owner:</strong> ${appt.ownerName} · ${appt.phone}</p>
        <p><strong>Pet:</strong> ${appt.petName} (${appt.petType})</p>
        <p><strong>Service:</strong> ${appt.service}</p>
        <p><strong>Date:</strong> ${new Date(appt.date).toLocaleDateString('en-IN')} at ${appt.timeSlot}</p>
        ${appt.notes ? `<p><strong>Notes:</strong> ${appt.notes}</p>` : ''}
        <a href="https://doctorg24.in/admin" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#1B4332;color:#fff;border-radius:6px;text-decoration:none">View in Admin Panel</a>
      </div>`
    });
    res.status(201).json({ message: 'Appointment booked!', appointment: appt });
  } catch(e) { res.status(400).json({ message: e.message }); }
});

router.get('/appointments', protect, adminOnly, async (req, res) => {
  try {
    const q = {};
    if (req.query.status) q.status = req.query.status;
    if (req.query.date) q.date = { $gte: new Date(req.query.date) };
    res.json(await Appointment.find(q).sort({ createdAt: -1 }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

// Patient's own appointments
router.get('/appointments/mine', protect, async (req, res) => {
  try {
    res.json(await Appointment.find({
      $or: [{ patientId: req.user._id }, { email: req.user.email }]
    }).sort({ createdAt: -1 }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

router.put('/appointments/:id', protect, adminOnly, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    // Status change email to patient
    if (req.body.status && appt.email) {
      sendEmail(appointmentStatusEmail(appt, req.body.status));
    }
    res.json(appt);
  } catch(e) { res.status(400).json({ message: e.message }); }
});

router.delete('/appointments/:id', protect, adminOnly, async (req, res) => {
  try { await Appointment.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch(e) { res.status(400).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  ORDERS
// ══════════════════════════════════════════════════════════════
router.post('/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    // Order confirmation to customer
    if (order.email) {
      sendEmail(orderConfirmEmail(order));
    }
    // Admin notification
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🛍️ New Order #${order._id.toString().slice(-6).toUpperCase()} — ₹${order.total}`,
      html: `<div style="font-family:Arial;padding:20px;max-width:500px">
        <h3 style="color:#1B4332">New Order Received!</h3>
        <p><strong>Customer:</strong> ${order.customerName} · ${order.phone}</p>
        <p><strong>Items:</strong> ${order.items?.map(i=>`${i.name} ×${i.quantity}`).join(', ')}</p>
        <p><strong>Total:</strong> ₹${order.total}</p>
        <p><strong>Address:</strong> ${order.address}, ${order.city}</p>
        <a href="https://doctorg24.in/admin" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#1B4332;color:#fff;border-radius:6px;text-decoration:none">View in Admin Panel</a>
      </div>`
    });
    res.status(201).json({ message: 'Order placed!', order });
  } catch(e) { res.status(400).json({ message: e.message }); }
});

router.get('/orders', protect, adminOnly, async (req, res) => {
  try { res.json(await Order.find().sort({ createdAt: -1 })); }
  catch(e) { res.status(500).json({ message: e.message }); }
});

router.get('/orders/mine', protect, async (req, res) => {
  try {
    res.json(await Order.find({
      $or: [{ patientId: req.user._id }, { email: req.user.email }]
    }).sort({ createdAt: -1 }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});

router.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch(e) { res.status(400).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  REVIEWS
// ══════════════════════════════════════════════════════════════
router.get('/reviews', async (req, res) => {
  try { res.json(await Review.find({ approved: true }).sort({ featured: -1, createdAt: -1 })); }
  catch(e) { res.status(500).json({ message: e.message }); }
});
router.get('/reviews/all', protect, adminOnly, async (req, res) => {
  try { res.json(await Review.find().sort({ createdAt: -1 })); }
  catch(e) { res.status(500).json({ message: e.message }); }
});
router.post('/reviews', async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, approved: false });
    res.status(201).json({ message: 'Review submitted! Approval के बाद दिखेगा।' });
  } catch(e) { res.status(400).json({ message: e.message }); }
});
router.put('/reviews/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch(e) { res.status(400).json({ message: e.message }); }
});
router.delete('/reviews/:id', protect, adminOnly, async (req, res) => {
  try { await Review.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch(e) { res.status(400).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  BLOGS — multiple images support
// ══════════════════════════════════════════════════════════════
const blogUpload = makeUploader('blogs');
router.get('/blogs', async (req, res) => {
  try {
    const q = { published: true };
    if (req.query.tag) q.tags = req.query.tag;
    res.json(await Blog.find(q).sort({ createdAt: -1 }));
  } catch(e) { res.status(500).json({ message: e.message }); }
});
router.get('/blogs/all', protect, adminOnly, async (req, res) => {
  try { res.json(await Blog.find().sort({ createdAt: -1 })); }
  catch(e) { res.status(500).json({ message: e.message }); }
});
router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch(e) { res.status(404).json({ message: 'Not found' }); }
});
router.post('/blogs', protect, adminOnly, blogUpload.array('images', 10), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.image  = `/uploads/blogs/${req.files[0].filename}`;
      data.images = req.files.map(f => `/uploads/blogs/${f.filename}`);
      // Resize all blog images
      for (const f of req.files) {
        await resizeImage(f.path, { width: 1200, quality: 82 });
      }
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      data.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    res.status(201).json(await Blog.create(data));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
router.put('/blogs/:id', protect, adminOnly, blogUpload.array('images', 10), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.image  = `/uploads/blogs/${req.files[0].filename}`;
      data.images = req.files.map(f => `/uploads/blogs/${f.filename}`);
      for (const f of req.files) {
        await resizeImage(f.path, { width: 1200, quality: 82 });
      }
    }
    if (req.body.tags && typeof req.body.tags === 'string') {
      data.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    res.json(await Blog.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch(e) { res.status(400).json({ message: e.message }); }
});
router.delete('/blogs/:id', protect, adminOnly, async (req, res) => {
  try { await Blog.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch(e) { res.status(400).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  VIDEOS — YouTube embed
// ══════════════════════════════════════════════════════════════
router.get('/videos', async (req, res) => {
  try { res.json(await Video.find({ published: true }).sort({ createdAt: -1 })); }
  catch(e) { res.status(500).json({ message: e.message }); }
});
router.get('/videos/all', protect, adminOnly, async (req, res) => {
  try { res.json(await Video.find().sort({ createdAt: -1 })); }
  catch(e) { res.status(500).json({ message: e.message }); }
});
router.post('/videos', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Video.create(req.body)); }
  catch(e) { res.status(400).json({ message: e.message }); }
});
router.put('/videos/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Video.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch(e) { res.status(400).json({ message: e.message }); }
});
router.delete('/videos/:id', protect, adminOnly, async (req, res) => {
  try { await Video.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch(e) { res.status(400).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  PATIENTS (admin view)
// ══════════════════════════════════════════════════════════════
router.get('/patients', protect, adminOnly, async (req, res) => {
  try { res.json(await Patient.find().select('-password').sort({ createdAt: -1 })); }
  catch(e) { res.status(500).json({ message: e.message }); }
});

// ══════════════════════════════════════════════════════════════
//  SITE SETTINGS
// ══════════════════════════════════════════════════════════════
const settingsUpload = makeUploader('settings');
router.get('/settings', async (req, res) => {
  try {
    const settings = await SiteSettings.find();
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    res.json(obj);
  } catch(e) { res.status(500).json({ message: e.message }); }
});
router.put('/settings', protect, adminOnly, settingsUpload.single('doctor_photo'), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file) {
      updates['doctor_photo'] = `/uploads/settings/${req.file.filename}`;
      // Resize doctor photo to 600x800 portrait
      await resizeImage(req.file.path, { width: 600, height: 800, quality: 88 });
    }
    const results = {};
    for (const [key, value] of Object.entries(updates)) {
      const s = await SiteSettings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
      results[key] = s.value;
    }
    res.json(results);
  } catch(e) { res.status(400).json({ message: e.message }); }
});

module.exports = router;
