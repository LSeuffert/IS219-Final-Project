var assert = require('assert');
var helper = require('../routes/helper');

describe('make sure helper works', function() {
    it('helper.percent(100, 5) returns 5%', function() {
	assert.equal(helper.percent(100, 5), '5%')
    })
    it('helper.percent(3, 2, 3) returns 66.667%', function() {
	assert.equal(helper.percent(3, 2, 3), '66.667%')
    })
})

