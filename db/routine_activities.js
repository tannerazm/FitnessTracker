const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  const {
    rows: [routineActivity],
  } = await client.query(
    `
    INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
    [routineId, activityId, count, duration]
  );
  return routineActivity;
}

async function getRoutineActivityById(id) {
  const { rows: [activity],  } = await client.query(
    `
    SELECT *
    FROM routine_activities
    WHERE id=$1;
    `, [id]
  );
  return activity;
}

async function getRoutineActivitiesByRoutine({ id }) {
  const { rows: [activity],  } = await client.query(
    `
    SELECT *
    FROM routine_activities
    WHERE "routineId"=$1;
    `, [id]
  );
  return activity;
}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
