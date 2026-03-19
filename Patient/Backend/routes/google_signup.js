const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const pool = require('../db');

const client = new OAuth2Client();

router.post('/google-signup', async (req, res) => {
  const { token, clientId } = req.body;
  
  const audience = [
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
    process.env.GOOGLE_ANDROID_CLIENT_ID,
    clientId
  ].filter(Boolean);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: audience.length > 0 ? audience : undefined,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, sub: google_id } = payload;

    const user = await pool.query('SELECT * FROM patients WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      // User doesn't exist, return their Google profile to complete registration on frontend
      return res.json({
        isNewUser: true,
        googleProfile: {
          email,
          fname: given_name,
          lname: family_name,
          google_id,
        }
      });
    }

    // User exists, log them in
    const { password: _, ...patientInfo } = user.rows[0];
    res.status(200).json({
      message: "Login successful!",
      user: patientInfo,
      isNewUser: false,
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(401).json({ message: "Invalid Google token" });
  }
});

module.exports = router;
