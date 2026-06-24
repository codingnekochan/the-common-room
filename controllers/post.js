const { body, matchedData ,validationResult} = require("express-validator");
const PostService = require("../models/posts");
const { mapError } = require("../middlewares/error");

const validatePostContent = [
  body("title").trim().notEmpty().withMessage("Subject is required"),
  body("body")
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("You cannot submit an empty field"),
];

const getPosts = async (req, res) => {
  const posts = await PostService.getAllPosts();
  console.log(posts, "posts");
  res.render("index", { posts });
};
const getPostForm = (req, res) => {
  if (req.isUnauthenticated()) {
    return res.redirect("/login");
  }
  const error = req.session.postError;
  delete req.session.postError;
  return res.render("new-post", { error });
};

const createPost = [
  validatePostContent,
  async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        req.session.postError = mapError(result);
        return res.redirect("/new");
      }
      const author_id = req.user.id;
      const { title, body } = matchedData(req);
      await PostService.createPost({ author_id, title, body });
      return res.redirect("/");
    } catch (error) {
      next(error);
    }
  },
];

const deletePost = async (req, res, next) => {
  try {
    const id = req.params.id;
    await PostService.deletePost(id);
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getPostForm,
  createPost,
  getPosts,
  deletePost,
};
