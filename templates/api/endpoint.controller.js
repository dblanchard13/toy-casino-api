var <%= upCaseName %> = require('./<%= name %>.model');
var _ = require('lodash');
var log = require('db.log');

exports.params = function(req, res, next, id){
  <%= upCaseName %>.findById(id)
    // this grabs relations on get request, only needed if foreign key relationships are defined
    .populate('author', 'username')
    .exec()
    .then(function(<%= name %>){
      if(!<%= name %>){
        next(new Error('No <%= name %> with that id'));
      }
      else{
        req.<%= name %> = <%= name %>;
        next();
      }
    },
    function(err){
      next(err);
    });
};

exports.get = function(req, res, next){
  <%= upCaseName %>.find({})
    // this grabs relations on get request, only needed if foreign key relationships are defined
    .populate('author categories')
    .exec()
    .then(function(<%= name %>s){
      res.json(<%= name %>s);
    },
    function(err){
      next(err);
    });
};

exports.getOne = function(req, res, next){
  var <%= name %> = req.<%= name %>;
  res.json(<%= name %>);
};

exports.put = function(req, res, next){
  var <%= name %> = req.<%= name %>;

  var update = req.body;

  _.merge(<%= name %>, update);

  <%= name %>.save(function(err, saved){
    if(err){
      next(err);
    }
    else{
      res.json(saved);
    }
  });
};

exports.post = function(req, res, next){
  var new<%= upCaseName %> = req.body;
  new<%= upCaseName %>.author = req.user._id;
  <%= upCaseName %>.create(new<%= upCaseName %>)
    .then(function(<%= name %>) {
      res.json(<%= name %>);
    },
    function(err) {
      log.error(err);
      next(err);
    });
};

exports.delete = function(req, res, next){
  req.<%= name %>.remove(function(err, removed){
    if(err){
      next(err);
    }
    else{
      res.json(removed);
    }
  });
};
