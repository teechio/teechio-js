(function(Teechio) {

	var apiKey = "YOUR API KEY",
		applicationId = "YOUR APPLICATION ID";

	module("Teech.io JS SDK tests");

	test('Initialize library', function() 
	{
		var teechio = Teechio(apiKey, applicationId);
		notEqual(teechio, undefined, 'teech.io is NOT undefined');
		notEqual(teechio, 'undefined', 'teech.io is NOT undefined');
	});

	test('Generic Object creation', function() 
	{
		var teechio = Teechio(apiKey, applicationId);
		var obj = new Teechio.Object({
			classname: 'tests_objects'
		});
		notEqual(obj, undefined, 'object created succesfully');
	});

	test('Object inheritance', function() 
	{
		var teechio = Teechio(apiKey, applicationId);
		var user = new Teechio.User();
		notEqual(user, undefined, 'user created succesfully');
	});

	asyncTest('Fetch Objects', 1, function() 
	{
		var teechio = Teechio(apiKey, applicationId);
		var obj = new Teechio.Object();
		obj.fetchAll().then(function(res) {
			start();
        	ok(res, "Fetched objects: " + JSON.stringify(res));
		});
	});

	asyncTest('Fetch Object inherited', 1, function() 
	{
		var teechio = Teechio(apiKey, applicationId);
		var user = new Teechio.User();
		user.fetchAll().then(function(res) {
			start();
        	ok(res, "Fetched users: " + JSON.stringify(res));
		});
	});

	asyncTest('Sign in users', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var user = new Teechio.User({
			username: 'anna',
			password: 'demo'
		});
		user.auth().then(function(res) {
			start();
			ok(res, "Signed up: " + JSON.stringify(res));
		});
	});

	asyncTest('Get an object', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var material = new Teechio.Material();
		material.fetch('52933c5ce4b05ead369f857b').then(function(res) {
			start();
			ok(res, "Retrieved object: " + JSON.stringify(res));
		});
	});

	asyncTest('Save an object', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var object = new Teechio.Object({
			classname: 'test_sdk_js',
			unitTest: true
		});
		object.save().then(function(res) {
			start();
			ok(res, "Retrieved object: " + JSON.stringify(res));
		});
	});

	asyncTest('Test HTTP Header error', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var user = new Teechio.User();
		user.fetch('3636474848').then(function(res) {
			start();
			ok(res, "HTTP Header: " + JSON.stringify(res));
		}).catch(function(err) {
			start();
			ok(err, "HTTP Error: " + JSON.stringify(err));
		});
	});

	test('Throw error on mandatory properties', function() {
		throws(function() {
			var teechio = Teechio(apiKey, applicationId);
			var module = Teechio.Module();
			module.save();
		}, "Error raised succesfully");
	});

	asyncTest('Get enrollments for a user', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var enrollment = new Teechio.Enrollment();
		enrollment.fetch('52933c5ce4b05ead369f8575').then(function(res) {
			start();
			ok(res, "User enrollments: " + JSON.stringify(res));
		});
	});

	test('No such method for an endpoint', function() {
		throws(function() {
			var teechio = Teechio(apiKey, applicationId);
			var enrollment = new Teech.Enrollment();
			enrollment.save();
		}, "Error raised succesfully");
	});

	asyncTest('File upload', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var file = new Teechio.File();
		file.save('hello.txt', [746, 8389, 0309]).then(function(res) {
			start();
			ok(res, "File uploaded succesfully");	
		});
	});

	asyncTest('Insights', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var insight = new Teechio.Insight();
		insight.assignment('52933c5ce4b05ead369f8588').then(function(res) {
			start();
			ok(res, "Insights for assignment: " + JSON.stringify(res));
		});
	});

	asyncTest('Assessment build', 1, function() {
		var teechio = Teechio(apiKey, applicationId);
		var assessment = new Teechio.Assessment({
			title: 'test assessment creation js sdk',
			type: 'points',
			subject: 'life_sciences'
		});
		assessment.save().then(function(res) {
			start();
			ok(res, "Assessment created: " + JSON.stringify(res));
		});
	});

}(window.Teechio));