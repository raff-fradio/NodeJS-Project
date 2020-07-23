const Express = require('express'),
    Joi = require('joi'),
    students = require('./db/daoStudents');
const router = Express.Router();

router.get('/', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log('Received request for Students data.');
    students.getAll((err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        res.json(results);
        console.log('Sent Students Data.');
    });
});

router.get('/:id', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log(`Received request for Student data - ID: ${req.params.id}`);
    students.getOne(req.params.id, (err, results1) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results1.length < 1) {
            console.log('Cancelled - Data not found.');
            return res.status(404).json('Data not found.');
        }
        var result = results1[0];
        console.log('Student data found. Fetching Courses.');
        students.getCourses(req.params.id, (err, results2) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            result.courses = results2;
            result.status = "Success";
            res.json(result);
            console.log('Sent Student data.');
        })
    });
});

router.post('/', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log(`Received request for creating new Student data.`);
    console.log(`Proceeding with validation check.`);
    const {error} = validateUser(req.body);
    if (error) {
        var errorMsg = error.details[0].message.replace(/"/g, '');
        console.log('Cancelled - Validation check failed.');
        return res.status(400).json(errorMsg);
    }
    console.log(`Validation check passed. Checking existing Student data.`);
    students.getEmail(req.body.email, (err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results.length > 0) {
            console.log('Cancelled - Email already exists.');
            return res.status(400).json('Email already exists.');
        }
        console.log(`Email does not exist. Creating Student data.`);
        students.create(req.body.email, req.body.name, req.body.password, (err, results) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            req.body.givenId = results.insertId;
            req.body.status = "Success";
            res.json(req.body);
            console.log('Successfully created Student data.');
        });
    })
});

router.post('/login', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log(`Received login request for Student.`);
    const {error} = validateUser(req.body);
    if (error) {
        var errorMsg = error.details[0].message.replace(/"/g, '');
        console.log('Cancelled - Validation check failed.');
        return res.status(400).json(errorMsg);
    }
    console.log(`Validation check passed. Checking existing Student data.`);
    students.getEmail(req.body.email, (err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results.length < 0) {
            console.log('Cancelled - Data not found.');
            return res.status(404).json('Data not found.');
        }
        console.log('Email found. Processing login request.');
        students.login(req.body.email, req.body.password, (err, results) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            if (results.length < 1) {
                console.log('Cancelled - Data does not match.');
                return res.status(404).json('Data does not match.');
    
            }
            var result = results[0];
            result.status = "Success";
            res.json(result);
            console.log('Successfully completed login request.');
        });
    });
});

router.put('/:id', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log(`Received request to update Student data - ID: ${req.params.id}`);
    console.log(`Proceeding with validation check.`);
    const {error} = validateUser(req.body);
    if (error) {
        var errorMsg = error.details[0].message.replace(/"/g, '');
        console.log('Cancelled - Validation check failed.');
        return res.status(400).json(errorMsg);
    }
    console.log(`Validation check passed. Checking existing Student data.`);
    students.getOne(req.params.id, (err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results.length < 1) {
            console.log('Cancelled - Data not found.');
            return res.status(404).json('Data not found.');
        }
        console.log(`Student data found. Processing update request.`);
        students.update(req.params.id, req.body.name, req.body.password, (err, results) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            req.body.status = "Success";
            res.json(req.body);
            console.log('Successfully updated Student data.');
        });
    });
});

router.delete('/:id', (req, res) => {
    var datetime = new Date();
    console.log(`\n${datetime}`);
    console.log(`Received request to delete Student data - ID: ${req.params.id}`);
    console.log(`Checking existing Student data.`);
    students.getOne(req.params.id, (err, results) => {
        if (err) {
            console.log(`Cancelled - ${err}`);
            return res.status(400).json(err);
        }
        if (results.length < 1) {
            console.log('Cancelled - Data not found.');
            return res.status(404).json('Data not found.');
        }
        req.body = results[0];
        console.log(`Student data found. Processing delete request.`);
        students.delete(req.params.id, (err, results) => {
            if (err) {
                console.log(`Cancelled - ${err}`);
                return res.status(400).json(err);
            }
            req.body.status = "Success";
            res.json(req.body);
            console.log('Successfully updated Student data.');
        });
    });
});

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'id'] } }),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).required()
    });

    return schema.validate(user);
}

module.exports = router;