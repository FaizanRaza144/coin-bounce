const Joi = require('joi');
const mongoDbIDPattern = /^[0-9a-fA-F]{24}$/;
const Comment = require('../models/comments');
const commentsDTO = require('../DTO/commentsDTO');


const commentController ={
    async create  (req,res,next)  {
        const commentsSchema = Joi.object({
            content: Joi.string().required(),
            author:Joi.string().regex(mongoDbIDPattern).required(),
            blog:Joi.string().regex(mongoDbIDPattern).required()
        })
        const {error} = commentsSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {content,blog,author} = req.body;
        
        let newComment;
        try {
            newComment = new Comment({
                content: content,
                author: author,
                blog:blog
            })
            await newComment.save();
        } catch (error) {
            return next(error);
        }
        res.status(200).json({message:"Comment Created"});


    },

    async getById(req,res,next) {
        const getIDSchema = Joi.object({
            id: Joi.string().required()
        });
        const {error} = getIDSchema.validate(req.params);
        if(error){
            return next(error);
        }
        const {id} = req.params;
         
        let comments;
        try {
            comments  = await Comment.find({blog:id}).populate('author');
        } 
        catch (error) {
            return next(error);
        }
        let commentsdto=[];
        for(let i = 0;i<comments.length;i++){
            const obj = new commentsDTO(comments[i]);
            commentsdto.push(obj);
        }

       return res.status(200).json({data:commentsdto});
    }
}
module.exports = commentController;