/* global describe, it, beforeEach */
var
	should = require("chai").should(),
	commons = require("commons"),
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
	},
	openRatherThanLock = function(yes) {
		return yes ? "open" : "lock";
	},

	fsm = commons.fsm;

describe("fsm.fromStatelyMachine() wraps a Stately.js FSM and", function() {
	var
		door,
		wrappedDoor;

	beforeEach(function() {
		door = Stately.machine(doorStates),
		wrappedDoor = fsm.fromStatelyMachine(door);
	});

	describe("getRawFunction() returns the original FSM function, that", function() {
		it("moves the machine to the next valid state", function() {
			var
				transition = wrappedDoor.getRawFunction("open");

			transition();
			door.getMachineState().should.equal("OPENED");
		});
	
		it("has no effect when isn't available from the current state", function() {
			var
				transition = wrappedDoor.getRawFunction("unlock");

			door.open();
			door.getMachineState().should.equal("OPENED");
			transition();
			door.getMachineState().should.equal("OPENED");
		});

		it("fails fast for non-existing functions", function() {
			wrappedDoor.getRawFunction.bind(null, "noSuchEvent").should.throw(Error);
		});
	});

	describe("getWrappedFunction() returns a wrapped FSM function, that", function() {
		it("moves the machine to the next valid state and returns true", function() {
			var
				transition = wrappedDoor.getWrappedFunction("open"),
				retVal = transition();

			door.getMachineState().should.equal("OPENED");
			should.equal(retVal, true);
		});
	
		it("has no effect when isn't available from the current state and returns false", function() {
			var
				transition = wrappedDoor.getWrappedFunction("unlock");

			door.open();
			door.getMachineState().should.equal("OPENED");
			var retVal = transition();
			should.equal(retVal, false);
		});

		it("fails fast for non-existing functions", function() {
			wrappedDoor.getWrappedFunction.bind(null, "noSuchEvent").should.throw(Error);
		});
	});

	describe("getDispatcherFunction() returns a wrapped FSM function, that", function() {
		it("moves the machine to the next valid state and returns true", function() {
			var
				transition = wrappedDoor.getDispatcherFunction(openRatherThanLock),
				retVal = transition(true);

			door.getMachineState().should.equal("OPENED");
			should.equal(retVal, true);

			door.close();

			door.getMachineState().should.equal("CLOSED");

			retVal = transition(false);

			door.getMachineState().should.equal("LOCKED");
			should.equal(retVal, true);
		});

		it("has no effect when isn't available from the current state and returns false", function() {
			var
				transition = wrappedDoor.getDispatcherFunction(openRatherThanLock);

			door.open();
			door.getMachineState().should.equal("OPENED");
			var retVal = transition(false);
			should.equal(retVal, false);
		});

		it("fails for non-existing functions", function() {
			var
				incorrectDispatcher = function() {return "noSuchEvent";},
				dispatcher = wrappedDoor.getDispatcherFunction(incorrectDispatcher);

				dispatcher.should.throw(Error);
		});
	});

	describe("getBooleanDispatcherFunction() returns a wrapped FSM function, that", function() {
		it("moves the machine to the next valid state and returns true", function() {
			var
				transition = wrappedDoor.getBooleanDispatcherFunction("open", "lock"),
				retVal = transition(true);

			door.getMachineState().should.equal("OPENED");
			should.equal(retVal, true);

			door.close();

			door.getMachineState().should.equal("CLOSED");

			retVal = transition(false);

			door.getMachineState().should.equal("LOCKED");
			should.equal(retVal, true);
		});

		it("has no effect when isn't available from the current state and returns false", function() {
			var
				transition = wrappedDoor.getBooleanDispatcherFunction("open", "lock");

			door.open();
			door.getMachineState().should.equal("OPENED");
			var retVal = transition(false);
			should.equal(retVal, false);
		});

		it("fails for non-existing functions", function() {
			var
				dispatcher = wrappedDoor.getBooleanDispatcherFunction("notA", "-ValidEvent");

				dispatcher.should.throw(Error);
		});
	});
});
