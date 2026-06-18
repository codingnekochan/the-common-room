const path = require("node:path");
const express = require("express");
const roomRouter = require("./routes/route");
const setLocalEJSParams = require("./middlewares/setParams");
const globalErrorHandler = require("./middlewares/error");
const app = express();
const publicFile = express.static("public");
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(publicFile);
app.use(setLocalEJSParams);
app.use("/", roomRouter);
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
app.use(globalErrorHandler);
