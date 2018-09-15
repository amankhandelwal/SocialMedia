const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateLoginInput(data) {
	let errors = {};

	data.email = isEmpty(data.email) ? '' : data.email;
	data.password = isEmpty(data.password) ? '' : data.password;

	//Other Checks
	if (!Validator.isEmail(data.email)) {
		errors.name = 'Invalid Email';
	}

	//Check for empty strings
	if (Validator.isEmpty(data.email || '')) {
		errors.email = 'Name cannot be empty';
	}
	if (Validator.isEmpty(data.password || '')) {
		errors.password = 'Password cannot be empty';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
