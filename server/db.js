'use strict';

const sqlite = require('sqlite3');

// open the database
exports.db = new sqlite.Database('studyplan.db', (err) => {
  if (err) throw err;
});

/*
this.closeDB = () => {
    try {
      db.close();
    }
    catch (error) {
      console.log('Impossible to close the database. Error:');
      console.error(error);
    }
  }
*/
