import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import imageCompression from "browser-image-compression";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Hashicon } from "@emeraldpay/hashicon-react";
import { useDispatch, useSelector } from "react-redux";
import {getFollowingPosts} from "../feature/followingPost/followingPostSlice";

function PostCompose({ user, onPostCreated }) {
    const dispatch = useDispatch();
    const storeFollowingPosts = useSelector((state) => state.followingPostReducer.followingPosts);

    const getUserFullname = () => {
        const firstName = localStorage.getItem("psnUserFirstName");
        const lastName = localStorage.getItem("psnUserLastName");
        if (firstName && firstName !== "null" && lastName && lastName !== "null") {
            return firstName + " " + lastName;
        } else if (firstName && firstName !== "null") {
            return firstName;
        } else if (lastName && lastName !== "null") {
            return lastName;
        } else {
            return "User";
        }
    };

    const [userFullname, setUserFullname] = useState(getUserFullname());
    const [userId, setUserId] = useState(localStorage.getItem("psnUserId"));
    const [postContent, setPostContent] = useState("");
    const [postContentCount, setPostContentCount] = useState(0);
    const [disablePostButton, setDisablePostButton] = useState(true);
    const [file, setFile] = useState(null);
    const [file64String, setFile64String] = useState(null);
    const [file64StringWithType, setFile64StringWithType] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    function showSuccessMessage(inputMessage) {
        toast.success(inputMessage, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    function showFailMessage(inputMessage) {
        toast.error(inputMessage, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }

    function handleContentChange(e) {
        setPostContent(e.target.value);
        setPostContentCount(e.target.value.length);
        if (postContentCount === 0 || postContentCount > 200) {
            setDisablePostButton(true);
        } else {
            setDisablePostButton(false);
        }
    }

    async function createPost(inputContent) {
        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/insertpost",
                headers: {
                    Authorization: localStorage.getItem("psnToken"),
                },
                data: {
                    id: null,
                    userId: localStorage.getItem("psnUserId"),
                    content: inputContent,
                    image: file64StringWithType,
                    createdAt: null,
                    love: null,
                    share: null,
                    comment: null,
                },
            });

            if (response.data !== null && response.data.status === "success") {
                showSuccessMessage("Posted successfully!");
                setPostContent("");
                setPostContentCount(0);
                setDisablePostButton(true);
                setFile64String(null);
                setFile64StringWithType(null);
                if (onPostCreated) {
                    onPostCreated();
                }
            }

            if (response.data !== null && response.data.status === "fail") {
                showFailMessage("Post failed. Please try again later!");
            }
        } catch (error) {
            showFailMessage("Post failed. Please try again later!");
        }
    }

    function onUploadFileChange(e) {
        setFile64String(null);
        if (e.target.files < 1 || !e.target.validity.valid) {
            return;
        }

        compressImageFile(e);
    }

    function fileToBase64(file, cb) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(null, reader.result);
        };
        reader.onerror = function (error) {
            cb(error, null);
        };
    }

    async function compressImageFile(event) {
        const imageFile = event.target.files[0];

        const options = {
            maxWidthOrHeight: 250,
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(imageFile, options);
            // input file is compressed in compressedFile, now write further logic here

            fileToBase64(compressedFile, (err, result) => {
                if (result) {
                    setFile(result);
                    //   console.log(file);
                    //   console.log(String(result.split(",")[1]));
                    setFile64StringWithType(result);
                    setFile64String(String(result.split(",")[1]));
                    setPreviewUrl(URL.createObjectURL(compressedFile));
                }
            });
        } catch (error) {
            setFile64String(null);
            // console.log(error);
        }
    }

    async function handleCreatePost(e) {
        e.preventDefault();
        createPost(postContent);
        dispatch(getFollowingPosts());
    }

    return (
        <div className="d-flex flex-column" style={{ 
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            marginBottom: '20px'
        }}>
            <ToastContainer />
            <Form className="d-flex flex-column">
                <Form.Group className="mb-3">
                    <Form.Label>
                        <div className="d-flex align-items-center mb-2">
                            <div className="me-3">
                                <Hashicon value={userId} size={48} />
                            </div>
                            <div className="fs-5 fw-bold">{userFullname}</div>
                        </div>
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        row={4}
                        placeholder="What is happening?"
                        value={postContent}
                        onChange={handleContentChange}
                        style={{ 
                            resize: "none", 
                            height: "7rem",
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            padding: '12px'
                        }}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label className="text-muted">Image (Optional)</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        onChange={onUploadFileChange}
                        style={{
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0'
                        }}
                    />
                </Form.Group>
                <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Characters: {postContentCount}/200</span>
                    <Button
                        onClick={handleCreatePost}
                        variant="success"
                        disabled={disablePostButton}
                        className="px-4"
                        style={{ 
                            borderRadius: '20px',
                            fontWeight: '500'
                        }}
                    >
                        Post
                    </Button>
                </div>
            </Form>
            {previewUrl && (
                <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="mt-3" 
                    style={{ 
                        maxWidth: "100%", 
                        maxHeight: "300px",
                        borderRadius: '8px',
                        objectFit: 'cover'
                    }} 
                />
            )}
        </div>
    );
}

export default PostCompose;
