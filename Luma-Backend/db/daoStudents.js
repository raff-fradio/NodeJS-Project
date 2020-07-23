const db = require('./daoMain');

exports.getOne = function(id, next) {
    db.query(
        'SELECT * FROM students WHERE id = ?;',
        [id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.getAll = function(next) {
    db.query(
        'SELECT * FROM students',
        [],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.getCourses = function(student_id, next) {
    db.query(
        'SELECT * FROM courses, enroll WHERE student_id = ? AND courses.id = enroll.course_id;',
        [student_id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.create = function(email, name, password, next) {
    db.query(
        'INSERT INTO students (email, name, password) VALUES (?, ?, ?);',
        [email, name, password],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.update = function(id, email, name, password, next) {
    db.query(
        'UPDATE students SET email = ?, name = ?, password = ? WHERE id = ?;',
        [email, name, password, id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.delete = function(id, next) {
    db.query(
        'DELETE FROM students WHERE id = ?;',
        [id],
        (err, results) => {
            next(err, results);
        }
    );
}