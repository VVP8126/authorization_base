import jsonwebtoken from "jsonwebtoken";
import KEY from "../config/config.js";

const roleFilter = (roles) => {
    return function(request, responce, next) {
        if(request.method === "OPTIONS") {
            next();
        }
        try {
            const token = request.headers.authorization.split(" ")[1];
            if(!token) {
                return responce.status(403).json({message: "Not authorized user"});
            }
            const {roles: userRoles} = jsonwebtoken.verify(token, KEY);
            let hasRole = false;
            userRoles.forEach(role => {
                if(roles.includes(role)) {
                    hasRole = true;
                }
            });
            if(!hasRole) {
                return responce.status(403).json({"message": "Access denied: ERROR 403 !"});
            }
            next();
        } catch(e) {
            console.log(e);
            return responce.status(403).json("User isn't authorized")
        }
    }
}

export default roleFilter;
