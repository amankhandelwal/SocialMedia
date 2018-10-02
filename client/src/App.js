import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import "./App.css";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import store from "./store";
import { clearProfile } from "./actions/profileActions";

import PrivateRoute from "./components/common/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/create-profile/CreateProfile";
import AddExperience from "./components/add-credentials/AddExperience";
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import NotFound from "./components/common/NotFound";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";

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
							<Route exact path="/profiles" component={Profiles} />
							<Route exact path="/profile/:handle" component={Profile} />
							<Switch>
								<PrivateRoute exact path="/dashboard" component={Dashboard} />
							</Switch>
							<Switch>
								<PrivateRoute
									exact
									path="/edit-profile"
									component={CreateProfile}
								/>
							</Switch>
							<Switch>
								<PrivateRoute
									exact
									path="/add-experience"
									component={AddExperience}
								/>
								<PrivateRoute
									exact
									path="/add-education"
									component={AddEducation}
								/>
							</Switch>
							<Switch>
								<PrivateRoute exact path="/feed" component={Posts} />
								<PrivateRoute exact path="/post/:id" component={Post} />
							</Switch>
							<Route exact path="/not-found" component={NotFound} />
						</div>
						<Footer />
					</div>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
