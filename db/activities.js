const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  const {
    rows: [activity],
  } = await client.query(
    `
    INSERT INTO activities(name, description) 
    VALUES ($1, $2)
    RETURNING *;
    `,
    [name, description]
  );

  return activity
}

async function getAllActivities() {
  const { rows } = await client.query(
    `SELECT *
    FROM activities;
    `);

    return rows;
}

async function getActivityById(id) {
  const {
    rows: [activity],
  } = await client.query(
    `
SELECT *
FROM activities
WHERE id=$1
`,
    [id]
  );
  return activity
}

async function getActivityByName(name) {
  const {
    rows: [activity],
  } = await client.query(
    `
SELECT *
FROM activities
WHERE name=$1
`,
    [name]
  );
  return activity
}

async function attachActivitiesToRoutines(routines) {

}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length > 0) {
    await client.query(
      `
      UPDATE activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return await getActivityById(id);
}
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
