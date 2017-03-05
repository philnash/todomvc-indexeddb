/*global app, $on */
(function () {
	'use strict';

	/**
	 * Sets up a brand new Todo list.
	 *
	 * @param {string} name The name of your new to do list.
	 * @param {function} callback A function to run when the database is set up
	 *                            the application is ready to start
	 */
	function Todo(name, callback) {
		var self = this;
		this.storage = new app.Store(name, function(storage) {
			self.model = new app.Model(storage);
			self.template = new app.Template();
			self.view = new app.View(self.template);
			self.controller = new app.Controller(self.model, self.view);
			callback.call(self, self);
		});
	}

	var todo = new Todo('todos-vanillajs', function(todo) {
		function setView() {
			todo.controller.setView(document.location.hash);
		}
		$on(window, 'load', setView);
		$on(window, 'hashchange', setView);
		setView();
	});
})();
