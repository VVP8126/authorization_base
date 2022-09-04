import User from "./../models/User.js";
import Role from "./../models/Role.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { validationResult } from "express-validator/src/validation-result.js";
import KEY from "./../config/config.js";

const generateAccessToken = (id, roles) => {
    const payload = { id, roles };
    return jsonwebtoken.sign(payload, KEY, { expiresIn:"2h" });
}

class AuthController {
    async register(request, responce) {
        try {
            const errors = validationResult(request);
            if(!errors.isEmpty()) {
                return responce.status(400).json({message:"Registration validation errors", errors});
            }
            const { username, password } = request.body; // default username/password = "user"
            const candidate = await User.findOne({ username });
            if(candidate) {
                return responce.status(400).json({message: `User with nickname ${username} exists !` });
            }
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, salt);
            const userRole = await Role.findOne({value:"USER"}); // if registered user
            // const userRole = await Role.findOne({value:"ADMIN"}); // if registered admin
            const user = new User({username, password:passwordHash, roles: [userRole.value]});
            await user.save();
            return responce.json({message: `User ${username} was registered !`});
        } catch(e) {
            console.log(e);
            responce.status(400).json({message: "Registration error !", errorContent: e});
        }
    }

    // For testing:
    //      1) username/password = "user";
    //      2) username="user2", password="user"
    //      3) username="admin", password="admin" - to register using role=ADMIN
    async login(request, responce) {
        try {
            const { username, password } = request.body;
            const authorizedUser = await User.findOne({username});
            if(!authorizedUser) {
                return responce.status(400).json({message: "User isn't registered !"});
            }
            const validatedPassword = bcrypt.compareSync(password, authorizedUser.password);
            if(!validatedPassword) {
                return responce.status(400).json({message: "Wrong password !"});
            }
            const token = generateAccessToken(authorizedUser._id, authorizedUser.roles, authorizedUser.username);
            return responce.status(200).json({ token }); // passed encrypted data using token
        } catch(e) {
            console.log(e);
            responce.status(400).json({message: "Login error !"})
        }
    }
    async getUsers(request, responce) {
        try {
            // Run one time - create 2 lines in table 'roles'
            // const userRole = new Role(); // default value: "USER"
            // const admnRole = new Role({value:"ADMIN"});
            // await userRole.save();
            // await admnRole.save();
            const users = await User.find();
            responce.json({title:"User list", users});
        } catch(e) {
            console.log(e);
        }
    }

    async getUsersToAdmin(request, responce) {
        try {
            const users = await User.find();
            responce.json({title:"Users for admin", users});
        } catch(e) {
            console.log(e);
        }
    }
}
export default new AuthController();
