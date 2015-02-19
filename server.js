// Modules
var Hapi = require('hapi');
var Path = require('path');
var math = require('mathjs');
var ratio = require('ratio');

// Internals
var internals = {};

// Create the server
var server = new Hapi.Server();

// Create a connection
server.connection({
  port: 3000
});

// Register views
server.views({
  engines: {
    html: require('handlebars')
  },
  relativeTo: __dirname,
  path: './views',
  layout: './layout',
  helpersPath: './views/helpers'
});

// Register routes
server.route([
  {
    method: 'GET',
    path: '/',
    handler: {
      view: 'index'
    }
  },
  {
    method: 'POST',
    path: '/',
    handler: function(request, reply) {
      var original = request.payload.ingredients;
      var modified = original.replace(/^([0-9/.]+)(.*)/img, function(match, quantity, ingredient) {
        var newQuantity = math.eval(quantity + '/ 2');
        return ratio(newQuantity).toString() + ingredient;
      });
      return reply.view('index', {
        original: original,
        modified: modified
      });
    }
  }
]);

// Start the server
server.start(function() {
  console.log('Server running at: ' + server.info.uri);
});
