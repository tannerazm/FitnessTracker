const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

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


async function getAllRoutines() {
  const { rows : routines } = await client.query(`
    SELECT
      routines.*,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
    `);
  return attachActivitiesToRoutines(routines);
}

async function getAllPublicRoutines() {
  const { rows : routines } = await client.query(`
    SELECT
      routines.*,
      users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      WHERE "isPublic"=true
    `);
  return attachActivitiesToRoutines(routines);
}

async function getAllRoutinesByUser({ username }) { 
  
  const { rows : routines } = await client.query(`
  SELECT
    routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE users.username=$1
  `, [username]);
  return attachActivitiesToRoutines(routines);

}

async function getPublicRoutinesByUser({ username }) { 
  const { rows : routines } = await client.query(`
  SELECT
    routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE users.username=$1 AND "isPublic"=true
  `, [username]);
  return attachActivitiesToRoutines(routines);
 }

async function getPublicRoutinesByActivity({ id }) { 
  const { rows : routines } = await client.query(`
  SELECT
    routines.*,
    users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routines.id = routine_activities."routineId"
    WHERE "isPublic"=true AND routine_activities."activityId"=$1
  `, [id]);
return attachActivitiesToRoutines(routines);
 }

async function updateRoutine({ id, ...fields }) { 
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length > 0) {
    await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return await getRoutineById(id);
 }
}

async function destroyRoutine(id) { 
  await client.query (`
  DELETE FROM routine_activities
  WHERE "routineId"=$1
  `, [id])
  const { rows: routines } = await client.query (`
  DELETE FROM routines
  WHERE id=$1
  `, [id])
  return routines
 }

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