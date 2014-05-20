module.exports = function(grunt) {

	grunt.initConfig({

		VERSION: '0.5.0',

		pkg: grunt.file.readJSON('package.json'),

   		qunit: {
      		files: ['test/**/*.html']
    	},

		clean: {
			src: ['dist']
		},

		concat: {
			dist: {
				src: ['libs/**/*.js', 'src/api.js'],
				dest: 'dist/teech.io.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= VERSION %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dist/teech.io.js',
				dest: 'dist/teech.io-<%= VERSION %>.min.js'
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
  	grunt.loadNpmTasks('grunt-contrib-clean');
  	grunt.loadNpmTasks('grunt-contrib-concat');
  	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('build', ['clean', 'concat', 'uglify']);
	grunt.registerTask('default', ['qunit', 'clean', 'concat', 'uglify']);
};