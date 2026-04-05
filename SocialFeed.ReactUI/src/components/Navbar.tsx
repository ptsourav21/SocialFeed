import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import the decoder

export default function Navbar() {
    const navigate = useNavigate();
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // State to hold the display name
    const [displayName, setDisplayName] = useState('My Account');

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                
                const firstName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"] || decoded.given_name;
                const lastName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"] || decoded.family_name;
                const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub;

                if (firstName && lastName) {
                    setDisplayName(`${firstName} ${lastName}`);
                } else if (userId) {
                    setDisplayName(`User: ${userId.substring(0, 8)}...`); 
                }
            } catch (error) {
                console.error("Token decoding failed:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
            <div className="container _custom_container">
                <div className="_logo_wrap">
                    <Link className="navbar-brand" to="/feed">
                        <img src="assets/images/logo.svg" alt="Logo" className="_nav_logo" />
                    </Link>
                </div>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="_header_form ms-auto">
                        <form className="_header_form_grp">
                            <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                                <circle cx="7" cy="7" r="6" stroke="#666" />
                                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                            </svg>
                            <input className="form-control me-2 _inpt1" type="search" placeholder="Search posts..." aria-label="Search" />
                        </form>
                    </div>
                    
                    <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
                        <li className="nav-item _header_nav_item">
                            <Link className="nav-link _header_nav_link_active _header_nav_link" to="/feed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                                    <path className="_home_active" stroke="#000" strokeWidth="1.5" strokeOpacity=".6" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                                </svg>
                            </Link>
                        </li>
                        
                        <li className="nav-item _header_nav_item">
                            <span onClick={() => setIsNotifyOpen(!isNotifyOpen)} className="nav-link _header_nav_link _header_notify_btn" style={{cursor: 'pointer'}}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                                    <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                                </svg>
                                <span className="_counting">2</span> 
                                
                                <div className={`_notification_dropdown ${isNotifyOpen ? 'show' : ''}`} style={{display: isNotifyOpen ? 'block' : 'none'}}>
                                    <div className="_notifications_content">
                                        <h4 className="_notifications_content_title">Notifications</h4>
                                    </div>
                                    <div className="_notifications_drop_box">
                                        <div className="_notification_box">
                                            <div className="_notification_image">
                                                <img src="assets/images/friend-req.png" alt="Notification" className="_notify_img" />
                                            </div>
                                            <div className="_notification_txt">
                                                <p className="_notification_para">
                                                    <span className="_notify_txt_link">Steve Jobs </span>posted a link.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </span>
                        </li>
                    </ul>
                    
                    <div className="_header_nav_profile">
                        <div className="_header_nav_profile_image">
                            <img src="assets/images/profile.png" alt="Profile" className="_nav_profile_img" />
                        </div>
                        <div className="_header_nav_dropdown">
                            <p className="_header_nav_para">{displayName}</p>
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="_header_nav_dropdown_btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                                    <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className={`_nav_profile_dropdown _profile_dropdown ${isProfileOpen ? 'show' : ''}`} style={{display: isProfileOpen ? 'block' : 'none'}}>
                            <ul className="_nav_dropdown_list">
                                <li className="_nav_dropdown_list_item">
                                    <button onClick={handleLogout} className="_nav_dropdown_link" style={{background: 'none', border: 'none', width: '100%', textAlign: 'left'}}>
                                        <div className="_nav_drop_info">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                                                    <path stroke="#377DFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.667 18H2.889A1.889 1.889 0 011 16.111V2.89A1.889 1.889 0 012.889 1h3.778M13.277 14.222L18 9.5l-4.723-4.722M18 9.5H6.667"/>
                                                </svg>           
                                            </span>
                                            Log Out      
                                        </div>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}