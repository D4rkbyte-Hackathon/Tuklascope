import "../styles/LandingPage.css";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div>

            <div className = "navbar">
                <div className = "nav-left">
                    logo
                </div>
                <div className = "nav-mid">
                    <h3>How it works</h3>
                    <h3>About Us</h3>
                    <h3>Our Mission</h3>
                </div>
                <div className = "nav-right">
                    <button className = "navbar-login" onClick={() => navigate('/login')}> login </button>
                    <button className = "navbar-signup" onClick={() => navigate('/login?mode=register')}> signup </button>           
                </div>
            </div>

            <div className="main">
                <div className="hero-section">
                <img
                    src="/images/HeroSection.svg"
                    alt="Scientific Illustrations Background"
                    className="hero-background-svg"
                />
                </div>
                <div className="how-it-works-section">
                <img
                    src="/images/HowItWorks.svg"
                    alt="How It Works Illustration"
                    className="how-it-works-svg"
                />
                </div>
                <div className="???-section">
                    {/* next part ari */}
                </div>
            </div>

        </div>
    );
};

export default LandingPage;