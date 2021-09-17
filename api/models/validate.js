/* Utils validation function */
const regexMatch = function (value, regex) {
	if (typeof value === 'string' && value.match(regex))
		return true;
	return false;
}

const isAlphanum = function (value) {
	if (regexMatch(value, /^[a-zA-Z0-9]+$/))
		return true;
	return false;
}

const isAlpha = function (value) {
	if (regexMatch(value, /^[a-zA-Z]+$/))
		return true;
	return false;
}

const isNum = function (value) {
	if (regexMatch(value, /^[0-9]+$/))
		return true;
	return false;
}

const isEmail = function (value) {
	if (regexMatch(value, /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
		return true;
	return false;
}

const isValidPassword = function (value) {
	console.log(value);
	// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
	if (regexMatch(value, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\/\\])[A-Za-z\d@$!%*?&\/\\]{8,}$/))
		return true;
	return false;
}

const isJWT = function (value) {
	if (regexMatch(value, /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+$/))
		return true;
	return false;
}

const isBool = function (value) {
	if (value === 1 || value === 0)
		return true;
	return false;
}

const isImageKey = function (value) {
	const keyArray = ['img0_path', 'img1_path', 'img2_path', 'img3_path', 'img4_path'];

	for (const key of keyArray) {
		if (value == key)
			return true;
	}
	return false;
}

const validateKey = function (value, keyArray) {
	for (const key of keyArray) {
		if (value == key)
			return true;
	}
	return false;
}

module.exports = { isAlphanum, isAlpha, isNum, isEmail, isValidPassword, isJWT, isBool, isImageKey, validateKey };
