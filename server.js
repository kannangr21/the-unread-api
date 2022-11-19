const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.okfjq.mongodb.net/the-unread?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, { useNewUrlParser : true, useUnifiedTopology: true})
.then((result) => {
    app.listen(process.env.PORT); 
    console.log("Server up!");
})
.catch((err) => console.log("Error Raised : ", err));

const api = require('./api/api')
app.use('/api', api);