const Joi = require('joi');
const mongoDbIDPattern = /^[0-9a-fA-F]{24}$/;
const fs = require('fs');
const Blog = require('../models/blogs');
const {BACKEND_SERVER_PATH} = require('../conifg/index')
const BlogDTO = require('../DTO/blogDTO');
const blogDTO = require('../DTO/blogDTO');
const blogDetailsDto = require ('../DTO/blogDetailsDTO');
const auth = require('../middleware/auth');
const Comments = require('../models/comments')


const blogController ={
    async create (req,res,next){
        //1. validate the data coming from the user
        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            photo: Joi.string().required(),
            author: Joi.string().regex(mongoDbIDPattern).required(),
        });
        const  {error} = createBlogSchema.validate(req.body);
        
        //2. if there error exists, throm it to the middleware
        if (error){
            return next(error);
        }
        const {title,author,content,photo} = req.body;

        //3. store the image after buffering in the local storage - then save it in the DB
        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),'base64');
        const photoPath = `${Date.now()}-${author}.png`;
        try {
                fs.writeFileSync(`storage/${photoPath}`,buffer);
        } catch (error) {
            return next(error);
        }

        //4. Save blog in datanase
        let addNewBlog;
        try {
             addNewBlog = new Blog({
                title:title,
                content:content,
                author:author,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${photoPath}`,
    
            });
            await addNewBlog.save();
            
        } catch (error) {
            return next(error);
        }

        //5. send response
        const blogDTO = new BlogDTO(addNewBlog);
        return res.status(201).json({blog:blogDTO});
       


    },
    async getAll (req,res,next){
        try {
            const blogs = await Blog.find({});
            const blogsDTO =[];
            for(let i=0;i< blogs.length;i++){
                const dto = new blogDTO(blogs[i]);
                blogsDTO.push(dto);
            }
            res.status(200).json({blog:blogsDTO})
        
        }
         catch (error) {
                return next(error);
        }
    },
    async getById (req,res,next){

        //validate the _id;
        const getIdSchema = Joi.object({
            id: Joi.string().regex(mongoDbIDPattern).required(),
        });
        const {error} = getIdSchema.validate(req.params);
        if(error){
            return next(error);
        }

        let blog;
        const {id} = req.params;
        try {
            blog = await Blog.findOne({_id:id}).populate('author');
            
        } catch (error) {
            return next(error);
        }
        const blogDTo = new blogDetailsDto(blog);

        //send response
        res.status(200).json({blog: blogDTo});
        
    },
    async update (req,res,next){
        //validate the new updated data
        const updatedBlogData = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            blogId: Joi.string().regex(mongoDbIDPattern).required(),
            author: Joi.string().regex(mongoDbIDPattern).required(),
            photo:Joi.string()
        });
        const {error} = updatedBlogData.validate(req.body);
        if(error){
            return next(error);
        }
        const {title,content,blogId,author,photo} = req.body;

        //delete previous photo
        let blog;
        try{
             blog = await Blog.findOne({_id:blogId});
            
        }
        catch(error){
            return next(error);
        }
        if(photo){
            let previousPhoto = blog.photoPath;
            previousPhoto = previousPhoto.split('/').at(-1);

            //delete photo
            fs.unlinkSync(`storage/${previousPhoto}`);

            //add new photo
            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),'base64');
            const photoPath = `${Date.now()}-${author}.png`;
            try {
                    fs.writeFileSync(`storage/${photoPath}`,buffer);
            } catch (error) {
                return next(error);
            }
            await Blog.updateOne({_id:blogId},
                {
                    title,
                    content,
                    photoPath: `${BACKEND_SERVER_PATH}/storage/${photoPath}`
                })

        }
        else{
            await Blog.updateOne({_id:blogId},
                {
                    title,
                    content,
                })
        }
        res.status(200).json({message:"Blog Updated"});
    },
    async delete (req,res,next){
        //validate the id of the blog
        const deleteIdSchema = Joi.object({
            id: Joi.string().regex(mongoDbIDPattern).required()
        })
        const {error} = deleteIdSchema.validate(req.params);
        if(error){
            return next(error);
        }
        const{id} = req.params;
        let blog;
        try{
            await Blog.deleteOne({_id:id});
            await Comments.deleteMany({blog:id});
        }
        catch(error){
            return next(error);
        }
        return res.status(200).json({message:'BLOG DELETED SUCCESSFULLY!!!'});
    },
}



module.exports = blogController;