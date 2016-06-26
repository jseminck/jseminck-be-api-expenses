import configureApp from './../../jseminck-be-server/lib';

import configureServer from './config/';
import configureRoutes from './routes/';

module.exports = configureApp({
    configureServer: configureServer,
    configureRoutes: configureRoutes
});