require('dotenv').config();

const Agenda = require('agenda');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// const connectionOpts = {db: {address: process.env.DATABASEURL, collection: 'agendaJobs'}};
// let agenda;
mongoose.connect(process.env.DATABASEURL, {
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
		  agenda.schedule("now", "importcsv");
		  // agenda.every("13 23 * * *", "importcsv");
		  // agenda.every('30 minutes', 'importcsv').then(() => {
		  // console.log('importcsv running every 30 minutes');
		  // })
	  })
	}
})
.catch(error => console.log(error.message));


module.exports = Agenda;