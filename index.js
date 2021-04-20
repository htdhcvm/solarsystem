const express = require("express");
const engine = require('consolidate');

const PORT = process.env.PORT || 3000;

const app = express();


app.use("/js", express.static(__dirname + "/js"))
app.use("/modules", express.static(__dirname + "/node_modules"))
app.use("/font", express.static(__dirname + "/font"))
app.use("/image", express.static(__dirname + "/image"))
app.use("/music", express.static(__dirname + "/music"))

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');

app.get("/", function(req, res){
	res.render("main");
});

app.listen(PORT, () => {
	console.log("Server started on port : " + PORT);
});