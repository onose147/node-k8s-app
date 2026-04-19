const express = require('express');
const mongoose = require('mongoose');
const Message = require('./Message');

const app = express();
const port = 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// Routes
app.get('/', (req, res) => {
    res.send("Node.js App Running on Kubernetes with MongoDB");
});

app.get('/save', async (req, res) => {
    const msg = new Message({ text: "Hello from Kubernetes!" });
    await msg.save();
    res.send("Saved to MongoDB");
});

app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});


