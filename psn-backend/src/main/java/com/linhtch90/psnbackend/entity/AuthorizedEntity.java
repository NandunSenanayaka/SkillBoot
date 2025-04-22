package com.linhtch90.psnbackend.entity;

public class AuthorizedEntity {
    private UserEntity user;
    private String token;

    public AuthorizedEntity() {
    }

    public AuthorizedEntity(UserEntity user, String token) {
        this.user = user;
        this.token = token;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
