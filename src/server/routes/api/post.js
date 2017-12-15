var keystone = require('keystone');
var router = require('express').Router();

var Post = keystone.list('Post');

/**
 * List of Post models
 */
var getAllPosts = function(req, res) {
  Post.model.find(function(err, items) {

    if (err) return res.err(err);

    res.json({
      data: items
    });

  });
}

/**
 * Get Post by title
 */
var getPost = function(req, res) {
  Post.model.findOne({
    slug: req.params.post,
  }).exec(function(err, item) {

    if (err) return res.err(err);
    if (!item) return res.notfound();

    res.json({
      data: item
    });

  });
}

/**
 * Create a Post
 */
var addPost = function(req, res) {

  var item = new Post.model();

  Post.updateItem(item, req.body, function (err) {
    if (err) return res.err(err);
        res.json({
            data: Post.getData(item)
        });
    });
}

/**
 * Update Post by ID
 */
var updatePost = function(req, res) {

  Post.model.findOne({
    slug: req.params.post,
  }).exec(function(err, item) {

    if (err) return res.err(err);
    if (!item) return res.notfound();

    Post.updateItem(item, req.body, function (err) {

      if (err) return res.err(err);

      res.json({
        data: Post.getData(item)
      });

    });

  });
}

/**
 * Delete Post by ID
 */
var removePost = function(req, res) {
  Post.model.Post.model.findOne({
    slug: req.params.post,
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


router.route('/')
.get(getAllPosts)
.post(addPost);

router.route('/:post')
.get(getPost)
.put(updatePost)
.delete(removePost);

module.exports = router;