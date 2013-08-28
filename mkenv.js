
module.exports = function () {
	var chain = [].slice.call(arguments, 0);

	function eval(name) {
		var value = null;
		for ( var i = chain.length - 1; value === null && i >= 0; i-- ) {
			if ( chain[i].hasOwnProperty(name) ) {
				value = chain[i][name];
			}
		}

		if ( value === null ) return null;

		// Simple replacements
		value = value.replace(/\$([a-zA-Z0-9_]+)/g, function (m, pkey) {
			return eval(pkey);
		})

		// Bracketed replacements
		var numReplacements;
		do {
			numReplacements = 0;

			value = value.replace(/\$\{([a-zA-Z0-9_\-\\\/]+)\}/g, function (m, pkey) {
				numReplacements++;
				return eval(pkey);
			})
		} while (numReplacements > 0);


		return value;
	}

	return eval;
}
