const client = require("./client");

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
  // await client.query(
  //   `INSERT INTO routines("activityId")
  //   VALUES ($1, $2, $3)
  //   ON CONFLICT ("authorId") DO NOTHING
  //   `);

  //   const { rows } = await client.query(
  //     `SELECT *
  //     FROM routines;
  //     `);

  const { rows } = await client.query(
    `SELECT *
      FROM routines;
      `);
  return rows;
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
