const Validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = function validateRegisterInput(data) {
	let errors = {};
	data.name = isEmpty(data.name) ? '' : data.name;
	data.email = isEmpty(data.email) ? '' : data.email;
	data.password = isEmpty(data.password) ? '' : data.password;
	data.password2 = isEmpty(data.password2) ? '' : data.password2;
	//Other Checks
	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = 'Name must be between 2 and 30 characters';
	}
	if (!Validator.isEmail(data.email)) {
		errors.name = 'Invalid Email';
	}
	if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
		errors.password = 'Password must be between 8 and 30 characters';
	}
	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = 'Passwords do not match';
	}

	//Check for empty strings
	if (Validator.isEmpty(data.name || '')) {
		errors.name = 'Name cannot be empty';
	}
	if (Validator.isEmpty(data.email || '')) {
		errors.email = 'Name cannot be empty';
	}
	if (Validator.isEmpty(data.password || '')) {
		errors.password = 'Password cannot be empty';
	}
	if (Validator.isEmpty(data.password2 || '')) {
		errors.password2 = 'Confirm Password cannot be empty';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
