const express = require("express");
const { send } = require("express/lib/response");
const https = require("https");
const request= require("request");
const app=express();

app.use(express.urlencoded({extended:true}));

app.use(express.static("Staticlocal"));  // to load up local css and images stored in "staticlocal" folder 

app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res)
{
    const name = req.body.fname;
    const emailadd = req.body.email;
    const mobile= req.body.num;
    console.log(name, emailadd);

    var data = {
        members: [
            {
            email_address: emailadd,
            status: "subscribed",
            merge_fields: {
                FNAME: name,
                PHONE: mobile
            }
        }
        ]
    };

    const json_data = JSON.stringify(data);
    const url ="https://us20.api.mailchimp.com/3.0/lists/b952197496";
    const option ={
    method: "POST",
    auth: "ankur1:865483c5f9b835cedc339a295017040a-us20"
}
const requests = https.request(url,option,function(response)
{
    if(response.statusCode===200)
    {
        res.sendFile(__dirname+"/success.html");
    }
    else{
        res.sendFile(__dirname+"/fail.html");
    }
    response.on("data",function(data)
    {
        console.log(JSON.parse(data));
    })
})



requests.write(json_data);
requests.end();

});

app.post("/fail",function(req,res)
{
    res.redirect("/");
})



app.listen(process.env.PORT || 3000,function()
{
    console.log("the server is running !");
})

//865483c5f9b835cedc339a295017040a-us20
//b952197496