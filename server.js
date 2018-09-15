const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//import the routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

// initialize the app
const app = express();

//attach middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect to the mongoose database
const db = require('./config/keys').mongoURI;
mongoose
	.connect(db)
	.then(() => console.log('Connected to Database'))
	.catch(console.log('Error in connecting to DB'));

//setup passport
app.use(passport.initialize());
require('./config/passport')(passport);

//Test Page
app.get('/test', (req, res) => res.send('Test'));

//Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Running on Port ${port}`));
