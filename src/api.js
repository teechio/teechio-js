(function(Global, undefined) {

	'use strict';

	var teechio = function(apiKey, applicationId) {
		var api = new teechio.fn.init(apiKey, applicationId);
		return api;
	};

	/**
	 * [_ajax description]
	 * @param  {[type]} headers [description]
	 * @param  {[type]} method  [description]
	 * @param  {[type]} url     [description]
	 * @param  {[type]} data    [description]
	 * @param  {[type]} success [description]
	 * @param  {[type]} error   [description]
	 * @return {[type]}         [description]
	 */
	teechio._ajax = function(headers, method, url, data, binary, success, error) {
		if(typeof XMLHttpRequest != 'undefined') {
			var xhr = new XMLHttpRequest();
			var deferred = when.defer();

			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					if(xhr.status && xhr.status == 200) {
						deferred.resolve(JSON.parse(xhr.responseText));
					} else {
						deferred.reject(xhr);
					}
				}
			};

			xhr.open(method, url, true);

			if(binary) {
				xhr.setRequestHeader('Content-Type', 'application/octet-stream');  
			}
			else if(data && !binary) {
				data = JSON.stringify(data);
				xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
			}
			else {
				xhr.setRequestHeader('Content-Type', 'text/plain');  // avoid pre-flight
			}

			if(typeof headers != 'undefined') {
				for(var h in headers) {
					xhr.setRequestHeader(h, headers[h]);
				}
			}

			xhr.send(data);
			return deferred.promise;
		}
	};

	/**
	 * [_request description]
	 * @param  {[type]} route           [description]
	 * @param  {[type]} objectId        [description]
	 * @param  {[type]} method          [description]
	 * @param  {[type]} dataObject      [description]
	 * @param  {[type]} successCallback [description]
	 * @param  {[type]} errorCallback   [description]
	 * @return {[type]}                 [description]
	 */
	teechio._request = function(route, objectId, method, dataObject, binary) {
	    if (!teechio.applicationId) {
	      throw 'You must specify your applicationId using teechio.init';
	    }

	    if (!teechio.apiKey) {
	      throw 'You must specify a key using teechio.init';
	    }

	    var headers = {
	    	"Teech-REST-API-Key": teechio.apiKey,
	    	"Teech-Application-Id": teechio.applicationId
	    }

	    var url = teechio.url;
	    if (teechio.url.charAt(url.length - 1) !== "/") {
  			url += "/";
		}
		url += route;
		if (objectId) {
  			url += "/" + objectId;
		}

	    return teechio._ajax(headers, method, url, dataObject, binary);
	};

	/**
	 * [fn description]
	 * @type {Function}
	 */
	teechio.fn = teechio.prototype = {
		constructor: teechio,
		serverURL: 'http://api.teech.io',

		init: function(apiKey, applicationId) {
			teechio.url = this.serverURL;
			teechio.apiKey = apiKey;
			teechio.applicationId = applicationId;
		}
	};
	teechio.fn.init.prototype = teechio.fn;

	/**
	 * [Object description]
	 * @param {[type]} attributes [description]
	 * @param {[type]} route      [description]
	 */
	teechio.Object = function(attributes, route) {
		this.route = route || 'classes';
		this.attributes = attributes || {};
	};

	teechio.Object.prototype = {
		fetchAll: function() {
			return teechio._request(this.route, null, 'GET', {});
		},

		fetch: function(id) {
			return teechio._request(this.route, id, 'GET', {});
		},

		save: function() {
			return teechio._request(this.route, null, 'POST', this.attributes);
		},

		update: function() {
			return teechio._request(this.route, null, 'PUT', this.attributes);
		},

		delete: function(id) {
			return teechio._request(this.route, id, 'DELETE', {});
		},

		toString: function() {
			return JSON.stringify(this.attributes);
		}
	};

	/**
	 * [User description]
	 * @param {[type]} attributes [description]
	 */
	teechio.User = function(attributes) {
		var user = new teechio.Object(attributes, 'users');

		user.auth = function() {
			var url = 'signin?username=' + attributes.username + '&password=' + attributes.password; 
			return teechio._request(this.route + '/' + url, null, 'GET', {});
		};

		return user;
	};

	teechio.Module = function(attributes) {
		var module = new teechio.Object(attributes, 'modules');

		module.save = function() {
			if (!attributes || !attributes.title) {
				throw 'You must specify a title to create a module object';
			}
			return teechio.Object.prototype.save.call(this);
		};

		return module;
	};

	teechio.Material = function(attributes) {
		var material = new teechio.Object(attributes, 'materials');

		material.save = function() {
			if (!attributes || !attributes.title) {
				throw 'You must specify a title to create a material object';
			}
			if (!attributes || !attributes.description) {
				throw 'You must specify a description to create a material object';
			}
			return teechio.Object.prototype.save.call(this, this.route, null, 'POST', this.attributes);
		};

		return material;
	};

	teechio.Enrollment = function() {
		var enrollment = new teechio.Object({}, 'enrollments');

		enrollment.enroll = function(user, module) {
			var url = user + '/in/' + module;
			return teechio._request(this.route + '/' + url, null, 'PUT', {});
		};

		enrollment.get = function(userID) {
			return teechio.Object.prototype.get.call(this, userID);
		};

		enrollment.withdraw = function(user, module) {
			var url = user + '/withdraw/' + module;
			return teechio._request(this.route + '/' + url, null, 'PUT', {});
		};

		// @override
		enrollment.save = function() {
			throw 'No such method for this endpoint!'
		};

		return enrollment;
	};

	teechio.Assessment = function(attributes) {
		var assessment = new teechio.Object(attributes, 'assessments');

		assessment.save = function() {
			if (!attributes || !attributes.title) {
				throw 'You must specify a title to create an assessment object';
			}
			if (!attributes || !attributes.subject) {
				throw 'You must specify a subject to create an assessment object';
			}
			if (!attributes || !attributes.type) {
				throw 'You must specify a type to create an assessment object';
			}
			return teechio.Object.prototype.save.call(this, this.route, null, 'POST', this.attributes);
		};

		return assessment;
	};

	teechio.Assignment = function(attributes) {
		var assignment = new teechio.Object(attributes, 'assignments');

		assignment.save = function() {
			if (!attributes || !attributes.title) {
				throw 'You must specify a title to create an assessment object';
			}
			if (!attributes || !attributes.material) {
				throw 'You must specify a material to create an assessment object';
			}
			if (!attributes || !attributes.module) {
				throw 'You must specify a module to create an assessment object';
			}
			return teechio.Object.prototype.save.call(this, this.route, null, 'POST', this.attributes);
		};

		return assignment;
	};

	teechio.Submission = function(attributes) {
		var submission = new teechio.Object(attributes, 'submissions');

		submission.save = function() {
			if (!attributes || !attributes.user) {
				throw 'You must specify a user to create an assessment object';
			}
			if (!attributes || !attributes.assignmentl) {
				throw 'You must specify a assignment to create an assessment object';
			}
			if (!attributes || !attributes.body) {
				throw 'You must specify a body to create an assessment object';
			}
			return teechio.Object.prototype.save.call(this, this.route, null, 'POST', this.attributes);
		};

		submission.grade = function(id, score) {
			this.attributes.score = score;
			return teechio._request(this.route + '/' + id + '/score', null, 'PUT', this.attributes.score);
		};

		return submission;
	};

	teechio.Insight = function(attributes) {
		var insight = new teechio.Object(attributes, 'insights');

		insight.assignment = function(assignmentID) {
			var url = this.route + '/assignment/' + assignmentID;
			return teechio._request(url, null, 'GET', {});
		};

		return insight;
	};

	teechio.File = function(attributes) {
		var file = new teechio.Object(attributes, 'files');

		file.save = function(filename, bytes) {
			return teechio._request(this.route, filename, 'POST', bytes, true);
		};

		file.delete = function(filename) {
			return teechio._request(this.route, filename, 'DELETE', {});
		};

		return file;
	};

	Global.Teechio = teechio;

}(typeof exports === 'object' && exports ? exports : (typeof module === "object" && module && typeof module.exports === "object" ? module.exports : window)));