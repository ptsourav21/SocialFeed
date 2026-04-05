import React, { useState, useRef } from 'react';
import type { CreatePostDto } from '../types/post';

interface PostCreatorProps {
    onPostCreated: (post: CreatePostDto) => void;
}

export default function PostCreator({ onPostCreated }: PostCreatorProps) {
    const [content, setContent] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const IMGBB_API_KEY = '65d0d3f88513de5bb55a38068bd6637d';
    const handlePhotoButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() && !selectedImage) return;

        setIsUploading(true);
        let finalImageUrl = '';

        try {
            if (selectedImage) {
                const formData = new FormData();
                formData.append('image', selectedImage);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    finalImageUrl = data.data.url;
                } else {
                    alert('Image upload failed via ImgBB.');
                    setIsUploading(false);
                    return;
                }
            }
            onPostCreated({ 
                content: content, 
                isPublic: isPublic,
                imageUrl: finalImageUrl 
            });
            
            setContent('');
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong while posting.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16 bg-white">
            <div className="_feed_inner_text_area_box">
                <div className="_feed_inner_text_area_box_image">
                    <img src="/assets/images/txt_img.png" alt="Profile" className="_txt_img" />
                </div>
                <div className="form-floating _feed_inner_text_area_box_form">
                    <textarea 
                        className="form-control _textarea" 
                        placeholder="Leave a comment here" 
                        id="floatingTextarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={isUploading}
                    ></textarea>
                    <label className="_feed_textarea_label" htmlFor="floatingTextarea">
                        Write something ...
                    </label>
                </div>
            </div>

            {/* NEW: Image Preview Area */}
            {selectedImage && (
                <div className="alert alert-secondary mt-2 d-flex justify-content-between align-items-center">
                    <span>📷 {selectedImage.name}</span>
                    <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => setSelectedImage(null)}
                        disabled={isUploading}
                    >
                        Remove
                    </button>
                </div>
            )}
            
            <div className="_feed_inner_text_area_bottom">
                <div className="_feed_inner_text_area_item">
                    
                    {/* Hidden File Input */}
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        style={{ display: 'none' }} 
                    />

                    {/* Photo Button*/}
                    <div className="_feed_inner_text_area_bottom_photo _feed_common">
                        <button 
                            type="button" 
                            className="_feed_inner_text_area_bottom_photo_link" 
                            onClick={handlePhotoButtonClick}
                            disabled={isUploading}
                        > 
                            <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img"> 
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                    <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411z"/>
                                </svg>
                            </span>
                            Photo
                        </button>
                    </div>

                    <div className="_feed_inner_text_area_bottom_photo _feed_common ms-3">
                        <button onClick={() => setIsPublic(!isPublic)} type="button" className="_feed_inner_text_area_bottom_photo_link" style={{color: isPublic ? '#1890FF' : '#666'}}> 
                            🔒 {isPublic ? 'Public' : 'Private'}
                        </button>
                    </div>
                </div>
                
                <div className="_feed_inner_text_area_btn">
                    <button 
                        type="button" 
                        onClick={handleSubmit} 
                        className="_feed_inner_text_area_btn_link"
                        disabled={isUploading}
                    >
                        <span>{isUploading ? 'Uploading...' : 'Post'}</span> 
                    </button>
                </div>
            </div>
        </div>
    );
}