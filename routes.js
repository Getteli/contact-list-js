const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const contactController = require('./src/controllers/contactController');

//#region Home 
    route.get('/', homeController.index);

    route.post('/', homeController.sendForm);
//#endregion

//#region Contact
    route.get('/contact', contactController.index);

    route.get('/tests/:id?', (req, res) => {
        // ver os parametros friendly
        console.table(req.params);
        // ver os parametros de query
        console.table(req.query);
        res.send('veja o console');
    });

//#endregion

module.exports = route;