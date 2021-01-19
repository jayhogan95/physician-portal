require('dotenv').config();

const Agenda = require('agenda');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function dropCollection() {
	mongoose.connection.db.dropCollection("orders", (err) => {
		if (err) {
			console.log(err)
		} else {
			console.log("Dropped Collection");
		}
	});
}

function removeDups() {
	mongoose.connection.db.orders.aggregate([
		{
			"$group": {
				_id: {SalesOrderId: "$SalesOrderId"},
				dups: { $addToSet: "$_id"},
				count: {$sum: 1}
			}
		},
		{
			"$match": {
				count: {"$gt": 1}
			}
		}
	]).forEach(function(doc) {
		doc.dups.shift();
		db.orders.remove({
			_id: {$in: doc.dups}
		});
	})
}

// const connectionOpts = {db: {address: process.env.DATABASEURL, collection: 'agendaJobs'}};
// let agenda;
mongoose.connect(process.env.HEROKU_DBURL, {
	useNewUrlParser: true,
  	useUnifiedTopology: true,
	useCreateIndex: true
})
.then(() => {
	const agenda = new Agenda({ mongo: mongoose.connection });
	const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];
	jobTypes.forEach(type => {
	  require('./jobs/' + type)(agenda);
	});
	if (jobTypes.length) {
	  agenda.start().then(() => {
		  console.log('Agenda Started');
		  dropCollection();
		  // agenda.schedule("now", "importcsv");
		  agenda.every("30 11 * * *", "importcsv");
	  })
	}
}).then(() => {
	const accountSid = 'AC3099204fcc9c2e7c06f51825c6b1b6c7';
	const authToken = '0b9a64457ca98c5c73542c3d46f4be07';
	const client = require('twilio')(accountSid, authToken);

	client.messages
		.create({
			body: 'Data import is running...',
			from: '+17656814694',
			to: '+12035287208'
		})
		.then(message => console.log(message.sid));
})
.catch(error => console.log(error.message));


module.exports = Agenda;