const express = require('express');
const { getAllRoutines, getAllPublicRoutines } = require('../db');
const router = express.Router();

// GET /api/routines
router.get('/', async (req, res, next) => {
    
  });
// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
