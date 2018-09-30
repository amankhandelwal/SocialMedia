import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profileActions";
import Loading from "../common/Loading";

class Dashboard extends Component {
	componentDidMount() {
		this.props.getCurrentProfile();
	}

	render() {
		const { user } = this.props.auth;
		const { profile, loading } = this.props.profile;

		let dashboardContent;
		if (profile === null || loading) {
			dashboardContent = <Loading />;
		} else if (Object.keys(profile).length > 0) {
			//If they have the profile ready
			dashboardContent = <code>{user}</code>;
		} else {
			//If they don't have a profile ready
			dashboardContent = (
				<div>
					<p className="lead text-muted">Welcome {user.name}</p>
					<p>
						You have not yet setup a profile... It'd be cool to add some info
					</p>
					<Link to="/create-profile" className="btn btn-lg btn-info">
						Create Profile
					</Link>
				</div>
			);
		}
		return (
			<div className="dashboard">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h1 className="display-4">Dashboard</h1>
							{dashboardContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = {
	profile: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile,
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ getCurrentProfile }
)(Dashboard);
