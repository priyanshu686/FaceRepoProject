const faceapi = require('face-api.js');
const User = require('../modules/User');

async function loadModels() {
    const MODEL_URL = (process.env.PUBLIC_URL || 'http://localhost:8000') + '/models';
    try {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);
    } catch (error) {
        console.error("Error loading models:", error);
    }
}

async function compare_face(fD) {
    try {
        if (!fD || fD.length === 0 || typeof fD[0].descriptor !== 'object') {
            return null;
        }
        const descriptors = Object.values(fD[0].descriptor);
        const descriptor = new Float32Array(descriptors);
        const LabeledFaceDescriptors = [new faceapi.LabeledFaceDescriptors("user", [descriptor])];
        if (!LabeledFaceDescriptors) {
            return null;
        }
        const faceMatcher = new faceapi.FaceMatcher(LabeledFaceDescriptors);
        const users = await User.find();
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const faceData = user.faceData;
            const descriptors = Object.values(faceData[0].descriptor);
            const descriptor = new Float32Array(descriptors);
            const bestMatch = faceMatcher.findBestMatch(descriptor);
            if (bestMatch && bestMatch.distance < 0.5) {
                const id = user.attendance.length <= 0 ||(user.attendance.length > 0 && user.attendance[user.attendance.length-1].date !== new Date().toLocaleDateString()) ? user._id : null; 
                return {data:{ name: user.name, email: user.email, rollNo: user.rollNo, img: (process.env.HOST)+(user.img).split('public')[1] }, id};
            }
        }
        return null;

    } catch (error) {
        console.error("Error comparing faces:", error);
        return null;
    }
}

module.exports = {
    loadModels,
    compare_face,
};