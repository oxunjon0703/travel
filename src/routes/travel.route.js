const { Router } = require('express');
const { postFunc, responsFunc } = require('../controlle/travel.controlle');

const routes = Router();

routes.post('/data', postFunc);
routes.post('/search', responsFunc);

module.exports = routes;