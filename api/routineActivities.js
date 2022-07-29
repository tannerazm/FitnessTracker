const express = require('express');
const { getRoutineById, updateRoutineActivity, getRoutineActivityById, destroyRoutineActivity} = require('../db');
const { requireUser } = require('./utils');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
    const { count, duration } = req.body;
    const { routineActivityId } = req.params;
    const { id, username } = req.user;
    const routineToUpdate = await getRoutineActivityById(routineActivityId);
    const _getRoutineById = await getRoutineById(routineActivityId)
    if (routineToUpdate.id !== id){
        res.status(403).send({
            error: "ERROR",
            message: `User ${username} is not allowed to update ${_getRoutineById.name}`,
            name: "cannot ",
        });
    }
    else {
        const updatedRoutineActivity = await updateRoutineActivity({ id: id, count, duration})
        res.send(updatedRoutineActivity)
        }


})
// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async (req, res) => {
    const { id, username } = req.user;
    const { routineActivityId } = req.params;
    const routineActivtyToUpdate = await getRoutineActivityById(routineActivityId);
    const _getRoutineById = await getRoutineById(routineActivtyToUpdate.routineId)
    console.log(_getRoutineById, "get routine by id")
    if (_getRoutineById.creatorId !== id) {
      res.status(403).send({
        error: "ERROR",
        message: `User ${username} is not allowed to delete ${_getRoutineById.name}`,
        name: "cannot ",
      });
    } else {
      const destroyedActivity = await destroyRoutineActivity(routineActivityId);
      res.send(destroyedActivity);
    }
  });
module.exports = router;
