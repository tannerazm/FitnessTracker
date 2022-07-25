const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {

    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING (username);
      `,
      [username, password]
    );
    return user;
}

async function getUser({ username, password }) {

  if (password) {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT username
    FROM users
    WHERE username=$1 AND password=$2;    
    `,
      [username, password]
    );
    return user;
    }
    else {
      return false
    }
  }

async function getUserById(userId) {

}

async function getUserByUsername(userName) {
    const {
      rows: [user],
    } = await client.query(
      `
    SELECT *
    FROM users
    WHERE username=$1;    
    `,
      [userName]
    );
    return user;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
