import React, { useState } from 'react';
import type { CommentResponseDto } from '../types/post';
import { commentService } from '../services/commentService';

interface Props {
    comment: CommentResponseDto;
    postId: string;
}

export default function CommentItem({ comment, postId }: Props) {
    const [likes, setLikes] = useState(comment.likesCount);
    const [hasLiked, setHasLiked] = useState(comment.hasLiked);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replies, setReplies] = useState<CommentResponseDto[]>(comment.replies || []);

    const handleLike = async () => {
        setHasLiked(!hasLiked);
        setLikes(hasLiked ? likes - 1 : likes + 1);
        await commentService.toggleCommentLike(comment.id);
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newReply = await commentService.addComment(postId, replyText, comment.id);
        setReplies([...replies, newReply]);
        setReplyText('');
        setShowReplyBox(false);
    };

    return (
        <div className="ms-3 mb-3 border-start ps-3">
            <div className="d-flex align-items-start">
                <img src="/assets/images/comment_img.png" className="rounded-circle me-2" style={{width: '30px'}} alt="user" />
                <div className="bg-white p-2 rounded shadow-sm w-100">
                    <h6 className="mb-0 fw-bold" style={{fontSize: '12px'}}>{comment.authorName}</h6>
                    <p className="mb-1" style={{fontSize: '13px'}}>{comment.content}</p>
                    
                    <div className="d-flex gap-3 mt-1" style={{fontSize: '11px'}}>
                        <button onClick={handleLike} className="border-0 bg-transparent p-0" style={{color: hasLiked ? '#1890FF' : '#666'}}>
                            {hasLiked ? 'Liked' : 'Like'} ({likes})
                        </button>
                        <button onClick={() => setShowReplyBox(!showReplyBox)} className="border-0 bg-transparent p-0 text-muted">
                            Reply
                        </button>
                    </div>
                </div>
            </div>

            {/* Reply Input Box */}
            {showReplyBox && (
                <form onSubmit={handleReplySubmit} className="mt-2 d-flex gap-2">
                    <input 
                        className="form-control form-control-sm" 
                        placeholder="Write a reply..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-sm">Post</button>
                </form>
            )}

            {/* Render Nested Replies */}
            {replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} postId={postId} />
            ))}
        </div>
    );
}