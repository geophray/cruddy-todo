const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

const readFileAsync = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId(function (err, id) {
    if (err) {
      callback(err);
    } else {
      // items[counterString] = text;
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

};

exports.readAll = (callback) => {

  fs.readdir(path.join(exports.dataDir), (err, files) => {

    if (err) {
      throw ('error reading data folder');

    }

    var data = files.map((todo) => {

      var id = path.basename(todo, '.txt');

      return readFileAsync(path.join(exports.dataDir, todo))
        .then(fileData => {
          return {
            id,
            text: fileData.toString()
          };
        });
    });

    Promise.all(data)
      .then(items => callback(null, items));
  });

};

exports.readOne = (id, callback) => {

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id: id, text: data.toString() });
    }

  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {

  // fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, function (err) {

  //   if (err) {
  //     callback(err);

  //   } else {
  //     callback(null, { id: id, text: text });
  //   }

  // });

  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err) => {

    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, function (err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });



  // var fileExists = fs.existsSync(exports.dataDir, `${id}.txt`);
  // var fileExists = path.exists(exports.dataDir, `${id}.txt`);
  // var fileExists = false || path.isfile(exports.dataDir, `${id}.txt`);


  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }











  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

};

exports.delete = (id, callback) => {

  fs.unlink(path.join(exports.dataDir, `${id}.txt`), function (err) {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });


  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
