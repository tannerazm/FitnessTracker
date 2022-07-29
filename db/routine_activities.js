const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
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
  } catch (error) {
    return error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE id=$1;
    `,
      [id]
    );
    return activity;
  } catch (error) {
    return error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE "routineId"=$1;
    `,
      [id]
    );
    return rows;
  } catch (error) {
    return error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
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

      return await getRoutineActivityById(id);
    }
  } catch (error) {
    return error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(
      `
  DELETE FROM routine_activities
  WHERE id=$1
  RETURNING *;
  `,
      [id]
    );
    return routineActivity;
  } catch (error) {
    return error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    if (routineActivityId === userId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
