const getHome = (req, res) => {
  res.render("index");
};
const getClubForm = (req, res) => {
  res.render("join");
};
const joinClub = (req, res) => {};
const getSignUpForm = (req, res) => {
  res.render("signup");
};
const signup = (req, res) => {};
const getLoginForm = (req, res) => {
  res.render("login");
};
const login = (req, res) => {};
const logout = (req, res) => {};
const getPostForm = (req, res) => {
  res.render("new-post");
};
const createPost = (req, res) => {};

module.exports = {
  getClubForm,
  getHome,
  getSignUpForm,
  getLoginForm,
  getPostForm,
  signup,
  login,
  logout,
  joinClub,
  createPost,
};
