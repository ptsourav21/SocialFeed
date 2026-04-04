import React, { useState } from 'react';
import type { CommentResponseDto } from '../types/post';
import { commentService } from '../services/commentService';

interface Props {
    comment: CommentResponseDto;
    postId: string;
    isReply?: boolean; // New prop to track if this IS a reply
}

export default function CommentItem({ comment, postId, isReply = false }: Props) {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [localReplies, setLocalReplies] = useState<CommentResponseDto[]>(comment.replies || []);
    const [likes, setLikes] = useState(comment.likesCount || 0);
    const [hasLiked, setHasLiked] = useState(comment.hasLiked || false);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        try {
            const newReply = await commentService.addComment(postId, replyText, comment.id);
            // This 'newReply' MUST contain authorName from the server!
            setLocalReplies([...localReplies, newReply]);
            setReplyText('');
            setShowReplyBox(false);
        } catch (error) {
            console.error("Reply failed", error);
        }
    };

    return (
        <div className={`mb-2 ${isReply ? 'ms-4 ps-2 border-start mt-1' : ''}`}>
            <div className="d-flex align-items-start">
                <img src="/assets/images/comment_img.png" className="rounded-circle me-2" style={{width: '30px', height: '30px'}} alt="user" />
                <div className="bg-white p-2 rounded shadow-sm w-100 border">
                    {/* If this is empty, your API didn't return the name! */}
                    <h6 className="mb-0 fw-bold" style={{fontSize: '12px'}}>{comment.authorName || "Loading..."}</h6>
                    <p className="mb-1" style={{fontSize: '13px', color: '#333'}}>{comment.content}</p>
                    
                    <div className="d-flex gap-3 mt-1" style={{fontSize: '11px'}}>
                        <button className="border-0 bg-transparent p-0 fw-bold" style={{color: hasLiked ? '#1890FF' : '#666'}}>
                            Like ({likes})
                        </button>

                        {/* FIXED: Only show "Reply" if this is NOT already a reply */}
                        {!isReply && (
                            <button onClick={() => setShowReplyBox(!showReplyBox)} className="border-0 bg-transparent p-0 text-muted fw-bold">
                                Reply
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showReplyBox && (
                <div className="ms-4 mt-2">
                    <form onSubmit={handleReplySubmit} className="d-flex gap-2">
                        <input 
                            className="form-control form-control-sm" 
                            placeholder="Write a reply..." 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Post</button>
                    </form>
                </div>
            )}

            {/* Render Replies (Pass isReply={true} to hide their reply buttons) */}
            {localReplies.map(reply => (
                <CommentItem key={reply.id} comment={reply} postId={postId} isReply={true} />
            ))}
        </div>
    );
}