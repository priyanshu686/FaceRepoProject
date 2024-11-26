import React from "react";
import { useAppContext } from "../configs/AppContext";

const Home = () => {
    //eslint-disable-next-line
    const context = useAppContext();

    return (
        <div>
            <h1>Home</h1>
            <p>Welcome, {context.user && context.user.name}</p>
        </div>
    );
};

export default Home;
