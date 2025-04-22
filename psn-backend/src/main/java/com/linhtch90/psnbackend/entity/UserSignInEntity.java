package com.linhtch90.psnbackend.entity;

public class UserSignInEntity {
    private String email;
    private String password;

    public UserSignInEntity() {
    }

    public UserSignInEntity(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
