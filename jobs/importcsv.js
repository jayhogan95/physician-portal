require('dotenv').config();
const Order = require('../models/order.js');
let Client = require("ssh2-sftp-client");
let sftp = new Client();
const decompress = require('decompress');
const csvjson = require("csvtojson");
const csv = require("fast-csv");
const mongoose = require('mongoose');
const cluster = require("cluster");
const moment = require("moment");

function disconnectFromMongo() {
	mongoose.disconnect();
	console.log("Disconnected from db!");
}

function promiseCSV(filePath, options) {
	return new Promise((resolve, reject) => {
		console.time("Time to parse file");
		const records = [];
		console.log(records);
		csv
		.parseFile(filePath, options)
		.on("data", record => {
			records.push(record);
		})
		.on("end", () => {
			console.timeEnd("Time to parse file");
			resolve(records)
		});
	});
}

const ordersImport = []

function bulkImportToMongo(arrayToImport) {
	const Model = require("../models/order.js");
	const batchSize = 100;
	let batchCount = Math.ceil(arrayToImport.length / batchSize);
	let recordsLeft = arrayToImport.length;
	let ops = [];
	let counter = 0;
	for (let i = 0; i <batchCount; i++) {
		let batch = arrayToImport.slice(counter, counter + batchSize);
		counter += batchSize;
		console.log("about to push to models");
		ops.push(Model.insertMany(batch));
	}
	return Promise.all(ops);
}

const options = {
	delimiter: ",",
	noheader: true,
	headers: [
		"SalesOrderId",
		"Work In Progress_WIP State",
		"CreateDT",
		"Date Qualified_15",
		"ActualDeliveryDt",
		"Classification",
		"Marketing Rep_Full Name",
		"Patientid",
		"LastName",
		"FirstName",
		"DOB",
		"PatientBranch",
		"SalesorderBranch",
		"Insurance_Pri Insurance Name",
		"Insurance_Sec Insurance Name",
		"Street",
		"Suite",
		"City",
		"st",
		"Zip",
		"NickName"
	]
}

const date = new Date(moment());

function getFormattedDate(date) {
	const year = date.getFullYear().toString().substr(-2);
	const month = (1 + date.getMonth()).toString();
	const day = date.getDate().toString();
	return ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2) + "-" + year;
}

module.exports = function(agenda) {
  agenda.define('importcsv', async job => {
	  console.log("running importcsv");
    // SFTP connection
	const root = "/file";
	sftp.connect({
		host: process.env.SFTPHOST,
		port: process.env.SFTPPORT,
		username: process.env.SFTPUSER,
		password: process.env.SFTPPASS
	}).then(() => {
		console.log("connected to SFTP. Running fastGet");
		return sftp.fastGet("/CustomSOUnconfirm_" + getFormattedDate(date) + ".zip", "public/files/testconnection.zip")
	}).then(async data => {
		console.log("FastGet done running");
		console.log(data);
		const files = await decompress("public/files/testconnection.zip", "public/files/unzippedfile");

		const csvFilePath = "public/files/unzippedfile/CustomSOUnconfirm.csv";

		csvjson()
			.fromFile(csvFilePath)
			.then( async jsonObj => {
				// need try/catch here?
				// let res = await Order.insertMany(jsonObj);
				promiseCSV(csvFilePath, options)
				.then(records => {
					console.time("Time to import parsed objects to db");
					return bulkImportToMongo(records);
				})
				.then(result => console.log("total batches inserted: ", result, result.length))
				.then(() => {
					disconnectFromMongo();
					console.timeEnd("Time to import parsed objects to db");
				})
		}).catch(err => {
			console.log(err.message);
			throw new Error(err);	
		})
	}).then(() => {
		sftp.end();
	}).catch(err => {
		console.error(err.message);
	});

  });
};