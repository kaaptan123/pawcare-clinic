const bcrypt = require('bcryptjs');
const { User, Product, Review, SiteSettings } = require('../models');

const DEFAULT_SETTINGS = [
  { key:'clinic_name',       value:'DoctorG24',                           label:'Clinic Name',          group:'clinic' },
  { key:'clinic_tagline',    value:"Agra's Most Trusted Vet Clinic",       label:'Tagline',              group:'clinic' },
  { key:'clinic_phone',      value:'7456064956',                          label:'Phone',                group:'clinic' },
  { key:'clinic_email',      value:'guptamanukrishna10@gmail.com',         label:'Email',                group:'clinic' },
  { key:'clinic_address',    value:'Agra, Uttar Pradesh, India',           label:'Address',              group:'clinic' },
  { key:'clinic_hours',      value:'Mon–Sat: 9AM–8PM | Sun: Emergency',    label:'Hours',                group:'clinic' },
  { key:'clinic_whatsapp',   value:'917456064956',                        label:'WhatsApp',             group:'clinic' },
  { key:'clinic_maps_url',   value:'https://maps.google.com/?q=Agra+Uttar+Pradesh', label:'Maps URL', group:'clinic' },
  { key:'clinic_maps_embed', value:'',                                    label:'Maps Embed URL',       group:'clinic' },
  { key:'doctor_name',       value:'Dr. Manoj Kumar Gupta',                label:'Doctor Name',          group:'doctor' },
  { key:'doctor_degree',     value:'M.V.Sc.',                              label:'Degree',               group:'doctor' },
  { key:'doctor_college',    value:'Mathura Veterinary College',           label:'College',              group:'doctor' },
  { key:'doctor_experience', value:'25+',                                  label:'Experience',           group:'doctor' },
  { key:'doctor_bio',        value:'Agra के सबसे भरोसेमंद पशु चिकित्सकों में से एक। 25 वर्षों से dogs और cats की dedicated सेवा। आपके pet के स्वास्थ्य के लिए हमेशा present।', label:'Bio', group:'doctor' },
  { key:'doctor_photo',      value:null,                                   label:'Photo',                group:'doctor' },
  { key:'doctor_speciality', value:'Dogs & Cats Specialist',               label:'Speciality',           group:'doctor' },
  { key:'upi_id',            value:'7456064956@ptsbi',                    label:'UPI ID',               group:'payment' },
  { key:'upi_name',          value:'Dr. Manoj Kumar Gupta',                label:'UPI Name',             group:'payment' },
  { key:'payment_note',      value:'UPI, GPay, PhonePe, Paytm, Cash accepted', label:'Payment Note',  group:'payment' },
  { key:'price_consultation',value:300,  label:'Consultation Fee ₹',       group:'prices' },
  { key:'price_grooming',    value:500,  label:'Grooming Fee ₹',           group:'prices' },
  { key:'price_vaccination', value:350,  label:'Vaccination Fee ₹',        group:'prices' },
  { key:'price_dental',      value:700,  label:'Dental Cleaning ₹',        group:'prices' },
  { key:'price_xray',        value:800,  label:'X-Ray Fee ₹',              group:'prices' },
  { key:'price_boarding',    value:250,  label:'Boarding/Night ₹',         group:'prices' },
  { key:'delivery_fee',      value:50,   label:'Delivery Fee ₹',           group:'prices' },
  { key:'gst_percent',       value:5,    label:'GST %',                    group:'prices' },
  { key:'social_facebook',   value:'',   label:'Facebook URL',             group:'social' },
  { key:'social_instagram',  value:'',   label:'Instagram URL',            group:'social' },
  { key:'social_youtube',    value:'',   label:'YouTube URL',              group:'social' },
];

const PRODUCTS = [
  { name:'Royal Canin Adult Dog Food (2kg)', category:'dog', subType:'food', emoji:'🦴', price:1299, mrp:1599, badge:'sale', bgColor:'#C8E6C9', inStock:true, rating:4.8, numReviews:124, featured:true },
  { name:"Hill's Science Diet Cat Food (1.5kg)", category:'cat', subType:'food', emoji:'🐟', price:980, badge:'new', bgColor:'#B3E5FC', inStock:true, rating:4.9, numReviews:87, featured:true },
  { name:'Squeaky Plush Toy — Dog', category:'dog', subType:'toy', emoji:'🧸', price:249, bgColor:'#FFE0B2', inStock:true, rating:4.5, numReviews:63, featured:true },
  { name:'Premium Clumping Cat Litter (5kg)', category:'cat', subType:'care', emoji:'🪣', price:499, mrp:650, badge:'sale', bgColor:'#D7CCC8', inStock:true, rating:4.4, numReviews:98, featured:true },
];

const REVIEWS = [
  { name:'Sunita Sharma', city:'Agra, Tajganj', petName:'Bruno', petType:'Dog', rating:5, comment:'Dr. Manoj ji bahut acha treatment karte hain. Bruno ki problem 2 din mein theek ho gayi! Poori family recommend karti hai.', approved:true, featured:true },
  { name:'Rajesh Verma', city:'Agra, Civil Lines', petName:'Mitthu', petType:'Cat', rating:5, comment:'Online booking bahut easy thi. Doctor ne puri detail se samjhaya. DoctorG24 Agra ka best vet hai!', approved:true, featured:true },
  { name:'Priya Agarwal', city:'Agra, Fatehabad Road', petName:'Candy', petType:'Dog', rating:5, comment:'Grooming service top class hai. Staff bahut caring aur friendly hai. Definitely aaenge again.', approved:true, featured:false },
  { name:'Amit Saxena', city:'Agra, Shahganj', petName:'Tiger', petType:'Dog', rating:5, comment:'Emergency mein raat ko call kiya, Doctor turant available the. Itna dedicated doctor milna mushkil hai.', approved:true, featured:true },
  { name:'Meena Gupta', city:'Agra, Kamla Nagar', petName:'Luna', petType:'Cat', rating:4, comment:'Vaccination aur regular checkup ke liye best place. Doctor explain karte hain sab properly.', approved:true, featured:false },
  { name:'Vikas Sharma', city:'Agra, Sikandra', petName:'Max', petType:'Dog', rating:5, comment:'25 saal se doctor patients treat kar rahe hain. Experience clearly dikhta hai. Highly recommend!', approved:true, featured:true },
];

module.exports = async function seed() {
  try {
    if (!await User.findOne({ role:'admin' })) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'DrManoj@2025', 10);
      await User.create({ name:'Dr. Manoj Kumar Gupta', email: process.env.ADMIN_EMAIL || 'guptamanukrishna10@gmail.com', password:hash, role:'admin' });
      console.log('✅ Admin seeded');
    }
    if (!await Product.countDocuments()) { await Product.insertMany(PRODUCTS); console.log('✅ Products seeded'); }
    if (!await Review.countDocuments()) { await Review.insertMany(REVIEWS); console.log('✅ Reviews seeded'); }
    for (const s of DEFAULT_SETTINGS) {
      await SiteSettings.findOneAndUpdate({ key:s.key }, s, { upsert:true, new:true });
    }
    console.log('✅ Settings seeded — DoctorG24 ready!');
  } catch (err) { console.error('Seed error:', err.message); }
};
