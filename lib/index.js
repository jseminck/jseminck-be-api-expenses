import "babel-polyfill";

import configureApp from 'jseminck-be-server';

import configureServer from './config/';
import configureRoutes from './routes/';

module.exports = configureApp({
    configureServer: configureServer,
    configureRoutes: configureRoutes
});