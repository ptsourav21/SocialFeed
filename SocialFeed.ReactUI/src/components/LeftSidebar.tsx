import React from 'react';

export default function LeftSidebar() {
    return (
        <div className="_layout_left_sidebar_wrap">
            <div className="_layout_left_sidebar_inner">
                
                {/* Explore Area */}
                <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
                    <ul className="_left_inner_area_explore_list">
                        <li className="_left_inner_area_explore_item _explore_item">
                            <a href="#0" className="_left_inner_area_explore_link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                                    <path fill="#666" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 1.395a8.605 8.605 0 100 17.21 8.605 8.605 0 000-17.21z" />
                                </svg>
                                Learning
                            </a> 
                            <span className="_left_inner_area_explore_link_txt">New</span>
                        </li>
                        <li className="_left_inner_area_explore_item">
                            <a href="#0" className="_left_inner_area_explore_link">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                                    <path fill="#666" d="M14.96 2c3.101 0 5.159 2.417 5.159 5.893v8.214c0 3.476-2.058 5.893-5.16 5.893H6.989c-3.101 0-5.159-2.417-5.159-5.893V7.893C1.83 4.42 3.892 2 6.988 2h7.972z" />
                                </svg>
                                Insights
                            </a>
                        </li>
                    </ul>
                </div>
                
                {/* Suggested People Area */}
                <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area mt-3">
                    <div className="_left_inner_area_suggest_content _mar_b24">
                        <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
                        <span className="_left_inner_area_suggest_content_txt">
                            <a className="_left_inner_area_suggest_content_txt_link" href="#0">See All</a>
                        </span>
                    </div>
                    <div className="_left_inner_area_suggest_info">
                        <div className="_left_inner_area_suggest_info_box">
                            <div className="_left_inner_area_suggest_info_image">
                                <img src="assets/images/people1.png" alt="Image" className="_info_img" />
                            </div>
                            <div className="_left_inner_area_suggest_info_txt">
                                <h4 className="_left_inner_area_suggest_info_title">Steve Jobs</h4>
                                <p className="_left_inner_area_suggest_info_para">CEO of Apple</p>
                            </div>
                        </div>
                        <div className="_left_inner_area_suggest_info_link"> 
                            <a href="#0" className="_info_link">Connect</a>
                        </div>
                    </div>
                </div>

                {/* Events Area */}
                <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area mt-3">
                    <div className="_left_inner_event_content">
                        <h4 className="_left_inner_event_title _title5">Events</h4>
                        <a href="#0" className="_left_inner_event_link">See all</a>
                    </div>
                    <a className="_left_inner_event_card_link" href="#0">
                        <div className="_left_inner_event_card">
                            <div className="_left_inner_event_card_iamge">
                                <img src="assets/images/feed_event1.png" alt="Image" className="_card_img" />
                            </div>
                            <div className="_left_inner_event_card_content">
                                <div className="_left_inner_card_date">
                                    <p className="_left_inner_card_date_para">10</p>
                                    <p className="_left_inner_card_date_para1">Jul</p>
                                </div>
                                <div className="_left_inner_card_txt">
                                    <h4 className="_left_inner_event_card_title">Tech Meetup 2024</h4>
                                </div>
                            </div>
                            <hr className="_underline" />
                            <div className="_left_inner_event_bottom">
                                <p className="_left_iner_event_bottom">17 People Going</p> 
                                <a href="#0" className="_left_iner_event_bottom_link">Going</a>
                            </div>
                        </div>
                    </a>
                </div>

            </div>
        </div>
    );
}