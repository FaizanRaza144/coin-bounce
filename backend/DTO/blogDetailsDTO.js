class blogDetailsDTO {
    constructor(blog){
        this._id = blog._id;
        this.title = blog.title;
        this.content = blog.content;
        this.photo = blog.photo;
        this.name = blog.author.name;
        this.username = blog.author.username;
        this.date = blog.createdAt;
    }
}
module.exports = blogDetailsDTO;