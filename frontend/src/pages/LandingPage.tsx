import "./LandingPage.css"

const LandingPage = () => {
    return (
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
                <button className = "login"> login </button>
                <button className = "signup"> signup </button>           
            </div>
        </div>
    );
};

export default LandingPage;