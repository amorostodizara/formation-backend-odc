require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", require("./routes/auth"));
app.use("/participants", require("./routes/participants"));

app.listen(PORT, () => {
  console.log(`[${PORT}]`);
});
 