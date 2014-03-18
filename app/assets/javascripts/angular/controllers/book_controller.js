
bookApp.controller('bookAppController', function($scope, $rootScope, $interval, $http, 
	$timeout, $q){

	$scope.toggle_characters = function(){
		console.log('toggle_characters');
	}

	$scope.toggle_first_sentence = function(){
		console.log('toggle_first_sentence');
	}

	$scope.toggle_note_for_parents = function(){
		console.log('toggle_note_for_parents');
	}

	$scope.toggle_quotes = function(){
		console.log('toggle_quotes');
	}

	$scope.toggle_themes = function(){
		console.log('toggle_themes');
	}

	$scope.toggle_subject_places = function(){
		console.log('toggle_subject_places');
	}

	$scope.toggle_movies_based = function(){
		console.log('toggle_movies_based');
	}

	$scope.toggle_tags = function(){
		console.log('toggle_tags');
	}

	_init = function(){
		$scope.expand_characters = false;
		$scope.expand_first_sentence = false;
		$scope.expand_note_for_parents = false;
		$scope.expand_quotes = false;
		$scope.expand_themes = false;
		$scope.expand_subject_places = false;
		$scope.expand_tags = false;
	}

	_init();

});