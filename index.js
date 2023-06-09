import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'
import checkAuth from './utils/chekAuth/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js';
import { loginValidation, registerValidation } from './validations/auth.js';
import { groupCreateValidation } from './validations/group.js';
import { taskValidation } from './validations/task.js';
import * as UserController from './controllers/UserController/UserController.js';
import * as GroupController from './controllers/GroupController/GroupController.js';
import * as TaskController from './controllers/TaskController/TaskController.js'

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', false);
mongoose
    .connect(process.env.DB_TOKEN)
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err))

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/groups', checkAuth, GroupController.getAll);
app.get('/groups/:id', checkAuth, GroupController.getOne);
app.post('/groups', checkAuth, groupCreateValidation, handleValidationErrors, GroupController.create);
app.delete('/groups/:id', checkAuth, GroupController.remove)
app.patch('/groups/:id', checkAuth, groupCreateValidation, handleValidationErrors, GroupController.update)

app.get('/tasks/:groupId', checkAuth, TaskController.getAll);
app.post('/tasks/:groupId', checkAuth, taskValidation, handleValidationErrors, TaskController.create);
app.delete('/tasks/:groupId/:taskId', checkAuth, TaskController.remove)
app.patch('/tasks/:groupId/:taskId', checkAuth, taskValidation, handleValidationErrors, TaskController.update);

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server OK');
})