import React, { Suspense } from "react";
import { useAppContext } from "../configs/AppContext";
import './Home.css';  
import { Route, Routes } from "react-router-dom";

// Lazy load Register and Login components
const Register = React.lazy(() => import("./Register.jsx"));
const Login = React.lazy(() => import("./Login.jsx"));

const Home = () => {
    const context = useAppContext();

    return (
        <div className="home-container">
            <h1 className="home-header">Welcome Home</h1>
            <div className="home-welcome">
                <p>Hello, <span>{context.user ? context.user.name : 'Guest'}</span>!</p>
                <p>We are so glad to have you here. Feel free to explore the website!</p>
            </div>

            {/* Wrap the Routes inside Suspense to handle lazy loading */}
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<div></div>} />
                </Routes>
            </Suspense>
        </div>
    );
};

export default Home;
