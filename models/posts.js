const pool = require("./pool");

class PostService {
  static async createPost({ author_id, title, body }) {
    const query = `
        INSERT INTO posts(author_id, title, body)
        VALUES($1,$2,$3)
    `;
    await pool.query(query, [author_id, title, body]);
  }

  static async deletePost(id) {
    const query = `
        DELETE FROM posts WHERE id = $1;
    `;
    await pool.query(query, [id]);
  }

  static async getAllPosts() {
    const query = `
        SELECT p.id, p.title, p.body, p.created_at, u.username AS author
        FROM posts p
        INNER JOIN users u
        ON p.author_id = u.id;
    `;
    const { rows } = await pool.query(query);
    console.log(rows, "rows");
    return rows;
  }
}
module.exports = PostService;
