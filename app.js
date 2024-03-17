const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb+srv://harsha:Tanjiro24@cluster0.zv89iea.mongodb.net/mydb', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const formDataSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    contact: String,
    location: String,
    duration: String
});


const signUpDataSchema = new mongoose.Schema({
    fullName: String,
    userName: String,
    email: String,
    password: String
});


const FormData = mongoose.model('FormData', formDataSchema);
const SignUpData = mongoose.model('SignUpData', signUpDataSchema);


app.use(express.json());


app.post('/submit-form', async (req, res) => {
    try {
        const { firstName, lastName, email, contact, location, duration } = req.body;
        const formData = new FormData({ firstName, lastName, email, contact, location, duration });
        await formData.save();
        res.send('Form data submitted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting form data');
    }
});

app.get('/check-username/:username', async (req, res) => {
  const { username } = req.params;
  const user = await SignUpData.findOne({ userName: username });

  if (user) {
      res.json({ exists: true });
  } else {
      res.json({ exists: false });
  }
});



app.post('/submit-signup', async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); 
        const signUpData = new SignUpData({ fullName, userName, email, password: hashedPassword });
    
        await signUpData.save();
        
        res.send('Sign up data submitted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting sign up data');
    }
});

app.post('/login', async (req, res) => {
    const { userName, password } = req.body;
  
    try {
      const user = await SignUpData.findOne({ userName: userName.trim() });
  
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
  
        if (passwordMatch) {
          res.json({ success: true });
        } else {
          res.json({ success: false, error: 'Incorrect password' });
        }
      } else {
        res.json({ success: false, error: 'User not found' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  });


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
