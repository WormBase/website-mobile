website-mobile
==============

Mobile version of the WormBase website


Note: This application needs to be run on a HTTP server in order to use external templates.

PhoneGap packages can be downloaded here: 
https://build.phonegap.com/apps/544268

Documentation can be found here:
http://wiki.wormbase.org/index.php/Developer_documentation#The_Mobile_Website

Simple server included to test run the app:

    cd js
    node server.js [optional_port_number]

The app will be available on localhost:4000 or the port you specified

Node and the npm module 'connect' will need to be installed for this

    npm install connect
    npm install serve-static

To run the app in production, the npm module 'forever' will need to be installed

    cd js
    forever start production.js





