import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import PostCreator from '../components/PostCreator';
import PostItem from '../components/PostItem';
import type { PostResponseDto, CreatePostDto } from '../types/post';
import { postService } from '../services/postService';

export default function Feed() {
    const [posts, setPosts] = useState<PostResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch Posts on Load
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await postService.getFeedPosts();
            setPosts(data);
        } catch (error) {
            console.error("Failed to load feed", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. Create Post
    const handleCreatePost = async (newPost: CreatePostDto) => {
        try {
            const createdPost = await postService.createPost(newPost);
            // Put the new post at the top of the feed immediately (Newest first)
            setPosts([createdPost, ...posts]);
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Error creating post. Please try again.");
        }
    };

    // 3. Toggle Like State
    const handleToggleLike = async (postId: string) => {
        try {
            
            setPosts(posts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        hasLiked: !post.hasLiked,
                        likesCount: post.hasLiked ? post.likesCount - 1 : post.likesCount + 1
                    };
                }
                return post;
            }));

            
            await postService.togglePostLike(postId);
        } catch (error) {
            console.error("Failed to toggle like", error);
           
        }
    };

    return (
        <div className="_layout _layout_main_wrapper">
            {/* Top Navigation */}
            <Navbar />
            
            <div className="_main_layout">
                <div className="container _custom_container">
                    <div className="_layout_inner_wrap pt-4">
                        <div className="row">
                            
                            {/* Left Sidebar (Explore / Events) */}
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                <LeftSidebar />
                            </div>
                            
                            {/* Middle Column (Dynamic Feed) */}
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                <div className="_layout_middle_wrap">
                                    <div className="_layout_middle_inner">
                                            {/* Stories Section (Static for now) */}
                                        <div className="_feed_inner_ppl_card _mar_b16">
                                            <div className="row">
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                                                    <div className="_feed_inner_profile_story _b_radious6 ">
                                                        <div className="_feed_inner_profile_story_image">
                                                            <img src="/assets/images/card_ppl1.png" alt="Story" className="_profile_story_img" />
                                                            <div className="_feed_inner_story_txt">
                                                                <p className="_feed_inner_story_para">Your Story</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                                                    <div className="_feed_inner_public_story _b_radious6">
                                                        <div className="_feed_inner_public_story_image">
                                                            <img src="/assets/images/card_ppl2.png" alt="Story" className="_public_story_img" />
                                                            <div className="_feed_inner_pulic_story_txt">
                                                                <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_mobile_none">
                                                    <div className="_feed_inner_public_story _b_radious6">
                                                        <div className="_feed_inner_public_story_image">
                                                            <img src="/assets/images/card_ppl3.png" alt="Story" className="_public_story_img" />
                                                            <div className="_feed_inner_pulic_story_txt">
                                                                <p className="_feed_inner_pulic_story_para">Dylan Field</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_none">
                                                    <div className="_feed_inner_public_story _b_radious6">
                                                        <div className="_feed_inner_public_story_image">
                                                            <img src="/assets/images/card_ppl4.png" alt="Story" className="_public_story_img" />
                                                            <div className="_feed_inner_pulic_story_txt">
                                                                <p className="_feed_inner_pulic_story_para">Steve Jobs</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Post Creator Box */}
                                        <PostCreator onPostCreated={handleCreatePost} />

                                        {/* Loading State or Post List */}
                                        {isLoading ? (
                                            <div className="text-center mt-5 text-muted">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                                <p className="mt-2">Loading your feed...</p>
                                            </div>
                                        ) : posts.length === 0 ? (
                                            <div className="text-center mt-5 text-muted">
                                                <h4>No posts yet!</h4>
                                                <p>Be the first to share something.</p>
                                            </div>
                                        ) : (
                                            posts.map(post => (
                                                <PostItem 
                                                    key={post.id} 
                                                    post={post} 
                                                    onLikeToggle={handleToggleLike} 
                                                />
                                            ))
                                        )}

                                    </div>
                                </div>
                            </div>
                            
                            {/* Right Sidebar (Suggested People / Friends) */}
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                <RightSidebar />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}