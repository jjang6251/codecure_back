const models = require("./models");

models.User.create({
    user_name: "jjang",
    user_password: "1234",
    user_id: "awfaweg",
}).then(_ => console.log("Data is created!"));