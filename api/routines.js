const express = require("express");
const { requireUser } = require("./utils");
const {
  getAllPublicRoutines,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  getRoutineById,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine,
} = require("../db");
const router = express.Router();

// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const allPublicRoutines = await getAllPublicRoutines();
    res.send(allPublicRoutines);
  } catch (error) {
    next(error);
  }
});
// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { id } = req.user;
  try {
    const newRoutine = await createRoutine({
      creatorId: id,
      isPublic: isPublic,
      name: name,
      goal: goal,
    });
    res.send(newRoutine);
  } catch (error) {
    next(error);
  }
});
// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res) => {
  const { isPublic, name, goal } = req.body;
  const { routineId } = req.params;
  const { id, username } = req.user;
  const routineToUpdate = await getRoutineById(routineId);
  if (routineToUpdate.creatorId !== id) {
    res.status(403).send({
      error: "Error",
      message: `User ${username} is not allowed to update ${routineToUpdate.name}`,
      name: "User is not allowed to update this routine.",
    });
  } else {
    const _updateRoutine = await updateRoutine({
      id: id,
      isPublic,
      name,
      goal,
    });
    res.send(_updateRoutine);
  }
});
// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res) => {
  const { id, username } = req.user;
  const { routineId } = req.params;
  const routineToUpdate = await getRoutineById(routineId);
  if (routineToUpdate.creatorId !== id) {
    res.status(403).send({
      error: "Error",
      message: `User ${username} is not allowed to delete ${routineToUpdate.name}`,
      name: "User is not allowed to delete this routine.",
    });
  } else {
    await destroyRoutine(routineId);
    res.send(routineToUpdate);
  }
});
// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  const { activityId, count, duration } = req.body;
  const { routineId } = req.params;

  const bob = await getRoutineActivitiesByRoutine({ id: routineId });
  const filteredRoutineArray = bob.filter(
    (element) => activityId === element.activityId
  );

  if (filteredRoutineArray && filteredRoutineArray.length) {
    next({
      error: "Error",
      message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
      name: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
    });
  } else {
    const routineWithActivity = await addActivityToRoutine({
      routineId,
      activityId,
      count,
      duration,
    });

    if (routineWithActivity) {
      res.send(routineWithActivity);
    } else {
      next({
        error: "Error",
        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
        name: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
      });
    }
  }
});

module.exports = router;
