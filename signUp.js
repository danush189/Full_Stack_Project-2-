const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://harsha:Tanjiro24@cluster0.zv89iea.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const signUpDataSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String
});
const SignUpData = mongoose.model('SignUpData', signUpDataSchema);


app.use(express.json());

// Handle form submission
app.post('/submit-form', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const formData = new SignUpData({ fullName, email, password }); // Changed variable name here
        await formData.save();
        res.send('Form data submitted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting form data');
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

