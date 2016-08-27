import configureDb from './db';
import configureData from './data';

export default function configure() {
    configureDb();
    configureData();
}