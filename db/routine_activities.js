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

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length > 0) {
    await client.query(
      `
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return await getRoutineActivitiesByRoutine(id);
}
}

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
