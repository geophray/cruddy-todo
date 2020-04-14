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
      // items[counterString] = text;
      fs.writeFile(path.join(exports.dataDir, `${counterString}.txt`), text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id: counterString, text: text });
        }
      });
    }
  });

};

exports.readAll = (callback) => {

  fs.readdir(path.join(exports.dataDir), (err, data) => {

    if (err) {
      throw err;
    }


    data = data.map((todo) => todo.split('.')[0]);
    // data = data.map((todo) => { return {id: todo, text: todo}; });

    var todoList = [];


    for (var id of data) {


      fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, data) => {
        if (err) {
          callback(err);

        } else {

          todoList.push({id: id, text: data.toString()});
        }
      });

    }

    callback(null, data);
  });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // console.log(data);
  // callback(null, data);
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
