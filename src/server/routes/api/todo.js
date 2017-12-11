var keystone = require('keystone');
var router = require('express').Router();

var Todo = keystone.list('Todo');

// router.route('/')
//   .get(getAllTodos)
//   .post(addTodo);
  
// router.route('/:id')
//   .get(getTodo)
//   .put(updateTodo)
//   .delete(removeTodo);

// module.exports = router;

/**
 * List Tod
 */
exports.list = function(req, res) {
  Todo.model.find(function(err, items) {

    if (err) return res.err(err);

    res.json({
      Todo: items
    });

  });
}

/**
 * Get Todo by ID
 */
exports.get = function(req, res) {
  Todo.model.findById(req.params.id).exec(function(err, item) {

    if (err) return res.err(err);
    if (!item) return res.notfound();

    res.json({
      Todo: item
    });

  });
}

/**
 * Create a Todo
 */
exports.create = function(req, res) {

  var item = new Todo.model();

  Todo.updateItem(item, req.body, function (err) {
    if (err) return res.err(err);
        res.json({
            Todo: Todo.getData(item)
        });
    });
}

/**
 * Update Todo by ID
 */
exports.update = function(req, res) {

  Todo.model.findById(req.params.id).exec(function(err, item) {

    if (err) return res.err(err);
    if (!item) return res.notfound();

    Todo.updateItem(item, req.body, function (err) {

      if (err) return res.err(err);

      res.json({
        Todo: Todo.getData(item)
      });

    });

  });
}

/**
 * Delete Todo by ID
 */
exports.remove = function(req, res) {
  Todo.model.findById(req.params.id).exec(function (err, item) {

    if (err) return res.err(err);
    if (!item) return res.notfound();

    item.remove(function (err) {
      if (err) return res.json({ dberror: err });

      return res.json({
        success: true
      });
    });

  });
}
