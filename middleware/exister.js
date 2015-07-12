const Q = require('q');
const squel = require('squel');

module.exports.university = function() {
  return function(req, res, next) {
    const universityID = req.sanitize('universityID').escape();
    const subQuery = squel.select()
      .field('1')
      .from('juvity.universities')
      .where('id = ?', universityID)
      .limit(1);
    const query = squel.select()
      .field('EXISTS(' + subQuery + ')', 'exists')
      .from('juvity.users')
      .toString();
    req.pgClient.promiseQuery(query)
      .then(function(results) {
        if (results.rows[0].exists === false) {
          const error = new Error('University id does not exists!');
          error.status = 400;
          return Q.reject(error);
        }

        req.session.universityID = universityID;
        next();
      })
      .fail(next);
  }
};

module.exports.institute = function() {
  return function(req, res, next) {
    const instituteID = req.sanitize('instituteID').escape();
    const subQuery = squel.select()
      .field('1')
      .from('juvity.institutions')
      .where('id = ?', instituteID)
      .limit(1);
    const query = squel.select()
      .field('EXISTS(' + subQuery + ')', 'exists')
      .toString();
    req.pgClient.promiseQuery(query)
      .then(function(results) {
        if (results.rows[0].exists === false) {
          const error = new Error('Institute id does not exists!');
          error.status = 400;
          return Q.reject(error);
        }

        req.session.instituteID = instituteID;
        next();
      })
      .fail(next);
  }
};

module.exports.faculty = function() {
  return function(req, res, next) {
    const facultyID = req.sanitize('facultyID').escape();
    const subQuery = squel.select()
      .field('1')
      .from('juvity.faculties')
      .where('id = ?', facultyID)
      .limit(1);
    const query = squel.select()
      .field('EXISTS(' + subQuery + ')', 'exists')
      .toString();
    req.pgClient.promiseQuery(query)
      .then(function(results) {
        if (results.rows[0].exists === false) {
          const error = new Error('Faculty id does not exists!');
          error.status = 400;
          return Q.reject(error);
        }

        req.session.facultyID = facultyID;
        next();
      })
      .fail(next);
  }
};

module.exports.department = function() {
  return function(req, res, next) {
    const departmentID = req.sanitize('departmentID').escape();
    const subQuery = squel.select()
      .field('1')
      .from('juvity.departments')
      .where('id = ?', departmentID)
      .limit(1);
    const query = squel.select()
      .field('EXISTS(' + subQuery + ')', 'exists')
      .toString();
    req.pgClient.promiseQuery(query)
      .then(function(results) {
        if (results.rows[0].exists === false) {
          const error = new Error('Department id does not exists!');
          error.status = 400;
          return Q.reject(error);
        }

        req.session.departmentID = departmentID;
        next();
      })
      .fail(next);
  }
};
