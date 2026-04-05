require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/crowdfunder");

app.use("/auth", require("./routes/authRoute.js")); 
app.use("/projects", require("./routes/projectsRoute.js"));
app.use("/investments", require("./routes/investmentsRoute.js"));
app.use("/admin", require("./routes/adminRoute.js"));

app.listen(3000, () => console.log("Server is working"));