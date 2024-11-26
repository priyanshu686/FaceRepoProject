import instance from '../utils/axios';

export async function getUser(fD) {
    try {
        // console.log(fD);
        const res = await instance.post('/login', {fD});
        return res.data;
    } catch (error) {
        return null;
    }
}

export async function setUser(fD) {
    try {
        const res = await instance.post('/register', fD);
        return res.data;
    } catch (error) {
        return null;
    }
}