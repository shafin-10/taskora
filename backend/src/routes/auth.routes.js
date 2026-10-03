import { Router } from "express";
import {login, registerUser} from "../controllers/auth.controller.js";
import {userRegistrationValidator, userLoginValidator} from "../validators/index.js";
import validate from "../middlewares/validator.middleware.js";



const router = Router();

router.route("/register").post(userRegistrationValidator(), validate,  registerUser);
router.route("/login").post(userLoginValidator(), login);

export default router;