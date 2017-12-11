// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'todoApi',
	'brand': 'todoApi',
	'auto update': false,
	'session': true,
    'auth': false,
    'cookie secret': 'thisisacoockiesecretkey',
	'user model': 'User',
});

// Load your project's Models
keystone.import('models');

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Start Keystone to connect to your database and initialise the web server

keystone.start();