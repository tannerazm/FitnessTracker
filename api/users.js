/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { createUser, getUserByUsername } = require("../db/users");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if(username) {
        const _user = await getUserByUsername(username);
  
        if (_user) {
          res.send({
            error: 'USERNAME ALREADY EXISTS',
            message: `User ${username} is already taken.`,
            name: 'UserAlreadyExists'
          });
        }
    }

    if(password.length < 8){
        res.send({
            error: 'PASSWORD TOO SHORT',
            message: 'Password Too Short!',
            name: 'PasswordIsTooShort'
        })
    }

    const user = await createUser({
      username,
      password,
    });


    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      {
        expiresIn: "1y",
      }
    );

    res.send({ message: "Thank you for signing up", token: token, user: user });

    } 
    
    catch ({ name, message }) {
    next({ name, message })
  }
});
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
