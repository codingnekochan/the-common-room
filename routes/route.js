const roomRouter = require("express").Router();
const routeController = require("../controllers/controller");

roomRouter.get("/", routeController.getHome);
roomRouter.get("/new", routeController.getPostForm);
roomRouter.post("/new", routeController.createPost);
roomRouter.get("/join", routeController.getClubForm);
roomRouter.post("/join", routeController.joinClub);
roomRouter.get("/login", routeController.getLoginForm);
roomRouter.post("/login", routeController.login);
roomRouter.get("/signup", routeController.getSignUpForm);
roomRouter.post("/signup", routeController.signup);
roomRouter.post("/logout", routeController.logout);

module.exports = roomRouter;
