/*
	Database Interface
	For forms sake I'm going to try and establish an interface-like structure here. this is an implementation of a 


	- init ()			: Initializes the database if necessary
	- get (key)			: Gets a row based on the primary key
	- remove (key)		: Removes a row based on the inputed primary key
	- insert (key, ...)	: Insert a row based on the inputted primary key
	- update (key)		: updates a row based on the inputed primary key
*/

exports.init = function init() {}

exports.get = function get (key) {}

exports.remove = function remove (key) {}

exports.insert = function insert (key, ...) {}

exports.update = function update (key) {}
