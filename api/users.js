/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getPublicRoutinesByUser, getAllRoutines, getAllRoutinesByUser } = require("../db");
const client = require("../db/client");
const { JWT_SECRET } = process.env;
const { createUser, getUserByUsername } = require("../db/users");
const { requireUser } = require('./utils');

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    if (username) {
      const _user = await getUserByUsername(username);

      if (_user) {
        res.status(401)
        next({
          error: "USERNAME ALREADY EXISTS",
          message: `User ${username} is already taken.`,
          name: "UserAlreadyExists",
        });
      }
    }

    if (password.length < 8) {
      res.status(401)
      next({
        error: "PASSWORD TOO SHORT",
        message: "Password Too Short!",
        name: "PasswordIsTooShort",
      });
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
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await getUserByUsername(username);
    const token = jwt.sign(user, JWT_SECRET)
    if (user) {
      res.send({ token: token, message: "you're logged in!", user: user });

      return user;
    }
  } catch (error) {
    next(error);
  }
});
// GET /api/users/me
router.get("/me", requireUser, async (req, res, next) => {
  const { user } = req
  try {
    res.send(user)
  }
  catch (error) {
    next(error);
  }
});
// GET /api/users/:username/routines
router.get('/:username/routines', requireUser, async (req, res, next) => {
  
  const { username } = req.params
  const user = await getUserByUsername(username)
  const joe = await getPublicRoutinesByUser({username: username}
    ) //any user
  const bob = await getAllRoutinesByUser({username: username}
    ) //specific user logged in
  try {
    if (!username) {
      next({
        error: "PASSWORD TOO SHORT",
        message: "Password Too Short!",
        name: "PasswordIsTooShort",
      });
    }
    else if (req.user && user.id === req.user.id) {
      res.send(bob)
    }
    else {
      res.send(joe)
    }
  }
  catch (error) {
    next(error);
  }
})

module.exports = router;
