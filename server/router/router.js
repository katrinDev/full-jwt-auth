const Router = require("express").Router;
const userController = require("../controllers/user-controller.js");

const router = new Router();

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.post("/logout", userController.logout); //here we need to delete refresh token from db and a cookie
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh); //to refresh our access token
router.get("/users", userController.getUsers); //endpoint for testing

module.exports = router;
