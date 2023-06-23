const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Connect to DB
mongoose
.connect(process.env.DB_CONNECT)
.then(() => console.log('Connect DB'))
.catch((e) => console.log(e));

// Import routes
const noteRoute = require("./routes/NoteRoute");
const userRoute = require("./routes/UserRoute");

// Routes Middlewares
app.use("/api/notes", noteRoute);
app.use("/api/users", userRoute);


// Server static assets if in production
if(process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static("client/build"));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + "/client/build/index.html"));
    });
} 

app.listen(process.env.PORT || 8080, () => {
    console.log("Backend server is running");
})
