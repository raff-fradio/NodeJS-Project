const db = require('./daoMain');

exports.getOne = function(username, next) {
    db.query(
        'SELECT * FROM courses WHERE id = ?;',
        [],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.getAll = function(next) {
    db.query(
        'SELECT * FROM courses;',
        [],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.getStudents = function(course_id, next) {
    db.query(
        'SELECT * FROM students, enroll WHERE enroll.course_id = ? AND enroll.student_id = students.id;',
        [course_id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.create = function(name, description, teacher_id, next) {
    db.query(
        'INSERT INTO courses (name, description, teacher_id) VALUES (?, ?, ?);',
        [name, description, teacher_id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.update = function(id, name, description, next) {
    db.query(
        'UPDATE courses SET name = ?, description = ? WHERE id = ?;',
        [name, description, id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.delete = function(id, next) {
    db.query(
        'DELETE FROM courses WHERE id = ?;',
        [id],
        (err, results) => {
            next(err, results);
        }
    );
}