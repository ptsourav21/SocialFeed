import { commentService } from "../services/commentService";
import type { CommentResponseDto } from "../types/post";
import LikePopup from "./LikePopup";
import React, { useState } from 'react';
interface CommentItemProps {
    comment: CommentResponseDto;
    postId: string;
    isReply?: boolean;
}
export default function CommentItem({ comment, postId, isReply = false }: CommentItemProps) {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [hoverCommentLikes, setHoverCommentLikes] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [localReplies, setLocalReplies] = useState<CommentResponseDto[]>(comment.replies || []);
    const [likes, setLikes] = useState(comment.likesCount || 0);
    const [hasLiked, setHasLiked] = useState(comment.hasLiked || false);

    const visibleReplies = showAllReplies ? localReplies : localReplies.slice(0, 1);

    const handleLike = async () => {
        setHasLiked(!hasLiked);
        setLikes(hasLiked ? likes - 1 : likes + 1);
        await commentService.toggleCommentLike(comment.id);
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            const newReply = await commentService.addComment(postId, replyText, comment.id);
            setLocalReplies([...localReplies, newReply]);
            setReplyText('');
            setShowReplyBox(false);
        } catch (error) { console.error(error); }
    };

    return (
        <div className={`mb-3 ${isReply ? 'ms-4 ps-2 border-start' : ''}`}>
            <div className="d-flex align-items-start">
                <img src="/assets/images/comment_img.png" className="rounded-circle me-2" style={{width: '32px', height: '32px'}} alt="user" />
                <div className="bg-white p-2 rounded shadow-sm w-100 border position-relative">
                    <h6 className="mb-0 fw-bold" style={{fontSize: '12px'}}>{comment.authorName}</h6>
                    <p className="mb-1" style={{fontSize: '13px', color: '#333'}}>{comment.content}</p>
                    
                    <div className="d-flex gap-3 mt-1" style={{fontSize: '11px'}}>
                        <div 
                            className="position-relative"
                            onMouseEnter={() => setHoverCommentLikes(true)}
                            onMouseLeave={() => setHoverCommentLikes(false)}
                        >
                            <button onClick={handleLike} className="border-0 bg-transparent p-0 fw-bold" style={{color: hasLiked ? '#1890FF' : '#666'}}>
                                Like {likes > 0 && `(${likes})`}
                            </button>
                            {hoverCommentLikes && <LikePopup id={comment.id} type="comment" fetchLikers={commentService.getCommentLikers} />}
                        </div>

                        {!isReply && (
                            <button onClick={() => setShowReplyBox(!showReplyBox)} className="border-0 bg-transparent p-0 text-muted fw-bold">
                                Reply
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies List */}
            <div className="mt-2">
                {visibleReplies.map(reply => (
                    <CommentItem key={reply.id} comment={reply} postId={postId} isReply={true} />
                ))}

                {!showAllReplies && localReplies.length > 1 && (
                    <button 
                        className="btn btn-link btn-sm text-decoration-none text-muted fw-bold p-0 ms-5" 
                        onClick={() => setShowAllReplies(true)}
                    >
                        Show more replies...
                    </button>
                )}
            </div>

            {showReplyBox && (
                <form onSubmit={handleReplySubmit} className="ms-5 mt-2 d-flex gap-2">
                    <input className="form-control form-control-sm" placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus />
                </form>
            )}
        </div>
    );
}