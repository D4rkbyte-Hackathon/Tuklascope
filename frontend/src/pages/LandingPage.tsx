import "../styles/LandingPage.css";
import { useNavigate } from 'react-router-dom';
import logo from '../../images/LogoClearFull.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    return (
        <div>

            <div className = "navbar">
                <div className = "nav-left">
                    <img src={logo} alt="Tuklascope Logo" className="logo" />
                </div>
                <div className = "nav-mid">
                    <h3><a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}>How it works</a></h3>
                    <h3><a href="#mission-vision" onClick={(e) => { e.preventDefault(); scrollToSection('mission-vision'); }}>Our Mission</a></h3>
                    <h3>About Us</h3>
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
                <div id="how-it-works" className="how-it-works-section">
                <img
                    src="/images/HowItWorks.svg"
                    alt="How It Works Illustration"
                    className="how-it-works-svg"
                />
                </div>
                <div id="mission-vision" className="mission-vision-section">
                <img
                    src="/images/MissionVision.svg"
                    alt="Mission Vision Illustration"
                    className="mission-vision-svg"
                />
                </div>
            </div>

        </div>
    );
};

export default LandingPage;