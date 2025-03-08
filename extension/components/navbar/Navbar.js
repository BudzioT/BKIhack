import { useState} from "react";
import Features from '../features/Features';
import Main from "../main/Main";
import EmailPage from "../emails/EmailPage";
import SupportPage from "../support/SupportPage";
import AiTest from "../aiTest/AiTest";
import VirusCheck from "../virusCheck/virusCheck";
import NetworkTrafficVisualizer from "../networkTraffic/NetworkTraffic";


export default function Navbar() {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showMain, setShowMain] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [showSupport, setShowSupport] = useState(false);
    const [showAITest, setShowAITest] = useState(false);
    const [showVirusCheck, setShowVirusCheck] = useState(false);
    const [showNetworkTraffic, setShowNetworkTraffic] = useState(false);

    return (
        <>
            <div id="navbar">
                <span id="header_name" className="nav_element" onClick={goToMain}>VanishHive</span>
                <span className="nav_element" onClick={goToAll}>All</span>
                <span className="nav_element" onClick={goToEmail}>Email chk</span>
                <span className="nav_element" onClick={goToVirusCheck}>Virus chk</span>
                <span className="nav_element" onClick={goToSupport}>Support</span>
                <span className="nav_element" onClick={goToAITest}>Tests</span>
                <span className="nav_element" onClick={goToNetworkTraffic}>Network</span>
            </div>

            {showFeatures && <Features />}
            {showMain && <Main />}
            {showEmail && <EmailPage />}
            {showSupport && <SupportPage />}
            {showAITest && <AiTest />}
            {showVirusCheck && <VirusCheck />}
            {showNetworkTraffic && <NetworkTrafficVisualizer />}
        </>
    );

    function goToAll() {
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowFeatures(true);
    }

    function goToMain() {
        setShowFeatures(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowMain(true);
    }

    function goToEmail() {
        setShowFeatures(false);
        setShowMain(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowEmail(true);
    }

    function goToSupport() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowSupport(true);
    }

    function goToAITest() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowVirusCheck(false);
        setShowAITest(true);
    }

    function goToVirusCheck() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(true);
    }

    function goToNetworkTraffic() {
        setShowFeatures(false);
        setShowMain(false);
        setShowEmail(false);
        setShowSupport(false);
        setShowAITest(false);
        setShowVirusCheck(false);
        setShowNetworkTraffic(true);
    }
}