const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const client = require("../db/client");
const { getAllActivities, createActivity } = require("../db");
const { UserDoesNotExistError } = require("../errors");

console.log("hi")

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get('/', async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    if (allActivities) {
      next(allActivities);
    }
  } catch (error) {
    next(error);
  }
});
// POST /api/activities
router.post('/', async (req, res, next) => {
    const { name, description } = req.body;
    console.log(name, description, "KAJDFKAJDFKSDJFASDKFJ")
    console.log(req.user, "ADSFKIAJSDFKAJSDFK")

    try {
  
      const user = await createActivity({
        name,
        description,
      });
  
      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        JWT_SECRET
      );
  
      res.send({ message: "Thank you for signing up", token: token, user: user });
    } catch ({ name, message }) {
      next({ name, message });
    }
});
// PATCH /api/activities/:activityId

module.exports = router;
