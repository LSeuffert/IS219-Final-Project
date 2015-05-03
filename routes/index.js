var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var busboy = require('connect-busboy');
var University = mongoose.model('university');
var helper = require(__dirname + '/helper');

router.use(busboy());

/**
 * 1) SHOULD VERIFY WHAT WAS UPLOADED -- maybe use events to signify
 * 2) SHOULD MAKE MORE MODULAR -- separate part of this file into another file
 * 3) LISTS AREN'T DRY -- make function with callback for lists
 **/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET upload starting page */
router.get('/upload', function(req, res) {
    res.render('upload_landing', { title: 'Upload | Start' })
})

/****************************** DISPLAY ROUTES *****************************/


/* GET year listing for top enrollement */
router.get('/most_enrolled', function(req, res) {
    res.render('year', {
	title: "Gender Distribution | Year",
	route: 'most_enrolled'
    })
})

/* GET list for top enrollment of selected year */
router.get('/most_enrolled/:year', function(req, res) {
    var year = 'y' + req.params.year;
    var query = {};
    var year_sort = {};

    // set query and options
    query[year + '.enroll'] = true;
    year_sort[year + '.total'] = -1;

    // find top ten most enrolled colleges
    University.find(query).sort(year_sort).limit(10).find(
	function(err, records)
		 {
		     var names = [];
		     var enrolls = [];
		     var max = 0;
		     
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
			     title: 'placeholder title',
			     totals: enrolls,
			     names: names,
			     max: max
			 }
		     )
		 })
    }
)

/* GET college gender distribution graph */
router.get('/gender_distribution/:year/:id', function(req, res) {
    University.findById(
	req.params.id,
	{},
	function(err, record) {
	    // find relevant year document
	    var year_record = record['y' + req.params.year];

	    // get percents
	    var percent = {};
	    percent.male = Math.round((year_record.male/year_record.total)*1000)/10 + '%';
	    percent.female = Math.round((year_record.female/year_record.total)*1000)/10 + '%';
	    console.log(year_record)

	    // render page
	    res.render('pieGraph', {
		title: 'Gender Distribution | Pie Graph',
		rec: year_record,
		percent: percent
	    })
	}
    )
})

/* GET year for gender distribution */
router.get('/gender_distribution', function(req, res) {
    res.render('year', {
	title: "Gender Distribution | Year",
	route: 'gender_distribution'
    })
})

/* GET for gender of selected year */
router.get('/gender_distribution/:year', function(req, res) {
    var year = req.params.year;
    var query = {};

    query['y' + year + '.enroll'] = true;

    University.find(
	query,
	{},
	function (err, list) {
	    console.log(query)
	    res.render('list', {
		title: "Gender Distribution | List",
		rec: list,
		route: 'gender_distribution/' + year
	    })
	}
    )
})


/* GET for tuition list */
router.get('/tuition', function(req, res) {
    University.find(
	{
	    'y2013.enroll': true, 
	    'y2012.enroll': true, 
	    'y2011.enroll': true
	},
	{
	    name: 1
	},
	function(err, list) {
	    res.render('list', {
		title: 'Tuition | List',
		rec: list,
		route: 'tuition'
	    })
	}
    )
})

/* GET displays college tuition graph */
router.get('/tuition/:id', function(req, res) {
    University.findById(
	req.params.id,
	{},
	function(err, record) {
	    console.log(record)
	    res.render('lineGraph', {
		title: 'Tuition | ' + record.name,
		rec: record
	    })
	}
    )
})

/* 
 ********************** ROUTES for 2013 *******************************
 */

/* GET upload page for 2013 characteristics */
router.get('/upload/2013/characteristics', function(req, res) {
    res.render('upload', {
	title: 'Upload | University Characteristics 2013',
	route: '2013/chars'
    })
})

/* POST uploads 2013 characteristics */
router.post('/fileupload/2013/chars', function(req, res) {
    helper.getRecords(req, res, University, '2013/enrollment', function(record, Schema) {
	var id = record.UNITID;
	console.log(id)
        University({_id: id, name: record.INSTNM}).save(function(err) {
            if (err) return console.error(err);
        })
    })
})

/* GET upload page for 2013 enrollment data */
router.get('/upload/2013/enrollment', function(req, res) {
    res.render('upload', {
	title: 'Upload | Enrollment 2013',
	route: '2013/enroll'
    })
})

/* POST save enrollment data to database */
router.post('/fileupload/2013/enroll', function(req, res) {
    helper.getRecords(req, res, University, '2013/finance', function(record, Schema) {
	var id = record.UNITID;
	console.log(id)

	// increment the data and set to enroll to true
	Schema.findByIdAndUpdate(id, {$inc: {
	    'y2013.total': record.EFTOTLT,
	    'y2013.male': record.EFTOTLM,
	    'y2013.female': record.EFTOTLW
	},
	$set: { 'y2013.enroll': true}},
	function(err) {
	     if (err) return console.error(err);
	 }
	);
    })
})

/* GET for 2013 finance page */
router.get('/upload/2013/finance', function(req, res) {
    res.render('upload', {
	title: 'Upload | 2013 Finance',
	route: '2013/fin'
    })
})

/* POST saves finance data to database */
router.post('/fileupload/2013/fin', function(req, res) {
    helper.getRecords(req, res, University, '2012/enrollment', function(record, Schema) {
	var id = record.UNITID;
	var tuition = record.F1B01;
	console.log(id + ' | ' + tuition)

	// set the finance data
	Schema.findByIdAndUpdate(
	    id, 
	    {$set: {'y2013.tuition': tuition,'y2013.finance': true}},
	    function(err) {
		if (err) return console.error(err);
	    }
	)
    })
})

/******************************* 2012 ************************************/

/* GET upload page for 2012 enrollment data */
router.get('/upload/2012/enrollment', function(req, res) {
    res.render('upload', {
	title: 'Upload | Enrollment 2012',
	route: '2012/enroll'
    })
})

/* POST save enrollment data to database */
router.post('/fileupload/2012/enroll', function(req, res) {
    helper.getRecords(req, res, University, '2012/finance', function(record, Schema) {
	var id = record.UNITID;
	console.log(id)

	// increment the data and set enroll to true
	Schema.findByIdAndUpdate(id, {$inc: {
	    'y2012.total': record.EFTOTLT,
	    'y2012.male': record.EFTOTLM,
	    'y2012.female': record.EFTOTLW
	},
	$set: { 'y2012.enroll': true}},
	function(err) {
	     if (err) return console.error(err);
	 }
	);
    })
})

/* GET for 2012 finance page */
router.get('/upload/2012/finance', function(req, res) {
    res.render('upload', {
	title: 'Upload | 2012 Finance',
	route: '2012/fin'
    })
})

/* POST saves finance data to database */
router.post('/fileupload/2012/fin', function(req, res) {
    helper.getRecords(req, res, University, '2011/enrollment', function(record, Schema) {
	var id = record.UNITID;
	var tuition = record.F1B01;
	console.log(id + ' | ' + tuition)

	// set the finance data
	Schema.findByIdAndUpdate(
	    id, 
	    {
		$set: {'y2012.tuition': tuition,'y2012.finance': true}
	    },
	    function(err) {
		if (err) return console.error(err);
	    }
	)
    })
})


/******************************** 2011 ************************************/

// I have done away with characteristics unless needed

/* GET upload page for 2011 enrollment data */
router.get('/upload/2011/enrollment', function(req, res) {
    res.render('upload', {
	title: 'Upload | Enrollment 2011',
	route: '2011/enroll'
    })
})

/* POST save enrollment data to database */
router.post('/fileupload/2011/enroll', function(req, res) {
    helper.getRecords(req, res, University, '2011/finance', function(record, Schema) {
	var id = record.UNITID;
	console.log(id)

	// increment the data and set enroll to true
	Schema.findByIdAndUpdate(id, {$inc: {
	    'y2011.total': record.EFTOTLT,
	    'y2011.male': record.EFTOTLM,
	    'y2011.female': record.EFTOTLW
	},
	$set: { 'y2011.enroll': true}},
	function(err) {
	     if (err) return console.error(err);
	 }
	);
    })
})

/* GET for 2011 finance page */
router.get('/upload/2011/finance', function(req, res) {
    res.render('upload', {
	title: 'Upload | 2011 Finance',
	route: '2011/fin'
    })
})

/* POST saves finance data to database */
router.post('/fileupload/2011/fin', function(req, res) {

    // get records from csv file
    helper.getRecords(req, res, University, 'complete', function(record, Schema) {
	var id = record.UNITID;
	var tuition = record.F1B01;
	console.log(id + ' | ' + tuition)

	// set the finance data
	Schema.findByIdAndUpdate(
	    id, 
	    {$set: {'y2011.tuition': tuition,'y2011.finance': true}},
	    function(err) {
		if (err) return console.error(err);
	    }
	)
    })
})

/* GET final page for upload */
router.get('/upload/complete', function(req, res) {
    res.render('complete', {title: 'Upload | Complete'}) // YOU WERE JUST ABOUT TO MAKE A COMPLETED UPLOAD PAGE
})

module.exports = router;
