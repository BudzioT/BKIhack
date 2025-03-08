import { useState} from "react";
import Features from '../features/Features';
import Main from "../main/Main";
import EmailPage from "../emails/EmailPage";
import SupportPage from "../support/SupportPage";

export default function Navbar() {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showMain, setShowMain] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showSupport, setShowSupport] = useState(false);

    return (
        <>
            <div id="navbar">
                <span id="header_name" className="nav_element" onClick={goToMain}>VanishHive</span>
                <span className="nav_element" onClick={goToAll}>All</span>
                <span className="nav_element" onClick={goToEmail}>Emails</span>
                <span className="nav_element">Images</span>
                <span className="nav_element" onClick={goToSupport}>Support</span>
                <span className="nav_element">AI Chat</span>
            </div>

            {showFeatures && <Features />}
            {showMain && <Main />}
            {showEmail && <EmailPage />}
            {showSupport && <SupportPage />}
        </>
    );

    function goToAll() {
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowFeatures(true);
    }

    function goToMain() {
        setShowFeatures(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowMain(true);
    }

    function goToEmail() {
        setShowFeatures(false);
        setShowMain(false);
        setShowSupport(false);
        setShowEmail(true);
    }

    function goToSupport() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(true);
    }
}