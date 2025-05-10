package com.linhtch90.psnbackend.entity;

public class CommentPostRequestEntity {
    private CommentEntity commentEntity;
    private IdObjectEntity postId;

    public CommentPostRequestEntity() {
    }

    public CommentPostRequestEntity(CommentEntity commentEntity, IdObjectEntity postId) {
        this.commentEntity = commentEntity;
        this.postId = postId;
    }

    public CommentEntity getCommentEntity() {
        return commentEntity;
    }

    public void setCommentEntity(CommentEntity commentEntity) {
        this.commentEntity = commentEntity;
    }

    public IdObjectEntity getPostId() {
        return postId;
    }

    public void setPostId(IdObjectEntity postId) {
        this.postId = postId;
    }
}
