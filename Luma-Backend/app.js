const Express = require('express');
const app = Express();

const students = require('./r_students'),
    teachers = require('./r_teachers'),
    courses = require('./r_courses');

const port = process.env.PORT || 3000;

app.use(Express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})

app.use('/students', students);
app.use('/teachers', teachers);
app.use('/courses', courses);

app.listen(port, () => {
    console.log(`-- Now listening on port ${port} --`);
});