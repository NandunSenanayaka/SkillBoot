package com.linhtch90.psnbackend.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.linhtch90.psnbackend.entity.CommentEntity;
import com.linhtch90.psnbackend.entity.IdObjectEntity;
import com.linhtch90.psnbackend.entity.PostEntity;
import com.linhtch90.psnbackend.repository.CommentRepository;
import com.linhtch90.psnbackend.repository.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private PostRepository postRepo;

    @Autowired
    private PostService postService;

    public ResponseObjectService insertComment(CommentEntity inputComment, String inputPostId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optPost = postRepo.findById(inputPostId);
        if (optPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("cannot find target post id: " + inputPostId);
            responseObj.setPayload(null);
            return responseObj;
        } else {
            inputComment.setCreatedAt(Instant.now());
            commentRepo.save(inputComment);
            PostEntity targetPost = optPost.get();
            List<CommentEntity> commentList = targetPost.getComment();
            if (commentList == null) {
                commentList = new ArrayList<>();
            }
            commentList.add(inputComment);
            targetPost.setComment(commentList);
            postService.updatePostByComment(targetPost);
            responseObj.setStatus("success");
            responseObj.setMessage("success");
            responseObj.setPayload(inputComment);
            return responseObj;
        }
    }

    public ResponseObjectService getComments(String inputPostId) {
        ResponseObjectService responseObj = new ResponseObjectService();
        Optional<PostEntity> optTargetPost = postRepo.findById(inputPostId);
        if (optTargetPost.isEmpty()) {
            responseObj.setStatus("fail");
            responseObj.setMessage("fail");
            responseObj.setPayload(null);
            return responseObj;
        } else {
            PostEntity targetPost = optTargetPost.get();
            List<CommentEntity> commentList = targetPost.getComment();
            if (commentList.size() > 0) {
                responseObj.setStatus("success");
                responseObj.setMessage("success");
                responseObj.setPayload(commentList);
                return responseObj;
            } else {
                responseObj.setStatus("success");
                responseObj.setMessage("Post id " + inputPostId + " does not have any comment");
                responseObj.setPayload(null);
                return responseObj;
            }
        }
    }

    public ResponseObjectService updateComment(CommentEntity updatedComment) {
        ResponseObjectService response = new ResponseObjectService();
        Optional<CommentEntity> optComment = commentRepo.findById(updatedComment.getId());
        if (optComment.isEmpty()) {
            response.setStatus("fail");
            response.setMessage("Comment not found");
            response.setPayload(null);
            return response;
        }
        CommentEntity comment = optComment.get();
        comment.setContent(updatedComment.getContent());
        commentRepo.save(comment);
        response.setStatus("success");
        response.setMessage("Comment updated");
        response.setPayload(comment);
        return response;
    }

    public ResponseObjectService deleteComment(String commentId, String postId) {
        ResponseObjectService response = new ResponseObjectService();
        Optional<CommentEntity> optComment = commentRepo.findById(commentId);
        Optional<PostEntity> optPost = postRepo.findById(postId);
        if (optComment.isEmpty() || optPost.isEmpty()) {
            response.setStatus("fail");
            response.setMessage("Comment or Post not found");
            response.setPayload(null);
            return response;
        }
        commentRepo.deleteById(commentId);
        PostEntity post = optPost.get();
        List<CommentEntity> comments = post.getComment();
        comments.removeIf(c -> c.getId().equals(commentId));
        post.setComment(comments);
        postService.updatePostByComment(post);
        response.setStatus("success");
        response.setMessage("Comment deleted successfully");
        response.setPayload(null);
        return response;
    }

}
