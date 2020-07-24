const Express = require('express'),
    courses = require('./db/daoCourses');
const router = Express.Router();

router.get('/', (req, res) => {
    var datetime = new Date();
    console.log(`\n-- ${datetime} --`);
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
    console.log(`\n-- ${datetime} --`);
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
            result.students = results2;
            result.status = "Success";
            res.json(result);
            console.log('Sent Course data.');
        })
    });
});

router.post('/', (req, res) => {
    var datetime = new Date();
    console.log(`\n-- ${datetime} --`);
    console.log(`Received request to create new Course.`);
    courses.create(req.body.name, req.body.description, req.body.teacher_id, (err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        req.body.givenId = results.insertId;
        req.body.status = "Success";
        res.json(req.body);
        console.log('Successfully created Course data.');
    });
});

router.put('/:id', (req, res) => {
    var datetime = new Date();
    console.log(`\n-- ${datetime} --`);
    console.log(`Received request to update Course - ID: ${req.params.id}`);
    console.log('Searching existing Course data.');
    courses.getOne(req.params.id, (err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results.length < 1) {
            console.log('Cancelled - Data not found.');
            return res.status(404).json('Data not found.');
        }
        console.log('Course found. Processing update request.');
        courses.update(req.params.id, req.body.name, req.body.description, (err, results) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            req.body.status = "Success";
            res.json(req.body);
            console.log('Successfully updated Course data.');
        });
    });
});

router.delete('/:id', (req, res) => {
    var datetime = new Date();
    console.log(`\n-- ${datetime} --`);
    console.log(`Received request to delete Course data - ID: ${req.params.id}`);
    console.log(`Checking existing Course data.`);
    courses.getOne(req.params.id, (err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results.length < 1) {
            console.log('Cancelled - Data not found.');
            return res.status(404).json('Data not found.');
        }
        req.body = results[0];
        console.log(`Course data found. Processing delete request.`);
        courses.delete(req.params.id, (err, results) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            req.body.status = "Success";
            res.json(req.body);
            console.log('Successfully deleted Course data.');
        });
    });
});
module.exports = router;