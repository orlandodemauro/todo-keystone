var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Todo Model
 * ==========
 */
var Todo = new keystone.List('Todo');

Todo.add({
  title: { type: String, required: true, default: "" },
  complete: { type: Boolean, required: true, default: false },
});


/**
 * Registration
 */
Todo.register();