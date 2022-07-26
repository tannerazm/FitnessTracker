const client = require("./client");

async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  const {
    rows: [routine],
  } = await client.query(
    `
    INSERT INTO routines ("creatorId", "isPublic", name, goal) 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [creatorId, isPublic, name, goal]
  );
  return routine;
}

async function getRoutineById(id) {
  const {
    rows: [routine],
  } = await client.query(
    `
SELECT *
FROM routines
WHERE id=$1;
`,
    [id]
  );
  return routine
}

async function getRoutinesWithoutActivities() {

}

// SELECT 
// routines.id, 
// routines.name AS "creatorName",
// users.id,
// users.username 
// FROM routines
// OUTER JOIN users ON routines.name = users.username;

async function getAllRoutines() {
  const { rows : routines } = await client.query(
    `SELECT users.username AS "creatorName"
    FROM users
    JOIN activities ON users.username = routines.name
    `);
    console.log(routines, "!!!!!");
  return attachActivitiesToRoutines(routines);
}

async function getAllPublicRoutines() {
  const { rows } = await client.query(
    `SELECT *
    FROM routines
    WHERE "isPublic"=true;
    `);
  return rows;
}

async function getAllRoutinesByUser({ username }) { 
  const { rows: [user] } = await client.query(
    `SELECT *
    FROM routines
    WHERE name=$1;
    `, [username]);
  return user;

}

async function getPublicRoutinesByUser({ username }) { }

async function getPublicRoutinesByActivity({ id }) { }

async function updateRoutine({ id, ...fields }) { }

async function destroyRoutine(id) { }

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
