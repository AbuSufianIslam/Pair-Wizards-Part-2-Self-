const express = require('express');
const morgan = require('morgan');
//const postBank = require("./postBank");
const postList = require('./views/postList');
const postDetails = require('./views/postDetails');
const client = require('./Db/index');

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

const baseQuery = 'SELECT posts.*, users.name FROM posts INNER JOIN users ON users.id = posts.id\n';

app.get('/', async (req, res, next) => {
	//const posts = postBank.list();
	//res.send(postList(posts));
	try {
		const data = await client.query(baseQuery);
		//console.log('wizard', data);
		const posts = data.rows;
		res.send(postList(posts));
	} catch (error) {
		next(error);
	}
});

app.get('/posts/:id', async (req, res, next) => {
	try {
		const wizardId = Number(req.params.id);
		const data = await client.query(`${baseQuery} WHERE posts.id = ${wizardId}`);
		//console.log('wizard', data.rows);
		const post = data.rows[0];
		res.send(postDetails(post));
	} catch (error) {
		next(error);
	}
	// const post = postBank.find(req.params.id);
	// res.send(postDetails(post));
});

const PORT = 1337;

app.listen(PORT, () => {
	console.log(`App listening in port ${PORT}`);
});
