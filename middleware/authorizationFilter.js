import jsonwebtoken from "jsonwebtoken";
import KEY from "../config/config.js";

const authorizationFilter = (request, responce, next) => {
    if(request.method === "OPTIONS") {
        next();
    }
    try {
        const token = request.headers.authorization.split(" ")[1];
        if(!token) {
            return responce.status(403).json({message: "Not authorized user"});
        }
        const decodedData = jsonwebtoken.verify(token, KEY);
        request.user = decodedData;
        next();
    } catch(e) {
        console.log(e);
        return responce.status(403).json("User isn't authorized")
    }
}

export default authorizationFilter;
