const express = require("express");
const router = express.Router();
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  updateActivity,
  getActivityById,
  getAllPublicRoutines,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

// GET /api/activities/:activityId/routines
router.get("/:activityId/routines", async (req, res, next) => {
  try {
    const _publicActivity = await getPublicRoutinesByActivity({
      id: req.params.activityId,
    });
    const _allActivities = await getActivityById(req.params.activityId);

    if (!_publicActivity || !_allActivities) {
      res.status(401);
      next({
        name: "Activity not found.",
        message: `Activity ${req.params.activityId} not found`,
      });
    } else {
      const publicRoutines = await getAllPublicRoutines();
      res.send(publicRoutines);
    }
  } catch (error) {
    next(error);
  }
});
// GET /api/activities
router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});
// POST /api/activities
router.post("/", async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const _name = await getActivityByName(name);

    if (_name) {
      res.status(401);
      next({
        error: "Error",
        name: "An activity with this name already exists.",
        message: `An activity with name ${name} already exists`,
      });
    }

    const activity = await createActivity({
      name: name,
      description: description,
    });
    res.send(activity);
  } catch (error) {
    next(error);
  }
});
// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const _name = await getActivityByName(name);
    const _id = await getActivityById(req.params.activityId);

    if (!_id) {
      res.status(401);
      next({
        name: "Activity id not found.",
        message: `Activity ${req.params.activityId} not found`,
      });
    } else if (_name) {
      res.status(401);
      next({
        name: "An activity with that name already exists.",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const _activity = await updateActivity({
        id: req.params.activityId,
        name,
        description,
      });
      res.send(_activity);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
