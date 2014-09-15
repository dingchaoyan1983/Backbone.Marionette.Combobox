require.config({
	paths: {
		'marionette': './bower_components/backbone.marionette/lib/backbone.marionette',
		'backbone': './bower_components/backbone/backbone',
		'handlebars': './bower_components/handlebars/handlebars',
		'jquery': './bower_components/jquery/dist/jquery',
		'underscore': './bower_components/underscore/underscore',
		'backbone.wreqr': './bower_components/backbone.wreqr/lib/backbone.wreqr',
		'backbone.babysitter': './bower_components/backbone.babysitter/lib/backbone.babysitter',
		'text': './bower_components/text/text',
		'bootstrap': './bower_components/bootstrap/dist/js/bootstrap'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		handlebars: {
			exports: 'Handlebars'
		},
		bootstrap: {
			deps:['jquery']
		}
		
	}
});


require(['backbone', 'jquery', './lib/ComboboxView'], function (Backbone, $, ComboboxView) {
    var personCollection = new Backbone.Collection([
      {name: 'test1'},
      {name: 'test2'}
    ]);

    var combo = new ComboboxView({
      collection: personCollection
    });

   $('body').html(combo.render().$el);
})