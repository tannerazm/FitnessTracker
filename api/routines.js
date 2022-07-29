const express = require('express');
const { requireUser } = require('./utils')
const { getUserById, getAllRoutines, getAllPublicRoutines, createRoutine, updateRoutine, destroyRoutine, getRoutineById } = require('../db');
const router = express.Router();

// GET /api/routines
router.get('/', async (req, res, next) => {
  try {
    const allPublicRoutines = await getAllPublicRoutines();
    res.send(allPublicRoutines)

  } catch (error) {
    next(error);
  }
});
// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { id } = req.user;
  try {
    const newRoutine = await createRoutine({ creatorId: id, isPublic: isPublic, name: name, goal: goal });
    res.send(newRoutine)
  }
  catch (error) {
    next(error);
  }

});
// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async (req, res) => {
  const { isPublic, name, goal } = req.body;
  const { routineId } = req.params
  const { username } = req.user
  const routineToUpdate = await getRoutineById(routineId)
  if (routineToUpdate) {
    const _updateRoutine = await updateRoutine({id: routineId, isPublic, name, goal})
    res.send(_updateRoutine)
  }
  else {
    res.status(403)
    res.send({error: "ERROR", message: `User ${username} is not allowed to update ${routineToUpdate.name}`, name: "cannot "})
  }
}
)
// DELETE /api/routines/:routineId
// router.delete('/:routineId',  )
// POST /api/routines/:routineId/activities

module.exports = router;
