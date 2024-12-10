import * as faceapi from 'face-api.js';
var video = document.getElementById("facecam");

export const loadModels = async (func) => {
    const MODEL_URL = "./models";
    
    try {
        await Promise.all([
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]).then(async() => {
            // console.log("Models loaded successfully");
            return await func();
        }).catch((error) => {
            console.error("Error loading models:", error);
        });
    } catch (error) {
        console.error("Error loading models:", error);
    }
};

export const init = async () => {
    await captureVideo();
    if (video) {
        video.addEventListener("play", async() => {
            await draw_face();
        });
        return video;
    }
};

const handleSuccess = (stream) => {
    video = document.getElementById("facecam");
    video.srcObject = stream;
    video.style.transform = `scaleX(-1)`;
};

const handleError = (error) => {
    console.error("Error accessing media devices.", error);
};

export const captureVideo = async () => {
    const constraints = {
        video: true,
        audio: false,
    };
    const permissions = await navigator.permissions.query({ name: "camera" });
    if (permissions.state === "denied") {
        console.error("Camera access denied");
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handleSuccess(stream);
    } catch (error) {
        handleError(error);
    }
};

export const draw_face = async () => {
    if (!video) return;
    const canvas = faceapi.createCanvasFromMedia(video);
    if (!(document.querySelectorAll("canvas").length > 0)) {
        video.style.position = "relative";
        video.style.zIndex = "1";
        canvas.style.position = "absolute";
        canvas.style.zIndex = "1000";
        canvas.style.top = video.offsetTop + "px";
        canvas.style.left = video.offsetLeft + "px";

        document.body.append(canvas);
    }
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 200);

};

export const loadFace = (faceData) => {

    if (!faceData || !faceData[0].descriptor || typeof faceData[0].descriptor !== 'object') {
        console.log(typeof faceData[0].descriptor);
        return null;
    }

    const descriptorArray = Object.values(faceData[0].descriptor);
    const descriptor = [new Float32Array(descriptorArray)];
    return [new faceapi.LabeledFaceDescriptors(faceData.name, descriptor)];
};

export const compare_face = async (fD) => {
    if (!video) return false;
    // console.log(fD);
    const faceData = loadFace(fD);
    if (!faceData) return false;
    // console.log(faceData);
    const singleResult = await faceapi.detectSingleFace(video).withFaceLandmarks().withFaceDescriptor();
    if (!singleResult) return false;
    const faceMatcher = new faceapi.FaceMatcher(faceData);
    const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
    if (bestMatch.distance < 0.5) {
        return { name: fD.name, email: fD.email, rollNo: fD.rollNo, img: fD.img };
    }
    return false;
}

export const stopVideo = () => {
    if (video && video.srcObject) {
        // console.log(video.srcObject);
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
};

export const getsnap = async () => {
    if (!video && (typeof video !== HTMLVideoElement || typeof video !== HTMLCanvasElement || typeof video !== HTMLImageElement || typeof video !== HTMLMediaElement)) return;
    Array.from(document.querySelectorAll("canvas")).forEach((c) => c.remove());
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    return canvas.toDataURL("image/jpeg");
    // return image;
}

export const getImgData = async (image) => {
    if (!image) return;
    const img = await faceapi.fetchImage(image);
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    if (!detections || detections.length === 0) return;
    const result = detections.map((detection) => {
        return {
            descriptor: detection.descriptor,
            landmarks: detection.landmarks,
        };
    });
    return result;
}
export const getFaceData = async () => {
    if (!video) return;
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
    if (!detections || detections.length === 0) return;
    const result = detections.map((detection) => {
        return {
            descriptor: detection.descriptor,
            landmarks: detection.landmarks,
        };
    });
    return result;
};

export const getFaceLandmarks = async () => {
    if (!video) return;
    const detections = await faceapi.detectSingleFace(video).withFaceLandmarks();
    return detections;
};

export const detectimg = async (img) => {
    return draw_face_img(img);
};

export const draw_face_img = async (img) => {
    const canvas = faceapi.createCanvasFromMedia(img);
    if (!(document.querySelectorAll("canvas").length > 0)) {
        img.style.zIndex = "1";
        canvas.style.position = "absolute";
        canvas.style.zIndex = "1000";
        canvas.style.top = (img.offsetTop) + "px";
        canvas.style.left = (img.offsetLeft) + "px";
        // console.log(img.offsetTop, img.offsetLeft);
        // console.log(canvas.style.top, canvas.style.left);

        // document.body.append(canvas);
    }
    const displaySize = { width: img.width, height: img.height };
    faceapi.matchDimensions(canvas, displaySize);

    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();
    if (!detections || detections.length === 0) return false;
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    return true;
};