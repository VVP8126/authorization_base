import express from "express";
import mongoose from "mongoose";
import router from "./rooters/router.js";

const PORT = process.env.PORT || 5200; // Default port got from 'process.env' if not defined - using 5200
const URIM = "mongodb://0.0.0.0:27017/";

const application = express();
application.use(express.json());
application.use("/auth", router);

const startServer = () => {
    try {
        application.listen(
            PORT,
            () => {
                mongoose.connect(
                    URIM,
                    {dbName: 'users', useNewUrlParser: true, useUnifiedTopology: true},
                    function (error) {
                        if(error) throw error;
                        console.log("Connection with MongoDB set up !");
                    }
                );
                console.log(`Server is waiting on PORT:${PORT}`);
                console.log(`Use Postman to test this example`);
            }
        );
    } catch(e) {
        console.log(e);
    }
}
startServer();
