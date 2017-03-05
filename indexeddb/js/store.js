/*global indexedDB */
/*jshint eqeqeq:false */
(function (window) {
	'use strict';

	/**
	 * Creates a new client side storage object and will create an empty
	 * collection if no collection already exists.
	 *
	 * @param {string} name The name of our DB we want to use
	 * @param {function} callback Our fake DB uses callbacks because in
	 * real life you probably would be making AJAX calls
	 */
	function Store(name, callback) {
		callback = callback || function () {};

		this._dbName = name;
		this._objectStoreName = 'todos';

		var self = this;

		var request = indexedDB.open(this._dbName, 1);
		request.onupgradeneeded = function(event) {
			var db = event.target.result;
			db.createObjectStore(self._objectStoreName, { keyPath: 'id', autoIncrement: true });
		};
		request.onsuccess = function(event) {
			self.db = event.target.result;
			callback(self);
		};
	}

	/**
	 * Finds items based on a query given as a JS object
	 *
	 * @param {object} query The query to match against (i.e. {foo: 'bar'})
	 * @param {function} callback	 The callback to fire when the query has
	 * completed running
	 *
	 * @example
	 * db.find({foo: 'bar', hello: 'world'}, function (data) {
	 *	 // data will return any items that have foo: bar and
	 *	 // hello: world in their properties
	 * });
	 */
	Store.prototype.find = function (query, callback) {
		if (!callback) {
			return;
		}
		var self = this;

		this.findAll(function(todos) {
			callback.call(self, todos.filter(function (todo) {
				for (var q in query) {
					if (query[q] !== todo[q]) {
						return false;
					}
				}
				return true;
			}));
		});
	};

	/**
	 * Will retrieve all data from the collection
	 *
	 * @param {function} callback The callback to fire upon retrieving data
	 */
	Store.prototype.findAll = function (callback) {
		if (!callback) {
			return;
		}
		var todos = [];
		var self = this;
		var transaction = this.db.transaction(this._objectStoreName);
		var objectStore = transaction.objectStore(this._objectStoreName);
		objectStore.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				todos.push(cursor.value);
				cursor.continue();
			} else {
				callback.call(self, todos);
			}
		};
	};

	/**
	 * Will save the given data to the DB. If no item exists it will create a new
	 * item, otherwise it'll simply update an existing item's properties
	 *
	 * @param {object} updateData The data to save back into the DB
	 * @param {function} callback The callback to fire after saving
	 * @param {number} id An optional param to enter an ID of an item to update
	 */
	Store.prototype.save = function (updateData, callback, id) {
		callback = callback || function () {};
		var self = this;
		var transaction = this.db.transaction(this._objectStoreName, 'readwrite');
		var objectStore = transaction.objectStore(this._objectStoreName);
		var request;
		if (id) {
			request = objectStore.get(id);
			request.onsuccess = function(event) {
				var data = event.target.result;
				for (var key in updateData) {
					if (updateData.hasOwnProperty(key)) {
						data[key] = updateData[key];
					}
				}
				var request = objectStore.put(data);
				request.onsuccess = function(event) {
					callback.call(self);
				};
			};
		} else {
			request = objectStore.add(updateData);
			request.onsuccess = function(event) {
				callback.call(self);
			};
		}
	};

	/**
	 * Will remove an item from the Store based on its ID
	 *
	 * @param {number} id The ID of the item you want to remove
	 * @param {function} callback The callback to fire after saving
	 */
	Store.prototype.remove = function (id, callback) {
		var transaction = this.db.transaction(this._objectStoreName, 'readwrite');
		var objectStore = transaction.objectStore(this._objectStoreName);
		var request = objectStore.delete(id);
		var self = this;
		request.onsuccess = function(event) {
			callback.call(self);
		};
	};

	/**
	 * Will drop all storage and start fresh
	 *
	 * @param {function} callback The callback to fire after dropping the data
	 */
	Store.prototype.drop = function (callback) {
		var self = this;
		this.findAll(function(todos) {
			var transaction = this.db.transaction(this._objectStoreName, 'readwrite');
			transaction.oncomplete = function() {
				callback.call(self);
			};
			var objectStore = transaction.objectStore(this._objectStoreName);
			todos.forEach(function(todo) {
				objectStore.delete(todo.id);
			});
		});
	};

	// Export to window
	window.app = window.app || {};
	window.app.Store = Store;
})(window);
