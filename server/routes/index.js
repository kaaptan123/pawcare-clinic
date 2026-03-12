const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { protect, adminOnly } = require('../middleware/auth');
const { makeUploader } = require('../middleware/upload');
const { User, Patient, Product, Appointment, Order, Review, Blog, Video, SiteSettings } = require('../models');
const { sendEmail, appointmentConfirmEmail, appointmentStatusEmail, orderConfirmEmail } = require('../utils/email');

const router = express.Router();

// ═══════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check admin first
    let user = await User.findOne({ email: email.toLowerCase() });
    let isAdmin = true;
    if (!user) { user = await Patient.findOne({ email: email.toLowerCase() }); isAdmin = false; }
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: isAdmin ? 'admin' : 'patient' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: isAdmin ? 'admin' : 'patient' } });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city } = req.body;
    if (await Patient.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const patient = await Patient.create({ name, email: email.toLowerCase(), password: hash, phone, address, city });
    const token = jwt.sign({ id: patient._id, role: 'patient' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: patient._id, name: patient.name, email: patient.email, role: 'patient' } });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/auth/me', protect, (req, res) => res.json(req.user));

router.put('/auth/profile', protect, async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;
    const patient = await Patient.findByIdAndUpdate(req.user._id, { name, phone, address, city }, { new: true }).select('-password');
    res.json(patient);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// PRODUCTS
// ═══════════════════════════════════════════════════════════════
const prodUpload = makeUploader('products');
router.get('/products', async (req, res) => {
  try {
    const { category, subType, featured, search } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (subType) filter.subType = subType;
    if (featured) filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/products/:id', async (req, res) => {
  try { res.json(await Product.findById(req.params.id)); }
  catch (err) { res.status(404).json({ message: 'Not found' }); }
});
router.post('/products', protect, adminOnly, prodUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/products/${req.file.filename}`;
    if (data.price) data.price = parseFloat(data.price);
    if (data.mrp) data.mrp = data.mrp ? parseFloat(data.mrp) : null;
    if (!data.badge || data.badge === 'null') data.badge = null;
    res.status(201).json(await Product.create(data));
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/products/:id', protect, adminOnly, prodUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/products/${req.file.filename}`;
    if (data.price) data.price = parseFloat(data.price);
    if (data.mrp) data.mrp = data.mrp ? parseFloat(data.mrp) : null;
    if (!data.badge || data.badge === 'null') data.badge = null;
    res.json(await Product.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/products/:id', protect, adminOnly, async (req, res) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// APPOINTMENTS
// ═══════════════════════════════════════════════════════════════
router.post('/appointments', async (req, res) => {
  try {
    const appt = await Appointment.create(req.body);
    if (appt.email) sendEmail(appointmentConfirmEmail(appt));
    res.status(201).json({ message: 'Appointment booked!', appointment: appt });
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.get('/appointments', protect, adminOnly, async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    res.json(await Appointment.find(filter).sort({ date: 1, createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/appointments/mine', protect, async (req, res) => {
  try {
    res.json(await Appointment.find({ $or: [{ patientId: req.user._id }, { email: req.user.email }] }).sort({ date: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/appointments/:id', protect, adminOnly, async (req, res) => {
  try {
    const prev = await Appointment.findById(req.params.id);
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (req.body.status && req.body.status !== prev.status && appt.email) {
      sendEmail(appointmentStatusEmail(appt, req.body.status));
    }
    res.json(appt);
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/appointments/:id', protect, adminOnly, async (req, res) => {
  try { await Appointment.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════════
router.post('/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    if (order.email) sendEmail(orderConfirmEmail(order));
    res.status(201).json({ message: 'Order placed!', order });
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.get('/orders', protect, adminOnly, async (req, res) => {
  try { res.json(await Order.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/orders/mine', protect, async (req, res) => {
  try { res.json(await Order.find({ $or: [{ patientId: req.user._id }, { email: req.user.email }] }).sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/orders/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════════
router.post('/reviews', async (req, res) => {
  try {
    await Review.create({ ...req.body, approved: false });
    res.status(201).json({ message: 'Review submitted! Approval के बाद दिखेगा।' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.get('/reviews', async (req, res) => {
  try { res.json(await Review.find({ approved: true }).sort({ featured: -1, createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/reviews/all', protect, adminOnly, async (req, res) => {
  try { res.json(await Review.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/reviews/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/reviews/:id', protect, adminOnly, async (req, res) => {
  try { await Review.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// BLOG
// ═══════════════════════════════════════════════════════════════
const blogUpload = makeUploader('blogs');
router.get('/blogs', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { published: true };
    res.json(await Blog.find(filter).sort({ createdAt: -1 }).select('-content'));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.get('/blogs/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true });
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/blogs', protect, adminOnly, blogUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    data.slug = slugify(data.title, { lower: true, strict: true }) + '-' + Date.now();
    if (req.file) data.image = `/uploads/blogs/${req.file.filename}`;
    res.status(201).json(await Blog.create(data));
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/blogs/:id', protect, adminOnly, blogUpload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/blogs/${req.file.filename}`;
    res.json(await Blog.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/blogs/:id', protect, adminOnly, async (req, res) => {
  try { await Blog.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// VIDEOS
// ═══════════════════════════════════════════════════════════════
router.get('/videos', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { published: true };
    res.json(await Video.find(filter).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.post('/videos', protect, adminOnly, async (req, res) => {
  try { res.status(201).json(await Video.create(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
});
router.put('/videos/:id', protect, adminOnly, async (req, res) => {
  try { res.json(await Video.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(400).json({ message: err.message }); }
});
router.delete('/videos/:id', protect, adminOnly, async (req, res) => {
  try { await Video.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); }
  catch (err) { res.status(500).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// SITE SETTINGS (Admin controls everything)
// ═══════════════════════════════════════════════════════════════
const settingsUpload = makeUploader('settings');
router.get('/settings', async (req, res) => {
  try {
    const settings = await SiteSettings.find();
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    res.json(obj);
  } catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body;
    for (const [key, value] of Object.entries(updates)) {
      await SiteSettings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    }
    res.json({ message: 'Settings saved!' });
  } catch (err) { res.status(400).json({ message: err.message }); }
});
router.post('/settings/upload', protect, adminOnly, settingsUpload.single('file'), async (req, res) => {
  try {
    const { key } = req.body;
    const url = `/uploads/settings/${req.file.filename}`;
    await SiteSettings.findOneAndUpdate({ key }, { value: url }, { upsert: true });
    res.json({ url });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// PATIENTS (Admin manage)
// ═══════════════════════════════════════════════════════════════
router.get('/patients', protect, adminOnly, async (req, res) => {
  try { res.json(await Patient.find().select('-password').sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: err.message }); }
});
router.put('/patients/:id', protect, adminOnly, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.password) data.password = await bcrypt.hash(data.password, 10);
    res.json(await Patient.findByIdAndUpdate(req.params.id, data, { new: true }).select('-password'));
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// ═══════════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════
router.get('/dashboard/stats', protect, adminOnly, async (req, res) => {
  try {
    const [products, pendingAppts, orders, reviews, pendingReviews, patients, blogs] = await Promise.all([
      Product.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Order.countDocuments(),
      Review.countDocuments({ approved: true }),
      Review.countDocuments({ approved: false }),
      Patient.countDocuments(),
      Blog.countDocuments({ published: true }),
    ]);
    const revenueAgg = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
    const revenue = revenueAgg[0]?.total || 0;
    const recentAppts = await Appointment.find().sort({ createdAt: -1 }).limit(5);
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json({ products, pendingAppts, orders, reviews, pendingReviews, patients, blogs, revenue, recentAppts, recentOrders });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
