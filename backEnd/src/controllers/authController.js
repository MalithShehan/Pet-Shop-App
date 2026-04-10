const authService = require('../services/authService');
const asyncHandler = require('../middleware/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.register({ name, email, password });

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  return res.json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  return res.json({
    success: true,
    data: { user },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);

  return res.json({
    success: true,
    message: 'Profile updated',
    data: { user },
  });
});

const updateAddress = asyncHandler(async (req, res) => {
  const address = await authService.updateAddress(req.user.id, req.body);

  return res.json({
    success: true,
    message: 'Address updated',
    data: { address },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);

  return res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updateAddress,
  changePassword,
};
