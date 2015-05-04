var assert = require('assert');
var helper = require('../routes/helper');

describe('tests helper.getRecords', function() {
    it('helper.getRecords is function', function() {
	assert.equal(typeof helper.getRecords, 'function')
    })
})

describe('test helper.renderTopTen finds max value', function() {
    it('helper.renderTopTen returns 500', function() {
	var res = {
	    render: function(str, json) {}
	};
	var records = [
	    { 
		name: 'one',
		y2013: {total: 300}
	    },
	    {
		name: 'two',
		y2013: {total: 500}
	    }
	]
	assert.equal(helper.renderTopTen(res, records, 'y2013'), 500)
    })
    it('helper.renderTopTen with equals works', function() {
	var res = {
	    render: function(str, json) {}
	};
	var records = [
	    { 
		name: 'one',
		y2013: {total: 60}
	    },
	    {
		name: 'two',
		y2013: {total: 60}
	    }
	]
	assert.equal(helper.renderTopTen(res, records, 'y2013'), 60)
    })

})

describe('make sure helper.percent works', function() {
    it('helper.percent(100, 5) returns 5%', function() {
	assert.equal(helper.percent(100, 5), '5%')
    })
    it('helper.percent(3, 2, 3) returns 66.667%', function() {
	assert.equal(helper.percent(3, 2, 3), '66.667%')
    })
})
