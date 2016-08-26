#!/bin/sh

rm -rf jseminck-be-api-authentication
mkdir jseminck-be-api-authentication
mv ./jseminck-be-api-authentication.tgz jseminck-be-api-authentication/jseminck-be-api-authentication.tgz
cd jseminck-be-api-authentication
tar -zxvf jseminck-be-api-authentication.tgz
node-gyp rebuild
npm install
npm run stop
npm run start
rm jseminck-be-api-authentication.tgz
cd ..
rm deploy.sh
