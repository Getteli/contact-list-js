const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');

//#region Home 
    route.get('/', homeController.index);
//#endregion


//#region Login
    route.get('/login', loginController.index);

    route.post('/login', loginController.login);

    route.post('/register', loginController.register);
//#endregion


module.exports = route;