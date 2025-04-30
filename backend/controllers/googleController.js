// controllers/googleController.js
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';


export const googleCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}&name=${req.user.name}&email=${req.user.email}&role=${req.user.role}&id=${req.user._id}`);
});

  // OPTION 2: Redirect to frontend with token (uncomment if needed)
  // res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
