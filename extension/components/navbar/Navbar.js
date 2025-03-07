import { useState} from "react";
import Features from '../features/Features';
import Main from "../main/Main";
import EmailPage from "../emails/EmailPage";

export default function Navbar() {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showMain, setShowMain] = useState(true);
    const [showEmail, setShowEmail] = useState(false);

    return (
        <>
            <div id="navbar">
                <span id="header_name" className="nav_element" onClick={goToMain}>VanishHive</span>
                <span className="nav_element" onClick={goToAll}>All</span>
                <span className="nav_element" onClick={goToEmail}>Emails</span>
                <span className="nav_element">Images</span>
                <span className="nav_element">Support</span>
                <span className="nav_element">AI Chat</span>
            </div>

            {showFeatures && <Features />}
            {showMain && <Main />}
            {showEmail && <EmailPage />}
        </>
    );

    function goToAll() {
        setShowFeatures(true);
        setShowMain(false);
        setShowEmail(false);
    }

    function goToMain() {
        setShowFeatures(false);
        setShowMain(true);
        setShowEmail(false);
    }

    function goToEmail() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(true);
    }
}