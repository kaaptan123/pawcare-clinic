const mongoose = require('mongoose');

// ── USER (Admin) ──────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  password:         { type: String, required: true },
  role:             { type: String, default: 'admin' },
  resetToken:       String,
  resetTokenExpiry: Date,
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// ── PATIENT ───────────────────────────────────────────────────
const patientSchema = new mongoose.Schema({
  name:             { type: String, required: true },
  email:            { type: String, required: true, unique: true, lowercase: true },
  password:         { type: String, required: true },
  phone:            String,
  address:          String,
  city:             { type: String, default: 'Agra' },
  role:             { type: String, default: 'patient' },
  resetToken:       String,
  resetTokenExpiry: Date,
}, { timestamps: true });
const Patient = mongoose.model('Patient', patientSchema);

// ── PRODUCT ───────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  category:    { type: String, enum: ['dog','cat','both','bird','fish','other'], default: 'both' },
  subType:     { type: String, enum: ['food','toy','care','medicine','accessory','other'], default: 'care' },
  price:       { type: Number, required: true },
  mrp:         Number,
  image:       String,
  emoji:       { type: String, default: '📦' },
  bgColor:     { type: String, default: '#F0F0F0' },
  badge:       { type: String, enum: ['sale','new','bestseller','rx',null], default: null },
  inStock:     { type: Boolean, default: true },
  featured:    { type: Boolean, default: false },
  rating:      { type: Number, default: 4.5 },
  numReviews:  { type: Number, default: 0 },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

// ── APPOINTMENT ───────────────────────────────────────────────
const appointmentSchema = new mongoose.Schema({
  patientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  ownerName:   { type: String, required: true },
  phone:       { type: String, required: true },
  email:       String,
  address:     String,
  petName:     { type: String, required: true },
  petType:     { type: String, default: 'Dog' },
  breed:       String,
  age:         String,
  service:     { type: String, required: true },
  date:        { type: Date, required: true },
  timeSlot:    { type: String, required: true },
  notes:       String,
  status:      { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
  fee:         Number,
  adminNote:   String,
}, { timestamps: true });
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ── ORDER ─────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema({
  patientId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  customerName: { type: String, required: true },
  email:        String,
  phone:        String,
  address:      String,
  city:         String,
  pincode:      String,
  items: [{
    product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:      String,
    emoji:     String,
    price:     Number,
    quantity:  Number,
  }],
  subtotal:     Number,
  deliveryFee:  { type: Number, default: 50 },
  gst:          Number,
  total:        Number,
  paymentMethod:{ type: String, default: 'UPI' },
  paymentStatus:{ type: String, enum: ['unpaid','paid'], default: 'unpaid' },
  orderStatus:  { type: String, enum: ['placed','processing','shipped','delivered','cancelled'], default: 'placed' },
  upiRef:       String,
  adminNote:    String,
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

// ── REVIEW ────────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  city:      String,
  petName:   String,
  petType:   String,
  rating:    { type: Number, min: 1, max: 5, default: 5 },
  comment:   { type: String, required: true },
  approved:  { type: Boolean, default: false },
  featured:  { type: Boolean, default: false },
}, { timestamps: true });
const Review = mongoose.model('Review', reviewSchema);

// ── BLOG ──────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, unique: true },
  excerpt:     String,
  content:     String,
  image:       String,
  images:      [String],
  tags:        [String],
  author:      { type: String, default: 'Dr. Manoj Kumar Gupta' },
  published:   { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);

// ── VIDEO ─────────────────────────────────────────────────────
const videoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  youtubeUrl:  { type: String, required: true },
  description: String,
  category:    { type: String, enum: ['experience','treatment','tips','grooming','general'], default: 'general' },
  published:   { type: Boolean, default: true },
}, { timestamps: true });
const Video = mongoose.model('Video', videoSchema);

// ── SITE SETTINGS ─────────────────────────────────────────────
const settingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  label: String,
  group: String,
}, { timestamps: true });
const SiteSettings = mongoose.model('SiteSettings', settingsSchema);

module.exports = { User, Patient, Product, Appointment, Order, Review, Blog, Video, SiteSettings };
