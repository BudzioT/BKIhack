import { useState} from "react";
import Features from '../features/Features';
import Main from "../main/Main";

export default function Navbar() {
    const [showFeatures, setShowFeatures] = useState(false);
    const [showMain, setShowMain] = useState(true);

    return (
        <>
            <div id="navbar">
                <span id="header_name" className="nav_element" onClick={goToMain}>VanishHive</span>
                <span className="nav_element" onClick={goToAll}>All</span>
                <span className="nav_element">Emails</span>
                <span className="nav_element">Images</span>
                <span className="nav_element">Support</span>
                <span className="nav_element">AI Chat</span>
            </div>

            {showFeatures && <Features />}
            {showMain && <Main />}
        </>
    );

    function goToAll() {
        setShowFeatures(true);
        setShowMain(false);
    }

    function goToMain() {
        setShowFeatures(false);
        setShowMain(true);
    }
}