
require('blanket')({
  // Only files that match the pattern will be instrumented
  pattern: 'node-mkenv/mkenv.js'
});

var should = require("should"),
	mkenv = require("../mkenv");


describe('mkenv', function () {
	describe('string values', function () {
		it('can be retrieved', function () {
			mkenv({ x: 'y' })('x').should.equal('y')
		})

		it('can be overridden', function () {
			mkenv({ x: 'y' }, { x: 'z'})('x').should.equal('z')
		})
	});

	describe('simple replacements', function () {
		it('are made', function () {
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
	});

	describe('bracketed replacements', function () {
		it('are made', function () {
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
});

