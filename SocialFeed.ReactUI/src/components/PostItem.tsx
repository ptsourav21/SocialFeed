import React, { useState } from 'react';
import type { PostResponseDto, CommentResponseDto } from '../types/post';
import { commentService } from '../services/commentService';
import { postService } from '../services/postService';
import CommentItem from './CommentItem';
import LikePopup from './LikePopup';

interface PostItemProps {
    post: PostResponseDto;
    onLikeToggle: (postId: string) => void;
}

export default function PostItem({ post, onLikeToggle }: PostItemProps) {
    const [showComments, setShowComments] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const [hoverPostLikes, setHoverPostLikes] = useState(false);

    // localComments stores the 'Root' comments (parents)
    const [localComments, setLocalComments] = useState<CommentResponseDto[]>(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Requirement: Show only the 1st (latest) root comment initially
    const visibleComments = showAllComments ? localComments : localComments.slice(0, 1);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        setIsSubmitting(true);
        try {
            const newComment = await commentService.addComment(post.id, commentText);
            setLocalComments([newComment, ...localComments]);
            setCommentText('');
            setShowComments(true);
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 bg-white shadow-sm">
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">

                {/* --- Post Header --- */}
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <img src="/assets/images/post_img.png" alt="Profile" className="_post_img" />
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">{post.authorName}</h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {new Date(post.createdAt).toLocaleDateString()} . {post.isPublic ? 'Public' : 'Private'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Content --- */}
                <h4 className="_feed_inner_timeline_post_title pb-3" style={{ fontWeight: 'normal' }}>
                    {post.content}
                </h4>

                {post.imageUrl && (
                    <div className="_feed_inner_timeline_image">
                        <img src={post.imageUrl} alt="Attachment" className="_time_img img-fluid rounded" />
                    </div>
                )}
            </div>

            {/* --- Reactions Bar (Total Likes & Total Comments) --- */}
            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26 mt-3 d-flex justify-content-between align-items-center">

                {/* LIKE SECTION WITH HOVER POPUP & FACEPILE */}
                <div
                    className="position-relative d-flex align-items-center"
                    onMouseEnter={() => setHoverPostLikes(true)}
                    onMouseLeave={() => setHoverPostLikes(false)}
                    style={{ cursor: 'pointer' }}
                >
                    {/* 1. THE FACEPILE (Pictures) */}
                    <div className="d-flex align-items-center me-2">
                        {/* Render up to 3 static images based on like count */}
                        {[...Array(Math.min(post.likesCount, 3))].map((_, i) => (
                            <img
                                key={i}
                                src={`/assets/images/react_img${i + 1}.png`}
                                alt="Liker"
                                className="rounded-circle border border-white"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    marginLeft: i === 0 ? '0' : '-10px', // Overlap effect
                                    zIndex: 10 - i,
                                    objectFit: 'cover'
                                }}
                            />
                        ))}

                        {/* 2. THE "+N" BUBBLE (Shown only if likes > 3) */}
                        {post.likesCount > 3 && (
                            <div
                                className="rounded-circle border border-white d-flex align-items-center justify-content-center bg-primary text-white fw-bold"
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    marginLeft: '-10px',
                                    fontSize: '10px',
                                    zIndex: 0
                                }}
                            >
                                +{post.likesCount - 3}
                            </div>
                        )}
                    </div>

                    {/* 3. TOTAL LIKES TEXT */}
                    <span className="fw-bold text-muted" style={{ fontSize: '13px' }}>
                        {post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}
                    </span>

                    {/* The Hover Popup */}
                    {hoverPostLikes && (
                        <div style={{ position: 'absolute', bottom: '100%', left: '0', zIndex: 1050, marginBottom: '5px' }}>
                            <LikePopup id={post.id} type="post" fetchLikers={postService.getPostLikers} />
                        </div>
                    )}
                </div>

                {/* TOTAL COMMENTS (Comments + Replies) */}
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="border-0 bg-transparent text-muted p-0"
                    style={{ fontSize: '13px' }}
                >
                    <span className="fw-bold">{post.commentsCount}</span> Comments
                </button>
            </div>
            {/* --- Action Buttons --- */}
            <div className="_feed_inner_timeline_reaction border-top border-bottom py-1">
                <button
                    onClick={() => onLikeToggle(post.id)}
                    className={`_feed_reaction border-0 bg-transparent py-2 w-50 ${post.hasLiked ? 'text-primary' : 'text-muted'}`}
                >
                    <span className="fw-bold">👍 Like</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="_feed_reaction border-0 bg-transparent py-2 w-50 text-muted"
                >
                    <span className="fw-bold">💬 Comment</span>
                </button>
            </div>

            {/* --- THE COMMENT SECTION --- */}
            {showComments && (
                <div className="px-4 py-3 bg-light">

                    {/* List of comments */}
                    <div className="comment-list">
                        {visibleComments.length === 0 ? (
                            <p className="text-muted text-center py-2" style={{ fontSize: '12px' }}>No comments yet.</p>
                        ) : (
                            visibleComments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    postId={post.id}
                                />
                            ))
                        )}
                    </div>

                    {/* Load More Button: Shown if there are more root comments or hidden replies */}
                    {!showAllComments && post.commentsCount > 1 && (
                        <button
                            className="btn btn-link btn-sm text-decoration-none text-muted fw-bold p-0 mt-2"
                            onClick={() => setShowAllComments(true)}
                            style={{ fontSize: '12px' }}
                        >
                            View more comments...
                        </button>
                    )}

                    {/* Comment Input */}
                    <form className="mt-3 d-flex gap-2" onSubmit={handleCommentSubmit}>
                        <img src="/assets/images/profile.png" alt="Me" className="rounded-circle" style={{ width: '32px', height: '32px' }} />
                        <div className="w-100">
                            <textarea
                                className="form-control form-control-sm"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                style={{ resize: 'none', height: '38px', borderRadius: '18px', paddingLeft: '15px' }}
                                disabled={isSubmitting}
                            />
                            {commentText.trim() && (
                                <div className="text-end mt-1">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm px-3"
                                        style={{ borderRadius: '15px', fontSize: '11px' }}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}