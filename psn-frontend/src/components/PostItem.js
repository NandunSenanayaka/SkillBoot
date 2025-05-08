import React, { useState } from "react";

import { Hashicon } from "@emeraldpay/hashicon-react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import {
  RiHeartFill,
  RiHeartLine,
  RiMessage2Fill,
  RiShareForwardFill,
  RiSendPlane2Fill,
  RiEdit2Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import { Button, Form, Modal } from "react-bootstrap";

import styles from "./styles/PostItem.module.css";
import { useDispatch } from "react-redux";
import {
  addLove,
  addShare,
  addComment,
  getFollowingPosts,
  updatePost,
  deletePost,
} from "../feature/followingPost/followingPostSlice";

function PostItem(props) {
  const dispatch = useDispatch();

  const [loveStatus, setLoveStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [sendButtonDisable, setSendButtonDisable] = useState(true);
  const [currentUserId] = useState(localStorage.getItem("psnUserId"));
  const [postId] = useState(props.postId);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(props.content);
  const [editImage, setEditImage] = useState(props.image);
  const [file64String, setFile64String] = useState(null);
  const [file64StringWithType, setFile64StringWithType] = useState(null);

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  function handleLoveClick() {
    if (!props.loveList.includes(currentUserId)) {
      setLoveStatus(true);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    } else {
      setLoveStatus(false);
      dispatch(addLove({ postId: postId, userId: currentUserId }));
    }
  }

  function handleShareClick() {
    dispatch(addShare({ postId: postId, userId: currentUserId }));
    dispatch(getFollowingPosts());
  }

  function handleCommentButtonClick() {
    setCommentStatus(!commentStatus);
  }

  function handleCommentContentChange(e) {
    setCommentContent(e.target.value);
    setSendButtonDisable(e.target.value.length === 0 || e.target.value.length > 100);
  }

  function sendComment() {
    dispatch(
      addComment({
        postId: postId,
        newComment: {
          userId: localStorage.getItem("psnUserId"),
          userFullname:
            localStorage.getItem("psnUserFirstName") +
            " " +
            localStorage.getItem("psnUserLastName"),
          content: commentContent,
        },
      })
    );
    setCommentContent("");
  }

  function handleEditClick() {
    setShowEditModal(true);
  }

  function handleDeleteClick() {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(postId));
    }
  }

  function handleEditContentChange(e) {
    setEditContent(e.target.value);
  }

  function handleEditImageChange(e) {
    if (e.target.files < 1 || !e.target.validity.valid) {
      return;
    }
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setFile64StringWithType(reader.result);
      setFile64String(String(reader.result.split(",")[1]));
    };
  }

  function handleSaveEdit() {
    dispatch(updatePost({
      id: postId,
      content: editContent,
      image: file64StringWithType || editImage
    }));
    setShowEditModal(false);
  }

  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <div className={styles.userAvatar}>
          <Hashicon value={props.userId} size={50} />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{props.firstName + " " + props.lastName}</div>
          <div className={styles.postTime}>{timeAgo.format(new Date(props.postDate).getTime())}</div>
        </div>
        {props.userId === currentUserId && (
          <div>
            <Button variant="link" className={styles.editButton} onClick={handleEditClick}>
              <RiEdit2Line />
            </Button>
            <Button variant="link" className={styles.deleteButton} onClick={handleDeleteClick}>
              <RiDeleteBinLine />
            </Button>
          </div>
        )}
      </div>

      <div className={styles.postContent}>
        <p>{props.content}</p>
        {props.image && (
          <img 
            src={props.image} 
            alt="" 
            className={styles.postImage}
          />
        )}
      </div>

      <div className={styles.actionButtons}>
        <div className={styles.actionButton} onClick={handleLoveClick}>
          {loveStatus ? (
            <RiHeartFill className="text-danger" />
          ) : (
            <RiHeartLine className="text-danger" />
          )}
          <span className={styles.actionCount}>
            {props.loveList.length > 0 ? props.loveList.length : null}
          </span>
        </div>

        <div className={styles.actionButton} onClick={handleCommentButtonClick}>
          <RiMessage2Fill className="text-primary" />
          <span className={styles.actionCount}>
            {props.commentList.length > 0 ? props.commentList.length : null}
          </span>
        </div>

        <div className={styles.actionButton} onClick={handleShareClick}>
          <RiShareForwardFill className="text-success" />
          <span className={styles.actionCount}>
            {props.shareList.length > 0 ? props.shareList.length : null}
          </span>
        </div>
      </div>

      {commentStatus && (
        <div className={styles.commentSection}>
          <div className={styles.commentInput}>
            <Form.Control
              type="text"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={handleCommentContentChange}
            />
            <span>{commentContent.length}/100</span>
            <Button
              variant="success"
              className={styles.sendButton}
              disabled={sendButtonDisable}
              onClick={sendComment}
            >
              <RiSendPlane2Fill />
            </Button>
          </div>

          <div className={styles.commentList}>
            {props.commentList.map((commentItem, index) => (
              <div key={index} className={styles.commentItem}>
                <div className={styles.commentUserAvatar}>
                  <Hashicon value={commentItem.userId} size={30} />
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.commentUserName}>{commentItem.userFullname}</div>
                  <div className={styles.commentText}>{commentItem.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={editContent}
                onChange={handleEditContentChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image (Optional)</Form.Label>
              <Form.Control
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleEditImageChange}
              />
            </Form.Group>
            {file64StringWithType && (
              <img src={file64StringWithType} alt="preview" className={styles.postImage} />
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostItem;
