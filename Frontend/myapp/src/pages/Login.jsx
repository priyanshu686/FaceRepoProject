import React, { useEffect } from "react";
import VideoElement from "../components/videoElement.jsx";
// eslint-disable-next-line
// import { compare_face } from "../utils/face_detect";
import { useAppContext } from "../configs/AppContext";
import UserCard from "../components/userCard.jsx";
import { getUser } from "../controls/axios_ctrl";
import "../styles/login.css";
import { getFaceData, getsnap } from "../utils/face_detect";

export default function Login() {
    const { setUser, setError, video } = useAppContext();

    async function handleLogin() {
        const img = await getsnap();
        // const img = await loadModels(getsnap);
        if (!img) {
            return false;
        }
        // console.log(img);
        const fD = await getFaceData(img);
        // const fD = await loadModels(await getFaceData(img));
        if (!fD || fD.length === 0) {
            return;
        }
        const result = await getUser(fD);
        // console.log(result);
        return result;
    }
    useEffect(() => {
        // console.log("Login page loaded");
        const interval = setInterval(async () => {
            if (video) {
                try {
                    const result = await handleLogin();
                    if (result && result.user) {
                        setUser(result.user);
                        setError({
                            message: "User found",
                            type: "success",
                            status: 200,
                        })
                        setTimeout(() => {
                            setUser(null);
                        }, 5000);
                        // clearInterval(interval);
                    } else if (result && result.message) {
                        setUser(null);
                        setError({
                            message: result.message,
                            type: "error",
                            status: 404,
                        });
                    }
                } catch (error) {
                    setError(error.message);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [video, setError, setUser]);
    return (
        <>
            <div className="Login">
                <h1>Login</h1>
                <div className="login__container">
                    <VideoElement />
                    <UserCard />
                </div>
            </div>
        </>
    );
}