import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { check } from "express-validator";
import authorizationFilter from "../middleware/authorizationFilter.js";
import roleFilter from "../middleware/roleFilter.js";

const router = new Router();

router.post(
    "/registration",
    [
        check("username", "Username can't be empty").notEmpty(),
        check("password", "Password length - from 4 to 10 symbols").isLength({min:4, max:10}),
    ],
    AuthController.register
);
router.post("/login", AuthController.login);

//  This method is available only for registered users !!!
router.get(
    "/users",
    authorizationFilter, 
    AuthController.getUsers
);  //  To test this method add in 'Headers' of get-request new pair:
    //  "Authorization": "Bearer <Generated token got from login-request (of POST type)>"


//  This method is available only for users with role=ADMIN !!!
router.get(
    "/users-for-admin",
    roleFilter(["ADMIN"]), 
    AuthController.getUsersToAdmin
);

export default router;
