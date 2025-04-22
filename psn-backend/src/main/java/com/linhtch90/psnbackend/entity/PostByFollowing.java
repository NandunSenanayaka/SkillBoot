package com.linhtch90.psnbackend.entity;

public class PostByFollowing {
    private UserEntity user;
    private PostEntity post;

    public PostByFollowing() {
    }

    public PostByFollowing(UserEntity user, PostEntity post) {
        this.user = user;
        this.post = post;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public PostEntity getPost() {
        return post;
    }

    public void setPost(PostEntity post) {
        this.post = post;
    }
}
