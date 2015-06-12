var
	fsm = {},
	FsmWrapper = {};

FsmWrapper.create = function createFsmWrapper(fsm) {

	var
		wrapper = {};

	function checkIsFunction(funcName) {
		var
			what = typeof fsm[funcName];

		if (what !== "function" || !fsm.hasOwnProperty(funcName)) {
			throw new Error("Invalid FSM event: " + funcName);
		}
	}

	function callWithFeedback(funcName) {
		var
			isValid = fsm.getMachineEvents().indexOf(funcName) > -1;

		fsm[funcName]();
		return isValid;
	}

	wrapper.getRawFunction = function(funcName) {
		checkIsFunction(funcName);
		return fsm[funcName];
	};

	wrapper.getWrappedFunction = function(funcName) {
		checkIsFunction(funcName);
		return callWithFeedback.bind(null, funcName);
	};

	wrapper.getDispatcherFunction = function(valueToEventMapper) {
		return function() {
			var
				funcName = valueToEventMapper.apply(null, arguments);

			checkIsFunction(funcName);
			return callWithFeedback(funcName);
		};
	};

	wrapper.getBooleanDispatcherFunction = function(eventWhenTrue, eventWhenFalse) {
		return wrapper.getDispatcherFunction(function(isTrue) {
			return isTrue ? eventWhenTrue : eventWhenFalse;
		});
	};

	return wrapper;
};

fsm.fromStatelyMachine = function(fsm) {
	return FsmWrapper.create(fsm);
};

module.exports = fsm;
