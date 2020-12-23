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
		  agenda.every("35 4 * * *", "importcsv");
	  })
	}
})
.catch(error => console.log(error.message));


module.exports = Agenda;