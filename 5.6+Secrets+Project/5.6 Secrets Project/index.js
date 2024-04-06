import express from "express";
import axios from "axios";

const app=express();
const port=3000;

app.use(express.static("public"));


app.get("/",async(req,res)=>{
   try {
    const response = await axios.get('https://secrets-api.appbrewery.com/random');
    res.render("index.ejs",{
        secret:response.data.secret,
        user:response.data.username
    });
   } 
   catch (error) {
    console.log(error.response.data);
    res.status(500);
   }
});


app.listen(port,()=>{
    console.log(`listening on the port ${port}`);
});





