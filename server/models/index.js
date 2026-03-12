const mongoose = require('mongoose');

// ── USER (Admin) ──────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'patient'], default: 'patient' },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// ── PATIENT ───────────────────────────────────────────────────
const patientSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone:    { type: String, default: '' },
  address:  { type: String, default: '' },
  city:     { type: String, default: 'Agra' },
  avatar:   { type: String, default: null },
}, { timestamps: true });
const Patient = mongoose.model('Patient', patientSchema);

// ── PRODUCT ───────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category:    { type: String, enum: ['dog','cat','both'], required: true },
  subType:     { type: String, enum: ['food','toy','care','medicine','accessory'], required: true },
  price:       { type: Number, required: true, min: 0 },
  mrp:         { type: Number, default: null },
  emoji:       { type: String, default: '📦' },
  bgColor:     { type: String, default: '#E8F5E9' },
  badge:       { type: String, enum: ['new','sale','bestseller','rx',null], default: null },
  image:       { type: String, default: null },
  inStock:     { type: Boolean, default: true },
  rating:      { type: Number, default: 4.5, min: 0, max: 5 },
  numReviews:  { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

// ── APPOINTMENT ───────────────────────────────────────────────
const appointmentSchema = new mongoose.Schema({
  patientId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  ownerName:  { type: String, required: true },
  phone:      { type: String, required: true },
  email:      { type: String, default: '' },
  address:    { type: String, default: '' },
  petName:    { type: String, required: true },
  petType:    { type: String, required: true },
  breed:      { type: String, default: '' },
  age:        { type: String, default: '' },
  service:    { type: String, required: true },
  date:       { type: Date, required: true },
  timeSlot:   { type: String, required: true },
  notes:      { type: String, default: '' },
  status:     { type: String, enum: ['pending','confirmed','completed','cancelled'], default: 'pending' },
  adminNote:  { type: String, default: '' },
  fee:        { type: Number, default: 0 },
}, { timestamps: true });
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ── ORDER ─────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema({
  patientId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  customerName:  { type: String, required: true },
  email:         { type: String, default: '' },
  phone:         { type: String, default: '' },
  address:       { type: String, default: '' },
  city:          { type: String, default: 'Agra' },
  pincode:       { type: String, default: '' },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String, emoji: String, price: Number, quantity: Number,
  }],
  subtotal:      { type: Number, required: true },
  deliveryFee:   { type: Number, default: 50 },
  gst:           { type: Number, default: 0 },
  total:         { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' },
  orderStatus:   { type: String, enum: ['placed','processing','shipped','delivered','cancelled'], default: 'placed' },
  upiRef:        { type: String, default: '' },
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

// ── REVIEW ────────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null },
  name:      { type: String, required: true },
  city:      { type: String, default: 'Agra' },
  petName:   { type: String, default: '' },
  petType:   { type: String, default: '' },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true },
  approved:  { type: Boolean, default: false },
  featured:  { type: Boolean, default: false },
}, { timestamps: true });
const Review = mongoose.model('Review', reviewSchema);

// ── BLOG ──────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  slug:      { type: String, unique: true },
  content:   { type: String, required: true },
  excerpt:   { type: String, default: '' },
  image:     { type: String, default: null },
  tags:      [String],
  published: { type: Boolean, default: false },
  views:     { type: Number, default: 0 },
  author:    { type: String, default: 'Dr. Manoj Kumar Gupta' },
}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);

// ── VIDEO ─────────────────────────────────────────────────────
const videoSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  youtubeUrl:  { type: String, default: '' },
  thumbnail:   { type: String, default: null },
  category:    { type: String, enum: ['experience','treatment','tips','grooming','general'], default: 'general' },
  published:   { type: Boolean, default: true },
  views:       { type: Number, default: 0 },
}, { timestamps: true });
const Video = mongoose.model('Video', videoSchema);

// ── SITE SETTINGS (Admin controls everything) ─────────────────
const siteSettingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
  label: { type: String },
  group: { type: String, default: 'general' },
}, { timestamps: true });
const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = { User, Patient, Product, Appointment, Order, Review, Blog, Video, SiteSettings };
