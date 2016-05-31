/// Declaring the modulus

const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const pg = require('pg')

var Sequelize = require('sequelize');

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

/// This part renders the landing page

app.get('/', (req, res) => {
  res.render("index")
 })




app.listen(3000, function() {
    console.log('listening on 3000')
})
