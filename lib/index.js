import "babel-polyfill";
import pug from "pug";

import configureApp from 'jseminck-be-server';

import configureServer from './config/';
import configureRoutes from './routes/';

module.exports = configureApp({
    configureServer: configureServer,
    configureRoutes: configureRoutes,
    index: pug.renderFile("lib/index.jade"),
    port: 8070
});