const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const { compare_face, loadModels } = require('./utils/faceapi');
require('./configs/dbconnect')();
const User = require('./modules/User');

app.set('view engine', 'ejs');
app.set('views', './src/views');

const port = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.static('public'));
loadModels();

app.get('/', async (req, res) => {
    res.render('index', { title: 'Home', page: 'home' });
});

app.get('/inspect', (req, res) => {
    res.render('index', { title: 'Inspect', page: 'inspect' });
});

app.get('/status', (req, res) => {
    res.render('index', { title: 'Status', page: 'status' });
});

app.post('/login', async(req, res) => {
    const { fD } = req.body;
    // console.log(fD);
    if (!fD || fD.length === 0) {
        return res.status(400).json({ message: 'Please provide face data' });
    }
    try {
        const {data,id} = await compare_face(fD);
        const today = new Date();
        const date = today.toLocaleDateString();
        await User.findByIdAndUpdate(id, {
            $push: {
              attendance: {
                date: date,
                status: 'Present'
              }
            }
          }, {
            new: true,
            runValidators: true
          });
        
        if (data) {
            return res.status(200).json({ user: data });
        }
        return res.status(400).json({ message: 'User not found' });
    } catch (error) {
        // console.log('error')
        return res.status(400).json({ message: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const img = await compare_face();
        res.status(200).send("<img src='" + img.src + "' />");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { name, email, rollNo, img, faceData } = req.body;
    const user = new User({ name, email, rollNo, faceData });
    const imgPath = `public/images/${user._id}.jpg`;
    user.img = imgPath;

    const base64Data = img.split(';base64,').pop();
    await user.save().then((user) => {
        fs.writeFileSync(imgPath, base64Data, 'base64');
        res.status(200).json({ user });
    }).catch((error) => {
        res.status(400).json({ message: error.message });
    });
});

app.listen(port, async() => {
    console.clear();
    console.log(`Example app listening at http://localhost:${port}`);
});