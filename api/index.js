const express = require('express');
const router = express.Router();


// GET /api/health
router.get('/health', async (req, res, next) => {
    try {
        console.log("All is well")
        res.send("All is well")
    } catch { console.error }
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
const { route } = require('./users');
router.use('/routine_activities', routineActivitiesRouter);

// ROUTER: /api/unknown
router.use((req, res) => {
    // const response = await res.status(404).send("/api/unknown");
    const response = res.send("/api/:unknown");
    console.log(response.status, "response")
    return response.status;
  })


module.exports = router;
