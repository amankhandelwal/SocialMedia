import axios from "axios";
import {
	ADD_POST,
	GET_ERRORS,
	POST_LOADING,
	GET_POSTS,
	DELETE_POST,
	GET_POST,
	CLEAR_ERRORS
} from "./types";

//Add Post
export const addPost = postData => dispatch => {
	dispatch(clearErrors());
	axios
		.post("/api/posts", postData)
		.then(res => dispatch({ type: ADD_POST, payload: res.data }))
		.catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//Get Posts
export const getPosts = () => dispatch => {
	dispatch(setPostLoading);
	axios
		.get("/api/posts")
		.then(res => dispatch({ type: GET_POSTS, payload: res.data }))
		.catch(err => dispatch({ type: GET_POSTS, payload: null }));
};

//Get Post by id
export const getPost = id => dispatch => {
	dispatch(setPostLoading);
	axios
		.get(`/api/posts/${id}`)
		.then(res => dispatch({ type: GET_POST, payload: res.data }))
		.catch(err => dispatch({ type: GET_POST, payload: null }));
};

//Delete Post
export const deletePost = id => dispatch => {
	axios
		.delete(`/api/posts/${id}`)
		.then(res => dispatch({ type: DELETE_POST, payload: id }))
		.catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//Toggle Like
export const toggleLike = id => dispatch => {
	axios
		.post(`/api/posts/like/${id}`)
		.then(res => dispatch(getPosts()))
		.catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//Add comment
export const addComment = (postId, commentData) => dispatch => {
	dispatch(clearErrors());
	axios
		.post(`/api/posts/comment/${postId}`, commentData)
		.then(res => dispatch({ type: GET_POST, payload: res.data }))
		.catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//delete comment
export const deleteComment = (postId, commentId) => dispatch => {
	axios
		.delete(`/api/posts/comment/${postId}/${commentId}`)
		.then(res => dispatch({ type: GET_POST, payload: res.data }))
		.catch(err => dispatch({ type: GET_ERRORS, payload: err.response.data }));
};

//set loading state
export const setPostLoading = () => ({ type: POST_LOADING });

//clear errors
export const clearErrors = () => ({ type: CLEAR_ERRORS });
