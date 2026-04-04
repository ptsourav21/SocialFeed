import React, { useState } from 'react';
import type { PostResponseDto, CommentResponseDto } from '../types/post';
import { commentService } from '../services/commentService'; // <-- NEW SERVICE IMPORTED!
import CommentItem from './CommentItem';

interface PostItemProps {
    post: PostResponseDto;
    onLikeToggle: (postId: string) => void;
}

export default function PostItem({ post, onLikeToggle }: PostItemProps) {
    const [showComments, setShowComments] = useState(false);

    // Local state for comments and the input box
    const [localComments, setLocalComments] = useState<CommentResponseDto[]>(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle Submitting a Comment
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            // Call the dedicated comment service!
            const newComment = await commentService.addComment(post.id, commentText);

            // Instantly add the new comment to the bottom of the list
            setLocalComments([...localComments, newComment]);
            setCommentText(''); // Clear the box
        } catch (error) {
            console.error("Failed to post comment", error);
            alert("Could not post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16 bg-white">
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
                                {new Date(post.createdAt).toLocaleDateString()} .
                                <span className="ms-1 text-muted">{post.isPublic ? 'Public' : 'Private'}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Post Content --- */}
                <h4 className="_feed_inner_timeline_post_title pb-3" style={{ fontWeight: 'normal' }}>
                    {post.content}
                </h4>

                {post.imageUrl && (
                    <div className="_feed_inner_timeline_image">
                        <img src={post.imageUrl} alt="Attachment" className="_time_img img-fluid rounded" />
                    </div>
                )}
            </div>

            {/* --- Reactions Bar --- */}
            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26 mt-3">
                <div className="_feed_inner_timeline_total_reacts_image">
                    <img src="/assets/images/react_img1.png" alt="React" className="_react_img1" />
                    <p className="_feed_inner_timeline_total_reacts_para">{post.likesCount}</p>
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <button onClick={() => setShowComments(!showComments)} style={{ background: 'none', border: 'none', color: '#666', padding: 0 }}>
                            <span className="fw-bold">{localComments.length}</span> Comments
                        </button>
                    </p>
                </div>
            </div>

            {/* --- Action Buttons --- */}
            <div className="_feed_inner_timeline_reaction">
                <button
                    onClick={() => onLikeToggle(post.id)}
                    className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${post.hasLiked ? '_feed_reaction_active' : ''}`}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span className="fw-bold" style={{ color: post.hasLiked ? '#1890FF' : '#666' }}>👍 Like</span>
                    </span>
                </button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="_feed_inner_timeline_reaction_comment _feed_reaction"
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span className="fw-bold" style={{ color: '#666' }}>💬 Comment</span>
                    </span>
                </button>
            </div>

            {/* --- THE COMMENT SECTION --- */}
            {showComments && (
                <div className="_feed_inner_timeline_cooment_area p-3 bg-light rounded mt-2 mx-3">

                    {/* 1. Display Existing Comments */}
                    <div className="mb-3">
                        {localComments.length === 0 ? (
                            <p className="text-muted text-center py-2" style={{ fontSize: '13px' }}>No comments yet. Be the first!</p>
                        ) : (
                            localComments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    postId={post.id}
                                />
                            ))
                        )}
                    </div>

                    {/* 2. The Comment Input Box */}
                    <div className="_feed_inner_comment_box mt-3 border-top pt-3">
                        <form className="_feed_inner_comment_box_form" onSubmit={handleCommentSubmit}>
                            <div className="_feed_inner_comment_box_content">
                                <div className="_feed_inner_comment_box_content_image">
                                    <img src="/assets/images/profile.png" alt="Me" className="_comment_img" />
                                </div>
                                <div className="_feed_inner_comment_box_content_txt w-100">
                                    <textarea
                                        className="form-control _comment_textarea"
                                        placeholder="Write a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        style={{ resize: 'none', height: '40px' }}
                                        disabled={isSubmitting}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="_feed_inner_comment_box_icon text-end mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-sm btn-primary px-4 fw-bold"
                                    disabled={isSubmitting || !commentText.trim()}
                                >
                                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            )}
        </div>
    );
}