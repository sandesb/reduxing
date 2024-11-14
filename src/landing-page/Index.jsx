import React, { useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

const Index = () => {
    useEffect(() => {
        // Add main.min.js dynamically
        const mainScript = document.createElement("script");
        mainScript.src = "/js/main.min.js"; // Adjusted path to match your folder structure
        mainScript.defer = true;
        document.body.appendChild(mainScript);

        // Add style.css dynamically
        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = "/css/style.css"; // Adjusted path to match your folder structure
        document.head.appendChild(styleLink);

        // Initialize ScrollReveal after it's loaded
        const initializeScrollReveal = () => {
            if (window.ScrollReveal) {
                const sr = ScrollReveal();

                sr.reveal(".hero-title, .hero-paragraph, .newsletter-header, .newsletter-form", {
                    duration: 1000,
                    distance: "40px",
                    easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
                    origin: "bottom",
                    interval: 150,
                    reset: false,
                    opacity: 0,
                });

                sr.reveal(".bubble-3, .bubble-4, .hero-browser-inner, .bubble-1, .bubble-2", {
                    duration: 1000,
                    scale: 0.95,
                    easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
                    interval: 150,
                    reset: false,
                    opacity: 0,
                });

                sr.reveal(".feature", {
                    duration: 600,
                    distance: "40px",
                    easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
                    interval: 100,
                    origin: "bottom",
                    viewFactor: 0.5,
                    reset: false,
                    opacity: 0,
                });
            }
        };

        // Add ScrollReveal script dynamically
        const scrollRevealScript = document.createElement("script");
        scrollRevealScript.src = "https://unpkg.com/scrollreveal@4.0.0/dist/scrollreveal.min.js";
        scrollRevealScript.async = true;
        scrollRevealScript.onload = initializeScrollReveal;
        document.body.appendChild(scrollRevealScript);

        // Cleanup function to remove scripts and styles on component unmount
        return () => {
            document.body.removeChild(mainScript);
            document.head.removeChild(styleLink);
            document.body.removeChild(scrollRevealScript);
        };
    }, []);

    return (
        <div className="is-boxed has-animations">
            <div className="body-wrap boxed-container">
                <Header />
                <Main />
                <Footer />
            </div>
        </div>
    );
};

export default Index;
