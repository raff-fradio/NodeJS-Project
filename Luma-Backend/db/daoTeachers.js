const db = require('./daoMain');

exports.getOne = function(id, next) {
    db.query(
        'SELECT * FROM teachers WHERE id = ?;',
        [id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.getAll = function(next) {
    db.query(
        'SELECT * FROM teachers;',
        [],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.getCourses = function(teacher_id, next) {
    db.query(
        'SELECT * FROM courses WHERE teacher_id = ?;',
        [teacher_id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.getEmail = function(email, next) {
    db.query(
        'SELECT * FROM teachers WHERE email = ?',
        [email],
        (err, results) => {
            next(err, results);
        }
    )
}

exports.login = function(email, password, next) {
    db.query(
        'SELECT * FROM teachers WHERE email = ? AND password = ?',
        [email, password],
        (err, results) => {
            next(err, results);
        }
    )
}

exports.create = function(email, name, password, next) {
    db.query(
        'INSERT INTO teachers (email, name, password) VALUES (?, ?, ?);',
        [email, name, password],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.update = function(id, name, password, next) {
    db.query(
        'UPDATE teachers SET name = ?, password = ? WHERE id = ?;',
        [name, password, id],
        (err, results) => {
            next(err, results);
        }
    );
}

exports.delete = function(id, next) {
    db.query(
        'DELETE FROM teachers WHERE id = ?;',
        [id],
        (err, results) => {
            next(err, results);
        }
    );
}