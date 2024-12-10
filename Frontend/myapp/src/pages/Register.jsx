import React, { useEffect, useState } from "react";
import { getImgData, detectimg, getsnap } from "../utils/face_detect";
import { useAppContext } from "../configs/AppContext";
import { setUser } from "../controls/axios_ctrl";
import "../styles/Register.css";
const VideoElement = React.lazy(()=>import('../components/videoElement'));

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [password, setPassword] = useState('');
    const [camera, setCamera] = useState(false);
    const [upload, setUpload] = useState(false);
    const [img, setImg] = useState(null);
    const { setError } = useAppContext();

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name || !email || !rollNo || !password) {
            setError({
                type: "danger",
                message: "Please fill all the fields",
                status: 400,
                stack: "Please fill all the fields to register",
            });
            return;
        }
        if (!img && (typeof img !== HTMLVideoElement || typeof img !== HTMLCanvasElement || typeof img !== HTMLImageElement || typeof img !== HTMLMediaElement)) {
            setError({
                type: "danger",
                message: "Please upload an image",
                status: 400,
                stack: "Please upload an image with a face",
            });
            return;
        }
        const faceData = (await getImgData(img));
        // const faceData = await loadModels(await getImgData(img));
        if (!faceData || faceData.length === 0) {
            setError({
                message: "No face detected",
                status: 400,
            });
            setImg(null);
            document.getElementsByTagName("input")[0].value = "";
            return;
        }
        await setUser({ name, email, rollNo, password, img, faceData });
        setError({
            type: "success",
            message: "User registered successfully",
            status: 200,
            stack: "User registered successfully",
        });
        setImg(null);
        setName('');
        setEmail('');
        setRollNo('');
        setPassword('');
        setCamera(false);
        setUpload(false);
    }
    const handleImg = () => {
        setUpload(true);
    }
    const handleImgChange = async (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            // console.log(reader.result);
            setImg(reader.result);
        }
        reader.readAsDataURL(file);
    }
    const captureImg = async () => {
        const image = await getsnap();
        // const image = await loadModels(getsnap);
        // console.log(image);
        if (image) {
            setImg(image);
            setCamera(false);
            setUpload(false);
        }
    }
    useEffect(() => {
        if (!img) { return; }
        // console.log(img);
        if (img) {
            setUpload(false);
            const imgElement = document.getElementById("FaceImg");
            const interval = setInterval(async () => {
                if (imgElement.complete) {
                    const result = await detectimg(imgElement);
                    // const result = await loadModels(await detectimg(imgElement));
                    // console.log(result);
                    if (result) {
                        setError({
                            type: "success",
                            message: "Face detected",
                            status: 200,
                            stack: "Face detected successfully",
                        });
                        clearInterval(interval);
                    } else {
                        setError({
                            type: "danger",
                            message: "No face detected",
                            status: 400,
                            stack: "Please upload an image with a face",
                        });
                        setImg(null);
                        clearInterval(interval);
                    }
                }
            }, 200);
        }
    }, [img, setError]);
    return (
        <div className="Register">
            <h1>Register</h1>
            <div className="container-l">
                <div className="video_section">
                    {camera &&
                    <React.Suspense fallback={<div id="Loader"><div className="child"></div></div>}>
                        <VideoElement />
                    </React.Suspense>
                    }
                    <div className="container">
                        {upload &&
                            <div className="upload">
                                {!camera && <input type="file" accept="image/*" onChange={handleImgChange} />}
                                <button type="button" onClick={() => {
                                    if (!camera) setCamera(true);
                                    else captureImg();
                                }}>Capture</button>
                            </div>
                        }
                        <form onSubmit={handleSubmit}>
                            {img && <img id="FaceImg" src={img} alt="img" />}
                            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="text" placeholder="Roll No" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            {!img && <button type="button" onClick={handleImg}>Upload</button>}
                            <button type="submit">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}