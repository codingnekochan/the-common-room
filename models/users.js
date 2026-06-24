const pool = require("./pool");

class UserService {
  static async createUser({ username, email, hash }) {
    const query = `
        INSERT INTO users(username,email,hash)
        VALUES($1,$2,$3)
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [username, email, hash]);
    return rows[0];
  }

  static async getUsers() {
    const query = "SELECT * FROM users;";
    const { rows } = await pool.query(query);
    return rows;
  }
  static async findUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }
  static async findUserById(id) {
    const query = `SELECT * FROM users WHERE id = $1`;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
  static async updateUserToMember(id) {
    const query = `UPDATE users SET ismember = true WHERE id = $1`;
    await pool.query(query, [id]);
  }
  static async updateUserToAdmin(id) {
    const query = `UPDATE users SET isadmin = true WHERE id = $1`;
    await pool.query(query, [id]);
  }
}

module.exports = UserService;
