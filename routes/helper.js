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

module.exports = helper;
