/* global describe, it, beforeEach */
var
	should = require("chai").should(),
	streamUtils = require("../parts/stream"),
	Stately = require("stately.js"),
	doorStates = {
		CLOSED: {
			open: "OPENED",
			lock: "LOCKED"
		},
		OPENED: {
			close: "CLOSED"
		},
		LOCKED: {
			unlock: "CLOSED"
		}
	};

describe("stream.fsm2stream() binds an event-stream to a Stately.js FSM and", function() {
	it("fires 3 events (in the correct order) whenever the FSM changes state", function(done) {
		var
			door = Stately.machine(doorStates),
			events = streamUtils.fsm2stream(door),
			callOrder = [];

		events.onValue(function(transition) {
			if (transition === "<-CLOSED") {
				callOrder.push(1);
			} else if (transition === "::open") {
				callOrder.push(2);
			} else if (transition === "->OPENED") {
				callOrder.push(3);
			} else {
				callOrder.push("x");
			}
		});

		door.open();
		setTimeout(function() {
			callOrder.should.deep.equal([1,2,3]);
			done();
		}, 20);
	});
});

describe("stream.on() registers a handler for a sub-set of events on an FSM event-stream and", function() {
	var
		door,
		evtStream;

	beforeEach(function() {
		door = Stately.machine(doorStates),
		evtStream = streamUtils.fsm2stream(door);
	});

	it("calls the handler for an exact match", function(done) {
		streamUtils.on(evtStream, "->OPENED", function(evt) {
			evt.should.equal("->OPENED");
			done();
		});
		door.open();
	});
});
