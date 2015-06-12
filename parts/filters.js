var
	filters = {};

filters.longerThanOrEqual = function longerThanOrEqual(len) { // (Number) -> Predicate
	return function (input) { // (Array|String|Function) -> Boolean
		return input.length >= len;
	};
};

filters.shorterThan = function shorterThan(len) { // (Number) -> Predicate
	return function (input) { // (Array|String|Function) -> Boolean
		return input.length < len;
	};
};

filters.is = function is(x) { // (_) -> Predicate
	return function (val) { // (_) -> Boolean
		return val === x;
	};
};

filters.not = function not(predicate) { // (Function) -> Predicate
	return function(val) { // (_) -> Boolean
		return !predicate(val);
	};
};

module.exports = filters;
