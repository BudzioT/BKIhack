import { useState} from "react";
import Features from '../features/Features';
import Main from "../main/Main";
import EmailPage from "../emails/EmailPage";
import SupportPage from "../support/SupportPage";
import AiTest from "../aiTest/AiTest";
import VirusCheck from "../virusCheck/virusCheck";
import EmailRep from "../emailRep/EmailRep";

export default function Navbar() {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showMain, setShowMain] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [showAITest, setShowAITest] = useState(false);
    const [showVirusCheck, setShowVirusCheck] = useState(false);
    const [showEmailRep, setShowEmailRep] = useState(false);

    return (
        <>
            <div id="navbar">
                <span id="header_name" className="nav_element" onClick={goToMain}>VanishHive</span>
                <span className="nav_element" onClick={goToAll}>All</span>
                <span className="nav_element" onClick={goToEmail}>Email check</span>
                <span className="nav_element" k onClick={goToEmailRep}>Email rep</span>
                <span className="nav_element" onClick={goToVirusCheck}>Virus check</span>
                <span className="nav_element" onClick={goToSupport}>Support</span>
                <span className="nav_element" onClick={goToAITest}>AI Test</span>
            </div>

            {showFeatures && <Features />}
            {showMain && <Main />}
            {showEmail && <EmailPage />}
            {showSupport && <SupportPage />}
            {showAITest && <AiTest />}
            {showVirusCheck && <VirusCheck />}
            {showEmailRep && <EmailRep />}
        </>
    );

    function goToAll() {
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowEmailRep(false);
        setShowFeatures(true);
    }

    function goToMain() {
        setShowFeatures(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowEmailRep(false);
        setShowMain(true);
    }

    function goToEmail() {
        setShowFeatures(false);
        setShowMain(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowEmailRep(false);
        setShowEmail(true);
    }

    function goToSupport() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowEmailRep(false);
        setShowSupport(true);
    }

    function goToAITest() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowVirusCheck(false);
        setShowEmailRep(false);
        setShowAITest(true);
    }

    function goToVirusCheck() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowEmailRep(false);
        setShowVirusCheck(true);
    }

    function goToEmailRep() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowEmailRep(true);
    }
}