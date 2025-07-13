import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LoginRegister.css';
// import CardSwap from '../components/CardSwap'; // Skipped for now
import {auth, db, createUserWithEmailAndPassword, setDoc, doc, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider, signInWithPopup} from '../database/firebase';
// --- Firebase imports removed ---

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState({ login: false, register: false });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode');

  const [isRegister, setIsRegister] = useState(mode === 'register');

  useEffect(() => {
    setIsRegister(mode === 'register');
  }, [mode]);

  useEffect(() => {
    // Forcefully remove dark mode AND prevent it from being added again
    document.body.classList.remove('dark');
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    city: '', // optional
    country: '', // optional
    education: '',
  });

  // Update handleInput to accept both input and select events
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Placeholder login function ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with real login logic later
    try{
      const {email, password} = formData;
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/home');
    }
    catch(error: any){
      alert('Login failed:'+ error.message);
    }
    
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user data to Firestore
      await setDoc(doc(db, 'Tuklascope-user', user.uid), {
        name: user.displayName,
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      alert('Google sign-in successful!');
      navigate('/home');
    } catch (error: any) {
      alert(`Google sign-in failed: ${error.message}`);
    }
  }

  // --- Placeholder register function ---
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with real register logic later
   try {
    const { email, password, name, surname, city, country, education } = formData;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, 'Tuklascope-user', user.uid), {
      name,
      surname,
      email,
      city,
      country,
      education,
      createdAt: new Date().toISOString()
    });

    alert('Account created!');
    setIsRegister(false);
    setFormData({
      name: '',
      surname: '',
      email: '',
      password: '',
      city: '',
      country: '',
      education: '',
    });
  } catch (error: any) {
    alert(`Registration failed: ${error.message}`);
  }
  };

  return (
    <div className={`login container grid ${isRegister ? 'active' : ''}`}>
      {/* Left Side - Login/Register Forms */}
      <div className="login__forms-container">
        {/* Login Form */}
        <div className={`login__access${!isRegister ? ' active' : ''}`}>
          <h1 className="login__title">Log in to your account.</h1>
          <div className="login__area">
            <form className="login__form" onSubmit={handleLogin}>
              <div className="login__content grid">
                <div className="login__box">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInput}
                    required
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="login__label">Email</label>
                  <i className="ri-mail-fill login__icon"></i>
                </div>
                <div className="login__box">
                  <input
                    type={showPassword.login ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInput}
                    required
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="login__label">Password</label>
                  <i
                    className={`ri-eye${showPassword.login ? '' : '-off'}-fill login__icon login__password`}
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, login: !prev.login }))
                    }
                  ></i>
                </div>
              </div>
              <button type="button" className="login__forgot" onClick={() => navigate('/forgot-password')}>Forgot your password?</button>
              <button type="submit" className="login__button">Login</button>
            </form>

            <div className="login__social">
              <p className="login__social-title">Or sign in with</p>
              <button type="button" className="google-signin-button" onClick={handleGoogleSignIn}>
                <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="google-icon" />
                <span>Sign in with Google</span>
              </button>
            </div>

            <p className="login__switch">
              Don't have an account? <button type="button" onClick={() => setIsRegister(true)}>Create Account</button>
            </p>
          </div>
        </div>

        {/* Register Form */}
        <div className={`login__register${isRegister ? ' active' : ''}`}>
          <h1 className="login__title">Create new account.</h1>
          <div className="login__area">
            <form className="login__form" onSubmit={handleRegister}>
              <div className="login__content grid">
                <div className="login__group grid">
                  <div className="login__box">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInput}
                      required
                      placeholder=" "
                      className="login__input"
                    />
                    <label className="login__label">Name</label>
                    <i className="ri-id-card-fill login__icon"></i>
                  </div>
                  <div className="login__box">
                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleInput}
                      required
                      placeholder=" "
                      className="login__input"
                    />
                    <label className="login__label">Surname</label>
                    <i className="ri-id-card-fill login__icon"></i>
                  </div>
                </div>
                {/* City field (optional) */}
                <div className="login__box">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInput}
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="login__label">City (optional)</label>
                  <i className="ri-map-pin-2-fill login__icon"></i>
                </div>
                {/* Country field (optional) */}
                <div className="login__box">
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInput}
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="login__label">Country (optional)</label>
                  <i className="ri-earth-fill login__icon"></i>
                </div>
                {/* Education level dropdown */}
                <div className="login__box" style={{ position: 'relative' }}>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInput}
                    required
                    className="login__input login__select"
                    style={{ paddingLeft: '1.25rem' }}
                  >
                    <option value="" disabled hidden></option>
                    <option value="Senior High (Grades 11-12)">Senior High (Grades 11-12)</option>
                    <option value="Junior High (Grades 7-10)">Junior High (Grades 7-10)</option>
                    <option value="Elementary (Grades 1-6)">Elementary (Grades 1-6)</option>
                    <option value="Other">Other</option>
                  </select>
                  <label className="login__label" htmlFor="education">Education Level</label>
                  <i className="ri-graduation-cap-fill login__icon" style={{ right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', position: 'absolute' }}></i>
                </div>
                <div className="login__box">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInput}
                    required
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="login__label">Email</label>
                  <i className="ri-mail-fill login__icon"></i>
                </div>
                <div className="login__box">
                  <input
                    type={showPassword.register ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInput}
                    required
                    placeholder=" "
                    className="login__input"
                  />
                  <label className="login__label">Password</label>
                  <i
                    className={`ri-eye${showPassword.register ? '' : '-off'}-fill login__icon login__password`}
                    onClick={() =>
                      setShowPassword((prev) => ({ ...prev, register: !prev.register }))
                    }
                  ></i>
                </div>
              </div>
              <button type="submit" className="login__button">Create account</button>
            </form>
            <p className="login__switch">
              Already have an account? <button type="button" onClick={() => setIsRegister(false)}>Log In</button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - CardSwap Component skipped for now */}
      {/* <div className="login__card-swap">
        <CardSwap />
      </div> */}
    </div>
  );
};

export default LoginPage;
