/* global describe, it */
var
	should = require("chai").should(),
	commons = require("commons"),
	funcUtils = commons.func;

describe("func.ifThenElse() returns a function that", function() {
	it("runs whenTrue if the predicate returns true", function() {
		var
			ok;

		function predicate() {
			return true;
		}

		function whenTrue() {
			ok = true;
		}

		function whenFalse() {
			ok = false;
		}

		funcUtils.ifThenElse(predicate, whenTrue, whenFalse)();
		should.equal(ok, true);
	});

	it("runs whenFalse if the predicate returns false", function() {
		var
			ok;

		function predicate() {
			return false;
		}

		function whenTrue() {
			ok = true;
		}

		function whenFalse() {
			ok = false;
		}

		funcUtils.ifThenElse(predicate, whenTrue, whenFalse)();
		should.equal(ok, false);
	});
});
