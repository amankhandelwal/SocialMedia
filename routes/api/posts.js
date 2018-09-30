const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport");

const Post = require("./../../models/Post");
const Profile = require("./../../models/Profile");

const validatePostInput = require("../../validators/post");

// @route GET api/posts/test
// @desc Tests posts route
// @access Public
router.get("/test", (req, res) => console.log("posts"));

// @route POST api/posts
// @desc Create a new post
// @access Private
router.post(
	"/",
	passport.authenticate("jwt", { session: true }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);
		//check validation
		if (!isValid) {
			return res.status(400).json(errors);
		}
		const newPost = new Post({
			text: req.body.text,
			name: req.body.name,
			avatar: req.body.avatar,
			user: req.user.id
		});
		newPost
			.save()
			.then(post => res.json(post))
			.catch(err => res.status(400).json(err));
	}
);

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get("/", (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get("/:id", (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			if (post) {
				res.json(post);
			} else {
				res.status(404).json({ nopostfound: "No post found with that ID" });
			}
		})
		.catch(err =>
			res.status(404).json({ nopostfound: "No post found with that ID" })
		);
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					// Check for post owner
					if (post.user.toString() !== req.user.id) {
						//Authorization status = 401
						return res
							.status(401)
							.json({ notauthorized: "User not authorized" });
					}

					// Delete
					post.remove().then(() => res.json({ success: true }));
				})
				.catch(err => res.status(404).json({ postnotfound: "No post found" }));
		});
	}
);

// @route   POST api/posts/like/:id
// @desc    Toggle Likes of the post
// @access  Private
router.post(
	"/like/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					// Filter and keep only those likes where the username matches
					if (
						post.likes.filter(like => like.user.toString() === req.user.id)
							.length > 0
					) {
						// User has already liked the post
						const removeIndex = post.likes
							.map(item => item.user.toString)
							.indexOf(req.user.id);
						post.likes.splice(removeIndex, 1);
						post.save().then(post => res.json(post));
						/* return res
							.status(400)
							.json({ alreadyliked: "User has already liked this post" }); */
					} else {
						//User hasn't already liked the post
						//Append to the array of likes
						post.likes.unshift({ user: req.user.id });
						post.save().then(post => res.json(post));
					}
				})
				.catch(err => res.status(404).json({ postnotfound: "No post found" }));
		});
	}
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to a post
// @access  Private
router.post(
	"/comment/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);
		//check validation
		if (!isValid) {
			return res.status(400).json(errors);
		}
		Post.findById(req.params.id)
			.then(post => {
				const newComment = {
					text: req.body.text,
					name: req.body.name,
					avatar: req.body.avatar,
					user: req.user.id
				};
				//Add to comments array
				post.comments.unshift(newComment);
				post.save().then(post => res.json(post));
			})
			.catch(err => res.status(404).json({ postnotfound: "No post found" }));
	}
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from a post
// @access  Private
router.delete(
	"/comment/:id/:comment_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Post.findById(req.params.id)
			.then(post => {
				//Check if comment exists
				if (
					post.comments.filter(
						comment => comment._id.toString() === req.params.comment_id
					).length === 0
				) {
					return res
						.status(404)
						.json({ commentnotexists: "Comment does not exist" });
					//Get remove index
					const removeIndex = post.comments
						.map(comment => comment._id.toString())
						.indexOf(req.params.comment_id);
					//Splice comment out of the array
					post.comments.splice(removeIndex, 1);
					post.save().then(post => res.json(post));
				}
			})
			.catch(err => res.status(404).json({ postnotfound: "No post found" }));
	}
);

module.exports = router;
