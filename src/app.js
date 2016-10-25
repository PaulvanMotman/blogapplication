/// Declaring the modulus

const express = require('express');
const bodyParser= require('body-parser')
const pg = require('pg')
const app = express();
const bcrypt = require('bcrypt')

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

/// Setting up session
app.use(session({
	secret: 'oh wow very secret much security',
	resave: true,
	saveUninitialized: false
}));


/// Declaring the tables of the database
var user = sequelize.define('user', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});

var post = sequelize.define('post', {
	blogpost: Sequelize.TEXT
});

var comment = sequelize.define('comment', {
	commentpost: Sequelize.TEXT
});


/// Declaring the relationships between tables
user.hasMany(post);
post.belongsTo(user);

post.hasMany(comment);
comment.belongsTo(post);

user.hasMany(comment);
comment.belongsTo(user);


/// Storing stuff in the database (it initualises it) 
sequelize.sync({force: false}).then(()=>{
	console.log('sync completed')
})


/// This part renders the landing page

app.get('/', (req, res) => {
	res.render("index")
});


/// This part logs the user in
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
		bcrypt.compare(req.body.password, user.password, function (err, response) {
			if (user !== null && response == true) {
				req.session.user = user;
				res.redirect('/profile');
			} else {
				res.redirect('/?message=' + encodeURIComponent("Invalid email or password."));
			}
		})
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
	bcrypt.hash(req.body.password, 9, function(err, hash) {
		if (err) {
			return err
		}
		else {
			user.create({
				username: req.body.username,
				password: hash
			})
		}
	})
	res.redirect('/')
})

/// This part creates the logout

app.get('/logout', (req, res) => {
	req.session.destroy(function(error) {
		if(error) {
			throw error;
		}
		res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
	})
});


//// This part renders the profile
app.get('/profile', (req, res) => {
	Promise.all([
		user.findOne({
			where: {
				id: req.session.user.id
			}
		}),
		post.findAll({ include:[{model: user}, {model: comment, include: [user]}]})
	]).then((result) => {
		result[0].getPosts({ include:[{model: user}, {model: comment, include: [user]}]}).then((blogs) => {
			res.render("profile", {
				username: req.session.user.username,
				blogpost: blogs,
				allposts: result[1]
			})
		})
	})
})

/// this part submits the post to the database
app.post('/submitpost', (req, res) => {
	user.findOne({
		where: {
			id: req.session.user.id
		}
	}).then(function (theuser) {
		theuser.createPost({
			blogpost: req.body.post
		}).then(function () {
			res.redirect('/profile')
		})
	})
})

/// this part submits the comment to the database

app.post('/submitcomment', (req, res) => {
	Promise.all([
        comment.create({
            commentpost: req.body.comment
        }),
        user.findOne({
            where: {
                id: req.session.user.id
            }
        }),
        post.findOne({
            where: {
                id: req.body.id
            }
        })
	]).then(function(allofthem){
		console.log(allofthem[2])
		allofthem[0].setUser(allofthem[1])
		allofthem[0].setPost(allofthem[2])
	}).then(function(){
		res.redirect('/profile')
	})
})


/// This part tells the app to listen to a server
app.listen(3000, function() {
	console.log('listening on 3000')
})
