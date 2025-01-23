const express = require('express');
const app = express();
const userController = require('../controllers/user.controller');
const auth = require('../auth/auth');

app.post('/register', userController.registerUser); 
app.post('/login', userController.loginUser);      
app.put('/update-profile', auth.authVerify, userController.updateProfile); 
app.get('/customers', auth.authVerify, userController.getCustomers);       
app.post('/customers', auth.authVerify, userController.addCustomer);      
app.put('/customers/:id', auth.authVerify, userController.updateCustomer);
app.delete('/customers/:id', auth.authVerify, userController.deleteCustomer); 

module.exports = app;