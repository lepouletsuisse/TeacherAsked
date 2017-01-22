# TeacherAsked
*Created by Samuel Darcey aka "Le Poulet Suisse"*
## Documentation
For any documentation and explication how to use my application, i invite you to visit my [Landing Page](https://lepouletsuisse.github.io/teacherasked/) (Including Mockups).
## Technology used
- Github Pages
- AngularJS
- Yeoman generator (Angm)
- SocketIO
- Toaster
- Chart.js
- Material-icons
- Bootstrap
- Underscore.js
- Express

## Getting started
To start it in local, follow this instructions in order:
##### Start the database
1. Be sure to have [Docker](https://www.docker.com/) (Version >= 1.12) on your computer.
2. Launch a docker terminal.
3. Start the Mongo database with `docker run -p 27017:27017 mongo:latest`
4. Test if you can connect to the mongoDB with `docker run -it mongo:latest mongo --host 192.168.99.100` (Non-native docker) or `docker run -it mongo:latest mongo --host localhost` (Native docker)

##### Start the server
1. Clone the repo from `git@github.com:lepouletsuisse/TeacherAsked.git`
2. Be sure to have [NodeJS](https://nodejs.org/en/) (Version >= 6.9.1 // NPM Version >= 4.0.2) on your computer.
3. Install the dependencies `npm install`
4. Be sure to have bower installed and updated `npm install --save bower` (Version >= 1.8)
5. Install the Bower dependencies `bower install`
6. Start the server with `node app.js` in the root file.

#### Enjoy!!