var sequelize = require('sequelize');
var db = new sequelize('postgres://postgres:toanprox7@localhost:5433/users');
var User = db.define('users',{
    username:sequelize.STRING,
    email:sequelize.STRING,
    password:sequelize.STRING,
    fullname:sequelize.STRING,
    status:sequelize.STRING,
    token:sequelize.STRING
});
User.sync();


module.exports = User;