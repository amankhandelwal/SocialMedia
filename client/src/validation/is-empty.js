const isEmpty = value =>
	value === undefined ||
	value === null ||
	(typeof value === "object" && Object.keys(value).length === 0) ||
	(typeof value === "string" && value.trim().length === 0);

export default isEmpty;

//This won't be used
export const populateEmpty = (obj = {}) => {
	console.log("Object: ", obj);
	const keys = Object.keys(obj);
	for (let i = 0; i < keys.length; i++) {
		let item = obj[keys[i]];
		if (Array.isArray(item)) continue;
		else if (isEmpty(item)) {
			obj[keys[i]] = "";
		} else if (typeof value === "object") {
			obj[keys[i]] = populateEmpty(item);
		}
	}
	return obj;
};
