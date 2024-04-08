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

process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED. Shuting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated server!');
  });
});
