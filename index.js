const express = require('express');
const path = require('path');
const app = express();
const { connectToMongoDB } = require('./db');
const staticRoute = require('./routes/staticRouter');

const URL = require('./models/url');

const urlRoute = require('./routes/url');
const port =7000;

connectToMongoDB("mongodb://localhost:27017/url-short")
.then(() => console.log("Connected to MongoDB"));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));    

app.get('/test', async (req,res) =>{
    const allUrls = await URL.find({});
    return res.render('home',{
        urls: allUrls,
    });
});

app.use("/url", urlRoute);
app.use("/",staticRoute);

app.get('/url/:shortId', async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{ $push: {
            visitHistory: {
                timestamp: Date.now()}
        },
    }); 
    res.redirect(entry.redirectURL);
});

app.listen(port,() => console.log('Server started at port 7000'));