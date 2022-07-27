const express = require('express');
const router = express.Router();
const cors = require('cors');
const app = express();

app.use(cors())

app.get('/products/:id', function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for all origins!' })
})



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
router.use('/routine_activities', routineActivitiesRouter);

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000')
})

module.exports = router;
