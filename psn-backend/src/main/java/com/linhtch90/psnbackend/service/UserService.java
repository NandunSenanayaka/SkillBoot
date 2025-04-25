package com.linhtch90.psnbackend.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.linhtch90.psnbackend.entity.DoubleIdObjectEntity;
import com.linhtch90.psnbackend.entity.IdObjectEntity;
import com.linhtch90.psnbackend.entity.UserEntity;
import com.linhtch90.psnbackend.repository.UserRepository;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder bCryptEncoder;

    public ResponseObjectService findAll() {
        ResponseObjectService responseObj = new ResponseObjectService();
        responseObj.setPayload(userRepo.findAll());
        responseObj.setStatus("success");
        responseObj.setMessage("success");
        return responseObj;
    }

    public ResponseObjectService findById(String id) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<UserEntity> optUser = userRepo.findById(id);
        if (optUser.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("user id: " + id + " not existed");
            responseObj.setPayload(null);
            return responseObj;
        } else {
            responseObj.setPayload(optUser.get());
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            return responseObj;
        }
    }

    public ResponseObjectService findFollowing(String id) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<UserEntity> optUser = userRepo.findById(id);
        if (optUser.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("user id: " + id + " not existed");
            responseObj.setPayload(null);
            return responseObj;
        } else {
            List<String> followingIds = optUser.get().getFollowing();
            List<UserEntity> followingAccounts = new ArrayList<>();
            if (followingIds.size() > 0) {
                for (String followingId : followingIds) {
                    Optional<UserEntity> optFollowingUser = userRepo.findById(followingId);
                    if (optFollowingUser.isPresent()) {
                        UserEntity followingUser = optFollowingUser.get();
                        followingUser.setPassword("");
                        followingAccounts.add(followingUser);
                    } 
                }
                responseObj.setStatus("success");
                responseObj.setMessage("success");
                responseObj.setPayload(followingAccounts);
                return responseObj;
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("User id " + id + " does not follow anyone");
                responseObj.setPayload(null);
                return responseObj;
            }
        }
    }
    public ResponseObjectService findFollower(String id) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<UserEntity> optUser = userRepo.findById(id);
        if (optUser.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("user id: " + id + " not existed");
            responseObj.setPayload(null);
            return responseObj;
        } else {
            List<String> followerIds = optUser.get().getFollower();
            List<UserEntity> followerAccounts = new ArrayList<>();
            if (followerIds.size() > 0) {
                for (String followerId : followerIds) {
                    Optional<UserEntity> optFollowerUser = userRepo.findById(followerId);
                    if (optFollowerUser.isPresent()) {
                        UserEntity followerUser = optFollowerUser.get();
                        followerUser.setPassword("");
                        followerAccounts.add(followerUser);
                    } 
                }
                responseObj.setStatus("success");
                responseObj.setMessage("success");
                responseObj.setPayload(followerAccounts);
                return responseObj;
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("User id " + id + " does not have any follower");
                responseObj.setPayload(null);
                return responseObj;
            }
        }
    }

    public ResponseObjectService saveUser(UserEntity inputUser) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<UserEntity> optUser = userRepo.findByEmail(inputUser.getEmail());
        if (optUser.isPresent()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("Email address " + inputUser.getEmail() + " existed");
            responseObj.setPayload(null);
            return responseObj;
        } else {
            inputUser.setPassword(bCryptEncoder.encode(inputUser.getPassword()));
            
            // user follows himself so he could get his posts in newsfeed as well
            UserEntity user = userRepo.save(inputUser);
            List<String> listFollowing = user.getFollowing();
            if (listFollowing == null) {
                listFollowing = new ArrayList<>();
            }
            listFollowing.add(user.getId());
            user.setFollowing(listFollowing);
            this.updateWithoutPassword(user);
            responseObj.setPayload(user);
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            return responseObj;
        }
    }
    public boolean updateWithoutPassword(UserEntity inputUser) {
        Optional<UserEntity> optUser = userRepo.findById(inputUser.getId());
        if (optUser.isEmpty()) {
            return false;
        } else {
            UserEntity currentUser = optUser.get();
            if (inputUser.getPassword().equals(currentUser.getPassword())) {
                userRepo.save(inputUser);
                return true;
            } else {
                return false;
            }
        }
    }
    public ResponseObjectService update(UserEntity inputUser) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<UserEntity> optUser = userRepo.findById(inputUser.getId());
        if (optUser.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("user id: " + inputUser.getId() + " not existed");
            responseObj.setPayload(null);
            return responseObj;
        } else {
            UserEntity currentUser = optUser.get();
            if (bCryptEncoder.matches(inputUser.getPassword(), currentUser.getPassword())) {
                inputUser.setPassword(bCryptEncoder.encode(inputUser.getPassword()));
                responseObj.setPayload(userRepo.save(inputUser));
                responseObj.setStatus("success");
                responseObj.setMessage("success");
                return responseObj;
            } else {
                responseObj.setStatus("fail");
                responseObj.setMessage("current password is not correct");
                responseObj.setPayload(null);
                return responseObj;
            }
        }
    }

