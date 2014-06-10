# website-mobile

*Mobile version of the WormBase website*

Note: This application needs to be run on a HTTP server in order to use external templates.

PhoneGap packages can be downloaded here: 
https://build.phonegap.com/apps/544268

## Read More...
*Full documentation can be found on the WormBase Wiki*
http://wiki.wormbase.org/index.php/Developer_documentation#The_Mobile_Website

## Installation instructions for Amazon Linux
### Install Node:
 > git clone git://github.com/joyent/node.git
 > cd node
 > git checkout << branch >>
 > ./configure
 > make
 > sudo make install

### Install npm
 > sudo su
 > PATH=$PATH:/usr/local/wormbase/website/3rdparty/node:/usr/local/wormbase/website/3rdparty/bin
 > export PATH
 > cd /usr/local/wormbase/website/3rdparty ; mkdir npm ; cd npm
 > curl http://npmjs.org/install.sh | sh
 > exit

### Install connect and forever npm modules
 > sudo ./bin/npm install connect
 > sudo ./bin/npm install forever

## Testing the app

Simple server included to test run the app:

    cd js
    node server.js

The app will be available on localhost:4000

## Running the app in production

    > cd website-mobile/js
    > forever start production.js