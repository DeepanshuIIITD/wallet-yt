// const express = require("express")    // this is an old way
import dotenv from "dotenv";
import express from "express"; // another or new way ( need to make changes in package.json)
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js";


dotenv.config()

const app = express()  // creates an express application

if(process.env.NODE_ENV === "production") job.start();

const PORT = process.env.PORT || 5001 ;
// const route = router();

app.get("api/health", (req,res)=>{
    res.status(200).json({status:"Ok"});
})

// middleware to check ( using for post api)
app.use(express.json());
// rate limmiter middleware
app.use(rateLimiter);

// custome middleware
// app.use((req,res,next)=>{
//     console.log("we have recieved your req and the method is",req.method);
//     next();
// });


// formality on web checking
app.get('/',(req,res)=>{
    res.send("Hey this respond from server ");
});

app.use("/api/transactions",transactionsRoute)

initDB().then(() => {
    app.listen(PORT,()=>{
    console.log("Hey server is running on port: ",PORT);
});
})