const roomRouter = require("express").Router();
const authController = require("../controllers/auth");
const postController = require("../controllers/post");

roomRouter.get("/", postController.getPosts);
roomRouter.get("/new", postController.getPostForm);
roomRouter.post("/new", postController.createPost);
roomRouter.post("/post/:id", postController.deletePost)
roomRouter.get("/join", authController.getClubForm);
roomRouter.post("/join", authController.joinClub);
roomRouter.get("/login", authController.getLoginForm);
roomRouter.post("/login", authController.login);
roomRouter.get("/signup", authController.getSignUpForm);
roomRouter.post("/signup", authController.signup);
roomRouter.post("/logout", authController.logout);

module.exports = roomRouter;
