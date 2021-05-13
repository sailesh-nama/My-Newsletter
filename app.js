const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

client.setConfig({
  apiKey: "da9d0c3c4a67ba599e31a5646fff7699-us1",
  server: "us1",
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const phone = req.body.phone;

  console.log(firstName, lastName, email, phone);

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone
  }

    async function run() {
      const response = await client.lists.addListMember("b9fefd7147", {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
            FNAME: subscribingUser.firstName,
            LNAME: subscribingUser.lastName,
            PHONE: subscribingUser.phone
        }
      });

      console.log(response);

      res.sendFile(__dirname + "/success.html")

    };
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.post("/success", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

// da9d0c3c4a67ba599e31a5646fff7699-us1
// b9fefd7147
