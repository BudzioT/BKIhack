import { useState} from "react";
import Features from '../features/Features';
import Main from "../main/Main";
import EmailPage from "../emails/EmailPage";
import SupportPage from "../support/SupportPage";
import AiTest from "../aiTest/AiTest";

export default function Navbar() {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showMain, setShowMain] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [showAITest, setShowAITest] = useState(false);

    return (
        <>
            <div id="navbar">
                <span id="header_name" className="nav_element" onClick={goToMain}>VanishHive</span>
                <span className="nav_element" onClick={goToAll}>All</span>
                <span className="nav_element" onClick={goToEmail}>Emails</span>
                <span className="nav_element">Images</span>
                <span className="nav_element" onClick={goToSupport}>Support</span>
                <span className="nav_element" onClick={goToAITest}>AI Test</span>
            </div>

            {showFeatures && <Features />}
            {showMain && <Main />}
            {showEmail && <EmailPage />}
            {showSupport && <SupportPage />}
            {showAITest && <AiTest />}
        </>
    );

    function goToAll() {
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowFeatures(true);
    }

    function goToMain() {
        setShowFeatures(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowMain(true);
    }

    function goToEmail() {
        setShowFeatures(false);
        setShowMain(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowEmail(true);
    }

    function goToSupport() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowAITest(false);
        setShowSupport(true);
    }

    function goToAITest() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(true);
    }
}