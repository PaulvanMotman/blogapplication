/// Declaring the modulus

const express = require('express');
const bodyParser= require('body-parser')
const pg = require('pg')
const app = express();

var Sequelize = require('sequelize');
var session = require('express-session');

/// Conecting to the blogapplication database
var sequelize = new Sequelize('blogapplication', 'Paul', 'postgres', {
	host: 'localhost',
	dialect: 'postgres',
	define: {
		timestamps: false
	}
});

/// Setting the jade views
app.set('views', './src/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./resources/'));

/// Declaring the session stuff??
app.use(session({
	secret: 'oh wow very secret much security',
	resave: true,
	saveUninitialized: false
}));


/// Declaring the tables
var user = sequelize.define('user', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});


/// This part renders the landing page

app.get('/', (req, res) => {
	res.render("index")
})

app.post('/login', (req, res) => {
	if(req.body.username.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your email address."));
		return;
	}

	if(req.body.password.length === 0) {
		res.redirect('/?message=' + encodeURIComponent("Please fill out your password."));
		return;
	}

	user.findOne({
		where: {
			username: req.body.username
		}
	}).then(function (user) {
		if (user !== null && req.body.password === user.password) {
			req.session.user = user;
			res.redirect('/profile');
		} else {
			res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
		}
	}, function (error) {
		res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
	});
});



/// This part renders the register page

app.get('/register', (req, res) => {
	res.render("register")
})


/// This part stores the data into the database

app.post('/register', (req, res) => {
  	sequelize.sync().then(function () {
		user.create({
			username: req.body.username,
			password: req.body.password
		}).then(function () {
			res.redirect('/')
		})
	})
})


//// This prt renders the profile
app.get('/profile', (req, res) => {
	res.render("profile", {
      input: req.session.user.username
    })
})



app.listen(3000, function() {
    console.log('listening on 3000')
})
