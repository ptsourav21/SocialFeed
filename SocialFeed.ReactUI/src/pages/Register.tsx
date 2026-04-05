import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const ValidationItem = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`d-flex align-items-center mb-1 ${met ? 'text-success' : 'text-muted'}`} style={{ transition: 'all 0.3s' }}>
        <span className="me-2" style={{ fontSize: '12px' }}>{met ? '●' : '○'}</span>
        <span style={{ fontSize: '11px', textDecoration: met ? 'line-through' : 'none', opacity: met ? 0.7 : 1 }}>
            {label}
        </span>
    </div>
);

export default function Register() {
    const navigate = useNavigate();
    
    // Form States
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const emailValid = useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }, [email]);

    const passwordRules = useMemo(() => ({
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&]/.test(password),
    }), [password]);

    const isPasswordStrong = Object.values(passwordRules).every(Boolean);
    const passwordsMatch = password === repeatPassword && repeatPassword !== '';
    
    const isFormValid = firstName && lastName && emailValid && isPasswordStrong && passwordsMatch;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.register({ firstName, lastName, email, password });
            localStorage.setItem('jwt_token', response.token);
            navigate('/feed');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. System error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="_social_registration_wrapper _layout_main_wrapper">
            <div className="_shape_one">
                <img src="/assets/images/shape1.svg" alt="" className="_shape_img" />
            </div>
            
            <div className="_social_registration_wrap">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
                            <div className="_social_registration_right d-none d-lg-block">
                                <div className="_social_registration_right_image">
                                    <img src="/assets/images/registration.png" alt="Register" className="img-fluid" />
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                            <div className="_social_registration_content bg-white p-4 rounded shadow-sm">
                                <div className="_social_registration_right_logo _mar_b28">
                                    <img src="/assets/images/logo.svg" alt="Logo" className="_right_logo" />
                                </div>
                                <p className="_social_registration_content_para _mar_b8">Welcome aboard</p>
                                <h4 className="_social_registration_content_title _titl4 _mar_b30">Create Account</h4>
                                
                                <form className="_social_registration_form" onSubmit={handleRegister}>
                                    {error && <div className="alert alert-danger py-2" style={{fontSize: '13px'}}>{error}</div>}

                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <label className="_social_registration_label _mar_b8">First Name</label>
                                            <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" required />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <label className="_social_registration_label _mar_b8">Last Name</label>
                                            <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" required />
                                        </div>
                                        
                                        <div className="col-12 mb-3">
                                            <label className="_social_registration_label _mar_b8">Email Address</label>
                                            <input 
                                                type="email" 
                                                className={`form-control ${email && !emailValid ? 'is-invalid' : emailValid ? 'is-valid' : ''}`}
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                placeholder="name@company.com"
                                                required 
                                            />
                                            {email && !emailValid && <small className="text-danger" style={{fontSize: '10px'}}>Please enter a valid email.</small>}
                                        </div>

                                        <div className="col-12 mb-3">
                                            <label className="_social_registration_label _mar_b8">Password</label>
                                            <input 
                                                type="password" 
                                                className={`form-control ${password && !isPasswordStrong ? 'is-invalid' : isPasswordStrong ? 'is-valid' : ''}`}
                                                value={password} 
                                                onChange={(e) => setPassword(e.target.value)} 
                                                placeholder="••••••••"
                                                required 
                                            />
                                            
                                            {/* Real-time Checklist */}
                                            <div className="mt-2 p-2 rounded border bg-light">
                                                <ValidationItem label="8+ characters minimum" met={passwordRules.length} />
                                                <ValidationItem label="At least one uppercase (A-Z)" met={passwordRules.upper} />
                                                <ValidationItem label="At least one lowercase (a-z)" met={passwordRules.lower} />
                                                <ValidationItem label="At least one number (0-9)" met={passwordRules.number} />
                                                <ValidationItem label="At least one special (@$!%*?&)" met={passwordRules.special} />
                                            </div>
                                        </div>

                                        <div className="col-12 mb-4">
                                            <label className="_social_registration_label _mar_b8">Confirm Password</label>
                                            <input 
                                                type="password" 
                                                className={`form-control ${repeatPassword && !passwordsMatch ? 'is-invalid' : passwordsMatch ? 'is-valid' : ''}`}
                                                value={repeatPassword} 
                                                onChange={(e) => setRepeatPassword(e.target.value)} 
                                                placeholder="••••••••"
                                                required 
                                            />
                                            {repeatPassword && !passwordsMatch && (
                                                <small className="text-danger" style={{fontSize: '10px'}}>Passwords do not match.</small>
                                            )}
                                        </div>
                                    </div>

                                    <div className="_social_registration_form_btn">
                                        <button 
                                            type="submit" 
                                            className={`_social_registration_form_btn_link w-100 ${isFormValid ? '_btn1' : '_btn_disabled'}`} 
                                            disabled={!isFormValid || isLoading}
                                            style={{ transition: 'all 0.4s ease' }}
                                        >
                                            {isLoading ? (
                                                <><span className="spinner-border spinner-border-sm me-2"></span>Creating...</>
                                            ) : 'Register Now'}
                                        </button>
                                    </div>
                                </form>

                                <div className="_social_registration_bottom_txt mt-4 text-center">
                                    <p className="_social_registration_bottom_txt_para" style={{fontSize: '13px'}}>
                                        Already have an account? <Link to="/" className="fw-bold text-primary">Login here</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}