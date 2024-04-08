const path = require('path');
const express = require('express');
const morgan = require('morgan'); //morgan is a logging middleware, it logs information about requests, it is a third party middleware, it is a function that we can use as a middleware, it is a logger, it is a middleware that we can use to log requests to the console, it is a third party middleware, it is a function that we can use as a middleware, it is a logger, it is a middleware that we can use to log requests to the console
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorhandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
//set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https://cdnjs.cloudflare.com',
          'https://api.mapbox.com',
          'https://js.stripe.com',
          'https://cdn.jsdelivr.net',
          'blob:',
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://m.stripe.network',
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://127.0.0.1:*/',
        ],
        upgradeInsecureRequests: [],
      },
    },
  }),
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //morgan('dev') is a middleware, it is a function that we can use as a middleware, 'dev' is the format of the output, it is a predefined format, it is a string, it is a
}

//Limit request from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
}); //allow 100 request for the same ip in one hour
app.use('/api', limiter); // active this middleware for any /api

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); //middleware
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use(compression())

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //this is a property that we are adding to the request object, it is the current time, it is a string, we use toISOString to convert it to a string
  // console.log(req.cookies);
  next();
});
// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'HEllo from the server side!', app: 'Natours' }); // res.status() sets the status of the response to 200, which indicates that the request succeeded. The res.send() method sends a response of type 'text/html'.
// }); //The app.get() method specifies a callback function that will be invoked whenever there is an HTTP GET request with a path ('/') relative to the site root. The callback function takes a request and a response object as arguments, and simply calls res.send() with a string. The string is sent as the response body.

// app.post('/', (req, res) => {
//   res.send('You can post this endpoint...');
// });

// 2) ROUTE HANDLERS (controllers)

/*
// app.get('/api/v1/tours', getAllTours);
//api/v1/tours/:id -> ? optional para
//get is to get tours, post is to create a new tour, patch is to update a tour, delete is to delete a tour
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
*/

// 3) ROUTS

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //we are mounting the router, we are saying that all the routes that start with /api/v1/tours should use the tourRouter router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = '404';

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorhandler);
//4) START SERVER

//Next define routes, which are the URLs that the API can respond to. For example, the following code defines a route for the home page (/) of the API.

module.exports = app;

//static files with express: files are sitting in our file system that we currently access using all routs

//npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev.
//all this is for code formatting, it is a dev dependency
