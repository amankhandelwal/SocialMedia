import axios from "axios";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import setAuthToken from "../utils/setAuthToken";

//REGISTER USER
export const registerUser = (userData, history) => dispatch => {
	console.log("Register Action fired");
	axios
		.post("/api/users/register", userData)
		.then(res => history.push("/login"))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

//LOGIN USER
export const loginUser = (userData, history) => dispatch => {
	console.log("Login Action fired");
	axios
		.post("/api/users/login", userData)
		.then(res => {
			const { token } = res.data;
			//save token to localStorage
			localStorage.setItem("jwtToken", token);
			//set token to auth header
			setAuthToken(token);
			//Token contains the user's data. Let's decode that
			const decoded = jwt_decode(token);
			//set current user
			dispatch(setCurrentUser(decoded));
		})
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

//set logged in user
export const setCurrentUser = decode => ({
	type: SET_CURRENT_USER,
	payload: decode
});

//log out user
export const logoutUser = () => dispatch => {
	//Remove the token from localStorage
	localStorage.removeItem("jwtToken");
	//Remove the auth Header from axios for future request
	setAuthToken(false);
	//set current user to {} and isAuthenticated to false
	dispatch(setCurrentUser({}));
};
