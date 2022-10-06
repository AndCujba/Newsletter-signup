const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));  //pentru file-urile statice din comp - css
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){  //cand facem redirect dupa failure. codul se intoarce aici si vede care este route-ul
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/315eee3216"; //us9 - din API key la urma, ultimul nr mare este list id
    
    const options = {
        method: "POST",
        auth: "andreea1:4c796b55972f2d4916f1bee3fa514a93-us9"
    }
    
    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }




        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    // request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {  //redirect la home page cand apare pagina failure
    res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() { //denumirea la portul care il va alege sistemul pentru deploy
    console.log("server is running on port 3000.");
});



//API key mailchimp
//4c796b55972f2d4916f1bee3fa514a93-us9

//list ID
//315eee3216