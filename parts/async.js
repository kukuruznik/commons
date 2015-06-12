var
	async = {};

function schedule(timeout, context, f/*, ... */) {
	var params = Array.prototype.slice.call(arguments, 3);

	setTimeout(f.apply.bind(f, context, params), timeout);	
}

function enqueue(context, f/*, ... */) {
	var params = [0, context, f].concat(Array.prototype.slice.call(arguments, 2));

	schedule.apply(null, params);
}

function asynchronize(obj) {
	var
		asyncFunctions = {},
		functions = [];

	// let's put the attributes to the array so that we can use forEach
	for (var attr in obj) {
		if (typeof obj[attr] === "function") {
			functions.push(attr);
		}
	}

	functions.forEach(function(funcName) {
		asyncFunctions[funcName] = function(/*...*/) {
			var
				args = [obj].concat(Array.prototype.slice.call(arguments, 0));

			return Function.prototype.bind.apply(obj[funcName], args);
		};
	});

	return asyncFunctions;
}

async.schedule = schedule;
async.enqueue = enqueue;
async.asynchronize = asynchronize;

module.exports = async;
