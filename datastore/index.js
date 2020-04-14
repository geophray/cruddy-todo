const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });



  counter.getNextUniqueId(function (err, counterString) {
    if (err) {
      callback(err);
    } else {

      items[counterString] = text;
      callback(null, { counterString, text });

      fs.writeFile(`datastore/data/${counterString}.txt`, text, (err) => {

        if (err) {
          throw err;
        }
      });
    }
  });

};

exports.readAll = (callback) => {

  fs.readdir('./datastore/data', (err, data) => {

    if (err) {
      throw err;
    }
    data = data.map((item) => item.split('.')[0]);
    data = data.map((item) => { return {id: item, text: item}; });
    console.log(data);
    callback(null, data);
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // console.log(data);
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
