
import express from 'express'
import multer from 'multer'

import mongoose from 'mongoose'

import { registerValidator, loginValidator, postCreateValidator } from './validations.js'
import checkAuth from "./utils/checkAuth.js"

import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import * as FavoritesController from './controllers/FavoritesController.js';

import handleValidationErrors from './utils/handleValidationErrors.js'
import cors from 'cors';

import bodyParser from 'body-parser';

mongoose.connect('mongodb+srv://admin:redder@cluster0.jjpph.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'

).then(() => console.log("Db ok"))
.catch((err) => console.log("Db error!!", err))


const app = express()
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
    destination: (_, __, cb) =>{
        cb(null, 'uploads')
    }, 
    filename: (_, file, cb) =>{
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.get('/users/:id', UserController.getUserById);

app.post('/auth/login',loginValidator, handleValidationErrors, UserController.login )

app.post('/auth/register', registerValidator, handleValidationErrors,UserController.register)

app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth,upload.single('image'), (req,res) =>{
    res.json({
        url:`/uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)

app.get('/profile', checkAuth, UserController.getProfile);

app.post('/profile/avatar', checkAuth, upload.single('avatar'), UserController.uploadAvatar);
app.use('/uploads', express.static('uploads'));

app.post('/posts',checkAuth,postCreateValidator,handleValidationErrors, PostController.create)
app.delete('/posts/:id',checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth,postCreateValidator,handleValidationErrors,PostController.update)

app.post('/posts/:id/comments', checkAuth, PostController.addComment);
app.get('/posts/:id/comments', PostController.getComments);
app.delete('/posts/:postId/comments/:commentId', checkAuth, PostController.deleteComment);

app.patch('/profile/update', checkAuth, UserController.updateProfile);

app.get('/leaderboard', UserController.getAllUsers);
app.get('/average', UserController.getAverageScores)

app.post('/favorites', checkAuth, FavoritesController.addFavorite);
app.get('/favorites', checkAuth, FavoritesController.getFavorites);

app.delete('/favorites/:id', checkAuth, FavoritesController.removeFavorite);

app.get('/balance', checkAuth, UserController.getCurrencyBalance)
app.patch('/balance/add', checkAuth, UserController.updateCurrencyBalance)
app.post('/posts/:id/comments', checkAuth, PostController.addComment);

app.post('/calculate-gpa', (req, res) => {
    const { grades } = req.body;
    if (!grades || !grades.length) {
        return res.status(400).send({ error: 'No grades provided.' });
    }

    const totalPoints = grades.reduce((sum, { grade }) => sum + grade, 0);
    const gpa = (totalPoints / grades.length).toFixed(2);

    res.send({ gpa });
});


app.listen(4444, (err) =>{
    if(err){
        return console.log(err)
    }
    console.log("Server Ok")
})