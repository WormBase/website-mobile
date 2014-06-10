# website-mobile

*Mobile version of the WormBase website*

Note: This application needs to be run on a HTTP server in order to use external templates.

PhoneGap packages can be downloaded here: 
https://build.phonegap.com/apps/544268

## Read More...
*Full documentation can be found on the WormBase Wiki*
http://wiki.wormbase.org/index.php/Developer_documentation#The_Mobile_Website

## Installation instructions for Amazon Linux
### Install Node and npm binaries
 > wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-x64.tar.gz
 > tar xzf node*
 > cd /usr/local
 > sudo mv ~/node* /usr/local/.
 > sudo ln -s node* node
 // add /usr/local/node/bin to your path 

### Install connect and forever npm modules
 > sudo npm install connect
 > sudo npm install forever

## Testing the app

Simple server included to test run the app:

    cd js
    node server.js

The app will be available on localhost:4000

## Running the app in production

    > cd website-mobile/js
    > forever start production.js