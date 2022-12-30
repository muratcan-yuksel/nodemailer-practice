const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
require("dotenv").config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      //API key from sendgrid
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const app = express();

app.use(bodyParser.json());

const port = process.env.port || 3000;

app.get("/", (req, res) => {
  res.send("Hello World");
});

//login endpoint to use with nodemailer
app.post("/sendMail", async (req, res) => {
  try {
    // Validate input
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) {
      throw new Error("Invalid input");
    }
    await transporter.sendMail({
      to: email,
      from: "muratcanyukselpro@gmail.com",
      subject: subject,
      html: message,
    });
    res.send("Mail sent");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending mail");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
