const express = require('express');
const { requireUser } = require('./utils')
const { getUserById, getAllRoutines, getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById } = require('../db');
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
  const { id, username} = req.user;
  const _id = await getRoutineById(id)
  if (_id) {
    const _updateRoutine = await updateRoutine({id: id, isPublic, name, goal})
    res.send(_updateRoutine)
  }
  else {
    res.status(403)
    res.send({message: `User ${username} is not allowed to update ${name}`, name: "please work im begging"})
  }
}
)
// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
