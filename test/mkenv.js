
require('blanket')({
  // Only files that match the pattern will be instrumented
  pattern: 'node-mkenv/mkenv.js'
});

var should = require("should"),
	mkenv = require("../mkenv");

var docha = require("docha");

describe('mkenv', function () {
	
	docha.doc("Install:\n```npm install --save mkenv```");
	docha.doc("Use:\n```var mkenv = require('mkenv');```");

	describe('constructor: mkenv(envs...)', function () {
		it('accepts hashes', function () {
			mkenv({ x: 'y' })('x').should.equal('y')
		})

		it('accepts functions', function () {
			mkenv(function (name) {
				return name == 'x' ? 'y' : null;
			})('x').should.equal('y')
		})

		describe('composition', function () {
			it('allows values to be retrieved from the root', function () {
				mkenv(
					{ z: 'y' },
					mkenv({ 'x': '$z' })
				)('x').should.equal('y')
			})

			docha.exclude.it('allows bracketed values to be retrieved from the root', function () {
				mkenv(
					{ z: 'y' },
					mkenv({ 'x': '${z}' })
				)('x').should.equal('y')
			})
		})
	})

	describe('value retrieval', function () {
		it('works by calling the env with a key', function () {
			mkenv({ x: 'y' })('x').should.equal('y')
		})

		it('gives the rightmost value (overriding)', function () {
			mkenv({ x: 'y' }, { x: 'z'})('x').should.equal('z')
		})

		it('returns null on an unknown key', function () {
			should.equal(
				mkenv({ x: 'y' })('z'), null
			)
		})
	});

	describe('simple replacements', function () {
		it('can be made', function () {
			mkenv({
				x: 'y',
				y: '$x'
			})('y').should.equal('y')
		})

		it('can be combined', function () {
			mkenv({
				x: 'y',
				y: '$x$x$x'
			})('y').should.equal('yyy')
		})

		it('can be chained', function () {
			mkenv({
				x: 'y',
				y: '$x',
				z: '$y',
				w: '$z'
			})('w').should.equal('y')
		})

		docha.exclude.it('returns falsy value on unknown key', function () {
			should.ok( !mkenv({
				w: '$z'
			})('w') );
		})
	});

	describe('bracketed replacements', function () {
		it('can be made', function () {
			mkenv({
				x: 'y',
				y: '${x}'
			})('y').should.equal('y')
		})

		it('can be nested', function () {
			mkenv({
				x: 'y',
				n: 'x',
				y: '${$n}'
			})('y').should.equal('y')
		})

		it('can be nested, combined, and chained', function () {
			mkenv({
				x: 'y',
				n: 'x',
				xx: '$x$x',
				y: '${$n$n}'
			})('y').should.equal('yy')
		})
	})

	describe('mkenv.keys(env)', function () {
		it('returns the keys stored in an env', function () {
			mkenv.keys(
				mkenv({ x: 'y' }, { y: 'z'})
			).should.eql(['x', 'y'])
		})

		it('returns the keys stored in a nested env', function () {
			mkenv.keys(
				mkenv({ x: 'y' }, mkenv({ y: 'z'}))
			).should.eql(['x', 'y'])
		})

		it('returns additional keys', function () {
			var env = mkenv({ x: 'y' });
			env.y = 'z'
			mkenv.keys(env).should.eql(['x', 'y'])
		})
	})

	describe('mkenv.vars(env)', function () {
		it('returns the vars stored in an env', function () {
			mkenv.vars(
				mkenv({ x: 'y' }, { y: 'z'})
			).should.eql({ x: 'y', y: 'z'})
		})

		it('returns the vars stored in a nested env', function () {
			mkenv.vars(
				mkenv({ x: 'y' }, mkenv({ y: 'z'}))
			).should.eql({ x: 'y', y: 'z'})
		})

		it('returns additional keys', function () {
			var env = mkenv({ x: 'y' });
			env.y = 'z'
			mkenv.vars(env).should.eql({ x: 'y', y: 'z'})
		})
	})

	describe('mkenv.hidden(env)', function () {
		it('allows values to be retrieved from the root', function () {
			mkenv(
				mkenv.hidden({ z: 'y' }),
				mkenv({ 'x': '$z' })
			)('x').should.equal('y')
		})

		it('doesn\'t allow direct retrieval from the root', function () {
			should.equal(
				mkenv(
					mkenv.hidden({ z: 'y' }),
					mkenv({ 'x': '${z}' })
				)('z'),
				null
			)
		})
	})

	docha.doc("\n\n\nDocumentation generated by [Docha](https://github.com/tehsenaus/docha)");
});

