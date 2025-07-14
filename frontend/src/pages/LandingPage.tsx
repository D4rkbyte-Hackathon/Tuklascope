import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from '../../images/LogoClearFull.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState<string | null>(null);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const navLinkStyle = (id: string) => ({
        fontSize: 30,
        fontWeight: 600,
        cursor: 'pointer',
        position: 'relative' as const,
        paddingBottom: 2,
        color: hovered === id ? '#FF6B2C' : '#1F2937',
        textDecoration: 'none',
        transition: 'color 0.2s ease-in-out',
    });

    const buttonBaseStyle = {
        textAlign: 'center' as const,
        width: 100,
        padding: '10px 0',
        borderRadius: 20,
        fontFamily: 'Bebas Neue, sans-serif',
        fontSize: 18,
        cursor: 'pointer',
        border: 'none',
        transition: 'transform 0.2s ease-in-out, background-color 0.2s ease-in-out',
    };

    return (
        <div style={{ margin: 0, padding: 0 }}>
            <div style={{
                width: '100%',
                height: 64,
                backgroundColor: 'transparent',
                boxShadow: '0 2px 16px rgba(0, 0, 0, 0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 2rem',
                position: 'fixed',
                top: 0,
                zIndex: 50,
                fontFamily: 'Bebas Neue, sans-serif'
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} alt="Tuklascope Logo" style={{
                        height: 40,
                        width: 'auto',
                        marginRight: 16,
                        objectFit: 'contain'
                    }} />
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 32,
                    flex: 1,
                    justifyContent: 'center'
                }}>
                    {['how-it-works', 'mission-vision', 'about-us'].map((section) => (
                        <h3 key={section}>
                            <a
                                href={`#${section}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(section);
                                }}
                                onMouseEnter={() => setHovered(section)}
                                onMouseLeave={() => setHovered(null)}
                                style={navLinkStyle(section)}
                            >
                                {section === 'how-it-works' && 'How it works'}
                                {section === 'mission-vision' && 'Our Mission'}
                                {section === 'about-us' && 'About Us'}
                            </a>
                        </h3>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        style={{
                            ...buttonBaseStyle,
                            backgroundColor: '#1F2937',
                            color: '#F9FAFB',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        onClick={() => navigate('/login')}
                    >
                        login
                    </button>
                    <button
                        style={{
                            ...buttonBaseStyle,
                            backgroundColor: '#EB831B',
                            color: '#1F2937',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        onClick={() => navigate('/login?mode=register')}
                    >
                        signup
                    </button>
                </div>
            </div>

            <div style={{
                width: '100%',
                minHeight: '100vh',
                backgroundColor: '#FAAC5E',
                paddingTop: 64
            }}>
                <div style={{
                    backgroundColor: '#FAAC5E',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <img
                        src="/images/HeroSection.svg"
                        alt="Scientific Illustrations Background"
                        style={{
                            display: 'block',
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            objectPosition: '50% 80%',
                        }}
                    />
                </div>

                <div id="how-it-works">
                    <img
                        src="/images/HowItWorks.svg"
                        alt="How It Works Illustration"
                        style={{
                            display: 'block',
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            objectPosition: '50% 80%',
                        }}
                    />
                </div>

                <div id="mission-vision">
                    <img
                        src="/images/MissionVision.svg"
                        alt="Mission Vision Illustration"
                        style={{
                            display: 'block',
                            width: '100%',
                            height: 'auto',
                            objectFit: 'cover',
                            objectPosition: '50% 80%',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LandingPage;