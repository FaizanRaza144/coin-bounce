class blogDTO {
    constructor (blog){
        this._id = blog._id;
        this.author = blog.author;
        this.photo = blog.photoPath;
        this.content = blog.content;
        this.title = blog.title;
    }
}
module.exports = blogDTO;