#!/bin/sh

rm -rf jseminck-be-api-expenses
mkdir jseminck-be-api-expenses
mv ./jseminck-be-api-expenses.tgz jseminck-be-api-authentication/jseminck-be-api-expenses.tgz
cd jseminck-be-api-expenses
tar -zxvf jseminck-be-api-expenses.tgz
node-gyp rebuild
npm install
npm run stop
npm run start
rm jseminck-be-api-expenses.tgz
cd ..
rm deploy.sh
