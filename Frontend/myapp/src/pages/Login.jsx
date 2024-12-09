import React, { useEffect } from "react";
import VideoElement from "../components/videoElement.jsx";
import axios from "../utils/axios.js";
// eslint-disable-next-line
// import { compare_face } from "../utils/face_detect";
import { useAppContext } from "../configs/AppContext";
import UserCard from "../components/userCard.jsx";
import { getUser } from "../controls/axios_ctrl";
import "../styles/login.css";
import { getFaceData, getsnap } from "../utils/face_detect";

export default function Login() {
    const { setUser, setError, video } = useAppContext();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [logintype, setLogintype] = React.useState(true);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            id:username,
            password,
        };
        const res = await axios.post("/login", user);
        setUser(res.data.data);
        return res.data.data;
    }
    return (
        <>
            <div className="Login">
                <h1>Login</h1>
                <p>Use your face to login or use Email try Email and password if not found</p>
                <button onClick={() => setLogintype(!logintype)}>{ logintype? '':'Face ' }Login</button>
                <div className="login__container">
                    {
                        logintype ?
                            <VideoElement />
                            :
                            <div className="login_input">
                                <form onSubmit={handleSubmit}>
                                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <button type="submit">Login</button>
                                </form>
                            </div>
                    }
                    <UserCard />
                </div>
            </div>
        </>
    );
}