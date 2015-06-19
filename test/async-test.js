/* global describe, it */
var
	should = require("chai").should(),
	asyncUtils = require("../parts/async");

describe("async.schedule()", function() {
	it("runs a function after a given time period", function(done) {
		var
			result;

		asyncUtils.schedule(10, null, function() {
			result = true;
		});
		should.not.exist(result);
		asyncUtils.schedule(11, null, function() {
			should.equal(result, true);
			done();
		});
	});

	it("sets the provided context for the function", function(done) {
		var
			testObject = {
				checkValue: function() {
					should.equal(this.val, 1);
					done();
				},
				val: 1
			};

		asyncUtils.schedule(1, testObject, testObject.checkValue);
	});

	it("sets the provided context for the function and calls it with the provided parameter", function(done) {
		var
			testObject = {
				checkValue: function(v) {
					should.equal(this.val, v);
					done();
				},
				val: 1
			};

		asyncUtils.schedule(1, testObject, testObject.checkValue, 1);
	});
});

describe("async.enqueue()", function() {
	it("queues up a function to be called", function(done) {

		asyncUtils.enqueue(null, function() {
			done();
		});
	});

	it("sets the provided context for the function", function(done) {
		var
			testObject = {
				checkValue: function() {
					should.equal(this.val, 1);
					done();
				},
				val: 1
			};

		asyncUtils.enqueue(testObject, testObject.checkValue);
	});

	it("sets the provided context for the function and calls it with the provided parameter", function(done) {
		var
			testObject = {
				checkValue: function(v) {
					should.equal(this.val, v);
					done();
				},
				val: 1
			};

		asyncUtils.enqueue(testObject, testObject.checkValue, 1);
	});
});

describe("async.asynchronize() returns an object that", function() {
	it("contains all the functions from the input object", function() {
		var
			obj = {a: 1, b: setTimeout, c: function() {}},
			async = asyncUtils.asynchronize(obj);

		should.not.exist(async.a);
		async.b.should.be.a("function");
		async.c.should.be.a("function");
	});

	it("contains functions that return the original functions", function() {
		var
			obj = {fa: function() {return "a"}, fb: function() {return "b"}},
			async = asyncUtils.asynchronize(obj),
			asyncFuncA = async.fa(),
			asyncFuncB = async.fb();

		should.equal(asyncFuncA(), "a");
		should.equal(asyncFuncB(), "b");
	});

	it("contains functions that return bound functions", function() {
		var
			obj = {a: 1, f: function() {return this.a}},
			async = asyncUtils.asynchronize(obj),
			asyncFunc = async.f();

		should.equal(asyncFunc(), 1);
	});

	it("contains functions that return functions with fixed parameters", function() {
		var
			obj = {f: function(x) {return x}},
			async = asyncUtils.asynchronize(obj),
			asyncFunc = async.f(1);

		should.equal(asyncFunc(), 1);
	});
});
