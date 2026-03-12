const jwt = require('jsonwebtoken');
const { User, Patient } = require('../models');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check both User (admin) and Patient
    const user = await User.findById(decoded.id).select('-password')
                 || await Patient.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    req.userType = user.constructor.modelName;
    next();
  } catch { res.status(401).json({ message: 'Token invalid' }); }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  next();
};

const patientOrAdmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.userType === 'Patient') return next();
  res.status(403).json({ message: 'Access denied' });
};

module.exports = { protect, adminOnly, patientOrAdmin };
