import React from "react";
import { useAppContext } from "../configs/AppContext";
import './Home.css';  
import { Link } from "react-router-dom";

const Home = () => {
    const context = useAppContext();

    return (
        <div className="home-container">
            <h1 className="home-header">Welcome Home</h1>
            <div className="home-welcome">
                <p>Hello, <span>{context.user ? context.user.name : 'Guest'}</span>!</p>
                <p>We are so glad to have you here. Feel free to explore the website!</p>
            </div>
            <button type="button">
                Login
            </button>
        </div>
    );
};

export default Home;
