var
	funcUtils = {};

funcUtils.ifThenElse = function ifThenElse(predicate, whenTrue, whenFalse) {
	return function() {
		predicate() ? whenTrue() : whenFalse();
	};
};

module.exports = funcUtils;
