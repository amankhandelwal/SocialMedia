import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { deletePost, toggleLike } from "../../actions/postActions";

class PostItem extends Component {
	onDeleteClick(id) {
		this.props.deletePost(id);
	}
	onLikeClick(id) {
		this.props.toggleLike(id);
	}
	findUserLike(likes) {
		const { auth } = this.props;
		if (likes.filter(like => like.user === auth.user.id).length > 0)
			return true;
		else return false;
	}

	render() {
		const { post, auth, showActions } = this.props;

		return (
			<div className="posts">
				<div className="card card-body mb-3">
					<div className="row">
						<div className="col-md-2">
							<a href="profile.html">
								<img
									className="rounded-circle d-none d-md-block"
									src={post.avatar}
									alt="avatar"
								/>
							</a>
							<br />
							<p className="text-center">{post.name}</p>
						</div>
						<div className="col-md-10">
							<p className="lead">{post.text}</p>
							<button
								type="button"
								onClick={this.onLikeClick.bind(this, post._id)}
								className="btn btn-light mr-1"
							>
								<i
									className={classnames("fas fa-thumbs-up", {
										"text-info": this.findUserLike(post.likes)
									})}
								/>
								<span className="badge badge-light">{post.likes.length}</span>
							</button>
							{showActions ? (
								<Link to={`/post/${post._id}`} className="btn btn-info mr-1">
									Comments
								</Link>
							) : null}
							{post.user === auth.user.id ? (
								<button
									onClick={this.onDeleteClick.bind(this, post._id)}
									type="button"
									className="btn btn-danger mr-1"
								>
									<i className="fas fa-times" /> Delete Post
								</button>
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deletePost: PropTypes.func.isRequired,
	toggleLike: PropTypes.func.isRequired
};
PostItem.defaultProps = {
	showActions: true
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ deletePost, toggleLike }
)(PostItem);
