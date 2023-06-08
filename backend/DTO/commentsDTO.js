class commentsDTO {
    constructor (comment){
        this._id = comment._id;
        this.content = comment.content;
        this.author = comment.author.username;
        this.date = comment.createdAt
        }
}
module.exports = commentsDTO;