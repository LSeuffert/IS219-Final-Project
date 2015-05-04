var csv = require('csv');

/**
 * Description: Helper holds functions to facilitate routes
 */
var helper = {};

/**
 * Description: gets records and allows callback to manipulate each record
 **/
helper.getRecords = function(req, res, Schema, redir, callback) {
    // parse csv file
    var parser = csv.parse({columns: true})
    req.pipe(req.busboy)

    // upload file
    req.busboy.on('file', function(fieldname, file, filename) {
        console.log('Uploading: ' + filename)
        
        // callback manipulates each record
        file.pipe(parser).on('readable', function() {
            while (record = parser.read()) {
		callback(record, Schema)
            }
        })
    }).on('finish', function() {
        console.log('file uploaded')
        res.redirect('/upload/' + redir)
    })
}


/**
 * Description: returns a fraction as a string percent
 **/
helper.percent = function(total, fraction, decimal) {
    decimal = typeof decimal !== 'number' ? 2 : 2+decimal;
    decimal = Math.pow(10, decimal);
    return Math.round((fraction/total)*decimal)/(decimal/100) + '%';
}

/**
 * Description: renders the top ten colleges
 */
helper.renderTopTen = function(res, records, year) {
    var names = [];
    var enrolls = [];
    var max = 0;
    
    // add names, enrolls, and then find max
    for (cntr = 0; cntr < records.length; cntr++) {
	names[cntr] = records[cntr]['name'];
	enrolls[cntr] = records[cntr][year]['total'];
	if ( max < enrolls[cntr] ) {
	    max = enrolls[cntr];
	}
    }
    
    res.render(
	'barChart',
	{
	    title: 'Top Ten Colleges by Enrollment',
	    totals: enrolls,
	    names: names,
	    max: max
	}
    )

    return max;
}

module.exports = helper;
