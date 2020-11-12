const soap = require("soap");
const url = "https://webservices.brightree.net/v0100-1501/OrderEntryService/SalesOrderService.svc?singleWsdl";
const args = {name: "value"};
soap.createClient(url, function(err, client) {
	client.MyFunction(args, function(err, result) {
    	console.log(result);
	});
});