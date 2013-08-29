
module.exports = function () {
	var chain = [].slice.call(arguments, 0);

	function eval(name, root) {
		root = root || eval;
		try {
			var value = null;
			for ( var i = chain.length - 1; value === null && i >= 0; i-- ) {
				var env = chain[i];
				if ( typeof env === "function" && env !== eval ) {
					value = env(name, root);
				} else if ( env && env.hasOwnProperty(name) ) {
					value = env[name];
				}
			}

			if ( value == null ) return null;

			// Simple replacements
			value = value.replace(/\$([a-zA-Z0-9_]+)/g, function (m, pkey) {
				return root(pkey);
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
		} catch (e) {
			throw new Error("mkenv: evaluation of '" + name + "' failed: " + e.toString())
		}
	}

	// Allow overriding variables by assignment
	chain.push(eval);

	Object.defineProperty(eval, '__mkenv_chain', {
		enumerable: false,
		value: chain
	});

	return eval;
}

function getKeys(env) {
	var chain = env.__mkenv_chain;
	if (!chain) return [];

	var keys = {};
	chain.forEach(function (item) {
		if ( typeof item === "function" && item !== env ) {
			getKeys(item).forEach(function (key) {
				keys[key] = true;
			})
		} else if (item) {
			Object.keys(item).forEach(function (key) {
				keys[key] = true;
			})
		}
	})

	return Object.keys(keys);
}
module.exports.keys = getKeys;

module.exports.vars = function vars(env) {
	var vars = {};
	getKeys(env).forEach(function (key) {
		vars[key] = env(key);
	});
	return vars;
}
