import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import "./App.css";
import store from "./store";
import { clearProfile } from "./actions/profileActions";

//Check for token
if (localStorage.jwtToken) {
	//set auth token header auth
	setAuthToken(localStorage.jwtToken);
	//Decode token and get user info and expiration
	const decoded = jwt_decode(localStorage.jwtToken);
	//Set currentUser and isAuthenticated
	store.dispatch(setCurrentUser(decoded));

	//Check for Expired token
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		//Logout the user
		store.dispatch(logoutUser());
		store.dispatch(clearProfile());
		//Redirect to login
		window.location.href = "/login";
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="container">
							<Route exact path="/login" component={Login} />
							<Route exact path="/register" component={Register} />
							<Switch>
								<PrivateRoute exact path="/dashboard" component={Dashboard} />
							</Switch>
						</div>
						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
