const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const pool = require('../db');

const client = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

router.post('/google-signup', async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      email,
      given_name,
      family_name,
      sub: google_id,
    } = payload;

    let user = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO users
        (fname, lname, email, google_id)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [given_name, family_name, email, google_id]
      );

      return res.json({
        user: user.rows[0],
        isNewUser: true,
      });
    }

    res.json({
      user: user.rows[0],
      isNewUser: false,
    });

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
