const Express = require('express'),
    courses = require('./db/daoCourses');
const router = Express.Router();

router.get('/', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log('Received request for Courses data.');
    courses.getAll((err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        res.json(results);
        console.log('Sent Courses Data.');
    });
});

router.get('/:id', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log(`Received request for Course data - ID: ${req.params.id}`);
    courses.getOne(req.params.id, (err, results1) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results1.length < 1) {
            console.log('Cancelled - Data not found.');
            return res.status(404).json('Data not found.');
        }
        var result = results1[0];
        console.log('Course data found. Fetching Students.');
        courses.getStudents(req.params.id, (err, results2) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            result.courses = results2;
            result.status = "Success";
            res.json(result);
            console.log('Sent Course data.');
        })
    });
});

module.exports = router;