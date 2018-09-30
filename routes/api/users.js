const express = require("express");
const router = express.Router();
const User = require("./../../models/User");
const secret = require("../../config/keys").jwtsecret;
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
//Validators
const validateRegisterInput = require("../../validators/register");
const validateLoginInput = require("../../validators/login");

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) => res.send("users"));

// @route GET api/users/register
// @desc Register User
// @access Public
router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	//check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			errors.email = "Email already registered";
			return res.status(400).json(errors);
		} else {
			//get the GRAVATAR
			const avatar = gravatar.url(req.body.email, {
				s: "200", // size
				r: "pg", //rating
				d: "mm" //default image
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});
			//encrypt the password
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});

// @route GET api/users/login
// @desc login User and return JWT
// @access Public
router.post("/login", (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);
	//check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	User.findOne({ email })
		.then(user => {
			if (!user) {
				errors.email = "User Not Found";
				return res.status(404).json(errors);
			} else {
				const password = req.body.password;
				//compare the password with hash
				bcrypt
					.compare(password, user.password)
					.then(isMatch => {
						if (!isMatch) {
							errors.password = "password incorrect";
							return res.status(400).json(errors);
						} else {
							//if password matched
							const payload = {
								id: user.id,
								name: user.name,
								avatar: user.avatar
							};
							jwt.sign(payload, secret, { expiresIn: 7200 }, (err, token) => {
								if (err) throw err;
								res.json({
									success: true,
									token: "bearer " + token
								});
							});
						}
					})
					.catch(err => console.log(err));
			}
		})
		.catch(err => console.log(err));
});

// @route GET api/users/current
// @desc returns current user
// @access Private
router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	(req, res) => res.json(req.user)
);

module.exports = router;
