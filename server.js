const mongoose = require('mongoose'); //we are importing the mongoose package, it is a package that allows us to connect to the mongodb database, it is an object data modeling library for mongodb and node.js, it manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in mongodb.
const dotenv = require('dotenv');
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
); //we are replacing the password in the string with the password that we have in the environment variable
mongoose
  .connect(DB, {})
  .then((con) => console.log('DB connection successful!')); //we are connecting to the database, we are passing in the connection string, we are passing in an object with some options, we are passing in a promise, we are using the then method to handle the promise, if the promise is fulfilled, we are going to log out a message to the console, if the promise is rejected, we are going to log out the error to the console

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR 😂:', err);
//   });

// console.log(app.get('env'));//this is how we access the environment variable, it is a property of the app object, it is a string, it is set to development by default, it is set to production when we set the NODE_ENV variable to production
// console.log(process.env); //`process` is a global variable, it is an object, it contains all the information about the current process, it contains all the environment
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
}); // app.listen is a method that starts a server and listens on a specific port. The port is set to 3000. The callback function is executed when the server starts.

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});



//Environment variables are variables that are defined in the environment in which a process runs. For example, the env command in Linux prints out the environment variables that are defined in the current shell. Environment variables are useful to store system-wide values, for examples, the PATH variable stores the list of directories to search for executable programs. In Node.js, we can access these environment variables by using the process.env object. For example, the following code prints out the value of the PATH variable.
//ex: console.log(process.env.PATH), it is a string, it is a property of the process object, it is a global object, it is an object that is available everywhere in the application.
// we create configuration files for each environment, because we want to have different configurations for each environment.
