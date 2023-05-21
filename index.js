const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./config/config");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("./public")); //Necessary to get correct url in frontend

app.use("/users", require("./routes/users"));
app.use("/bookings", require("./routes/bookings"));
app.use("/meetings", require("./routes/meetings"));
app.use("/events", require("./routes/events")); // FALTABA ESTO VALENTI


dbConnection();

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT} with cors() enabled`)
);
