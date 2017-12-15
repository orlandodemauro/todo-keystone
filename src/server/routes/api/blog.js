var keystone = require('keystone');
var async = require('async');
var router = require('express').Router();

var PostCategory = keystone.list('PostCategory');

/**
 * List of PostCategory models
 */
var getAllPostCategories = function(req, res) {

  PostCategory.model.find().sort('name').exec(function(err, items) {
    var result = [];
    if (err) return res.err(err);
		// Load the counts for each category
		async.each(items, function (category, next) {

			keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
 
        result.push(Object.assign({ "postCount": count }, JSON.parse(JSON.stringify(category))));
				next(err);
			});
		}, function (err) {
      if (err) return res.err(err);

      res.json({
        data: result
      });
		});

  });
}

/**
 * Get PostCategory by title
 */
var getPostCategory = function(req, res) {
  PostCategory.model.findOne({
    key: req.params.category,
  }).exec(function(err, item) {

    if (err) return res.err(err);
    if (!item) return res.notfound();

    res.json({
      data: item
    });

  });
}

/**
 * Create a PostCategory
 */
var addPostCategory = function(req, res) {

  var item = new PostCategory.model();

  PostCategory.updateItem(item, req.body, function (err) {
    if (err) return res.err(err);
        res.json({
            data: PostCategory.getData(item)
        });
    });
}

/**
 * Update PostCategory by ID
 */
var updatePostCategory = function(req, res) {

  PostCategory.model.findOne({
    key: req.params.category,
  }).exec(function(err, item) {

    if (err) return res.err(err);
    if (!item) return res.notfound();

    PostCategory.updateItem(item, req.body, function (err) {

      if (err) return res.err(err);

      res.json({
        data: PostCategory.getData(item)
      });

    });

  });
}

/**
 * Delete PostCategory by ID
 */
var removePostCategory = function(req, res) {
  PostCategory.model.PostCategory.model.findOne({
    key: req.params.category,
  }).exec(function (err, item) {

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

/**
 * List of Posts by Category key
 */
var getPostsByCategory = function(req, res) {
  
  keystone.list('Post').paginate({
    page: req.query.page || 1,
    perPage: 10,
    maxPages: 10
  })
  .where('categories', req.params.category)
  .sort('-publishedDate')
  .populate('author categories')
  .exec(function(err, results) {
    if (err) return res.err(err);
    res.json({
      data: results
    });
  });
}

router.route('/')
.get(getAllPostCategories)
.post(addPostCategory);

router.route('/posts/:category')
.get(getPostsByCategory)

router.route('/:category')
.get(getPostCategory)
.put(updatePostCategory)
.delete(removePostCategory);

module.exports = router;