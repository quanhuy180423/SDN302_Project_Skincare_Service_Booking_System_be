import express from 'express';
import blogController from '../controllers/blogController';

const blogRouter = express.Router();

blogRouter.post('/create',blogController.createBlog)



export default blogRouter;
