var
	Bacon = require("baconjs"),
	async = require("./async"),
	filters = require("./filters"),
	streamUtils = {};

	streamUtils.fsm2stream = function fsm2stream(fsm) {
		return Bacon.fromBinder(function(sink) {
			var
				callback = function(event, fromState, toState) {
					async.enqueue(null, sink, "<-" + fromState);
					async.enqueue(null, sink, "::" + event);
					async.enqueue(null, sink, "->" + toState);
				};

			fsm.bind(callback);
			return function() {
				fsm.unbind(callback);
			};
		});
	};

	streamUtils.on = function on(eventStream, transition, cmd) {
		eventStream.filter(filters.is(transition)).onValue(cmd);
	};

module.exports = streamUtils;
