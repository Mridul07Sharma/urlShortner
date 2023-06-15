if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express=require("express");
const path=require("path");
const { connectToMongoDB }=require("./connect");
const urlRoute=require("./routes/url");
const staticRoute=require("./routes/staticRouter");
const URL = require("./models/url");
const BASE_URL=process.env.BASE_URL || "mongodb://127.0.0.1:27017/short-url";
const app=express();
const PORT= process.env.PORT || 8001;
connectToMongoDB(BASE_URL)
.then(()=>console.log('MongoDB Connected'));
app.set("view engine","ejs");
app.set("views", path.resolve("./views"))
app.use(express.urlencoded({extented:false}));
app.use(express.json());
app.use("/url",urlRoute);
app.use("/",staticRoute);
app.get('/url/:shortId',async (req,res)=>{
   const shortId=req.params.shortId;
   const entry = await URL.findOneAndUpdate({
        shortId,
    },
    {
            $push:{
            visitHistory:{
                timestamp:Date.now(),
            }
        },
    }
    );
    res.redirect(entry.redirectURL);
});
app.listen(PORT,()=>console.log(`Server started at ${PORT}`));