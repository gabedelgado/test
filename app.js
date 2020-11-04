const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const mailChimpAPIKey = "5a2b7fa0a43dfba4fd5683f794e216b9-us2";
const audienceID = "464f74a461"

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) =>{
    res.sendFile(__dirname + "\\signup.html");
});

app.post("/", (req, res) => {
    console.log(req.body);
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.inputEmail;
    const mailChimpAPIKey = "5a2b7fa0a43dfba4fd5683f794e216b9-us2";
    const audienceID = "464f74a461"
    
    const addPersonJSON = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
            }
        }]
    };
    const smallJSON = JSON.stringify(addPersonJSON);
    const url = "https://us2.api.mailchimp.com/3.0/lists/" + audienceID;
    const options = {
        method: 'POST',
        auth: "gabe:" + mailChimpAPIKey,
    };
    const therequest = https.request(url, options, (response) => {
        
        response.on("data", (data) => {
            const unpackedData = JSON.parse(data);
            if (unpackedData.error_count >= 1){
                res.sendFile(__dirname + "\\failure.html");
            }
            else {
                res.sendFile(__dirname + "\\success.html");
            }
        })
    });
    therequest.write(smallJSON);
    therequest.end();
});

app.post("/failure", (req, res) => {
    res.redirect("/")
});

app.listen(process.env.PORT, () => {
    console.log("listen on 3000");
});