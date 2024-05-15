require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();
const useRouteApi = require("./app/routes/api")
const corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use('/public/uploads', express.static('public/uploads'));


const db = require('./app/models');
db.sequelize.sync();
app.get("/", (req, res) => {
    res.json({ message: "Not found" });
});
useRouteApi(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
