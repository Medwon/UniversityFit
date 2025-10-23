import PostModel from "../models/Post.js"


export const getAll = async(req, res) =>{
    try{
        const posts = await PostModel.find().populate({path:'user', select: ['fullName']}).exec()
        res.json(posts) 
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message: "couldnt get posts"
        })
    }
} 

export const getOne = async(req, res) =>{
    try{
        const postId = req.params.id
        PostModel.findOneAndUpdate(
            {
              _id: postId,
            },
            {
              $inc: { viewsCount: 0.5 },
            },
            {
              returnDocument: "after",
            }
          )
            .then((doc) => {
              if (!doc) {
                return res.status(404).json({
                  message: "Article not found",
                });
              }
      
              res.json(doc);
            })
            .catch((err) => {
              if (err) {
                console.log(err);
      
                return res.status(500).json({
                  message: "Error return article",
                });
              }
            });

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message: "couldnt get posts"
        })
    }
} 
export const remove = async(req, res) =>{
    try{
        const postId = req.params.id

        PostModel.findByIdAndDelete({
            _id: postId,
        },)
        .then((doc) => {
            if (!doc) {
              return res.status(404).json({
                message: "Article not found",
              });
            }
    
            res.json({
                succeess: true,
            });
          })
          .catch((err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: "Error remove article",
              });
            }
          });
    
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message: "couldnt get posts"
        })
    }
} 
export const create = async(req, res) =>{
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })

        const post = await doc.save()
        res.json(post)
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message: "couldnt create a post"
        })
    }
}
export const update = async(req,res) =>{
    try{
        const postId = req.params.id

        await PostModel.updateOne({
            _id: postId
        },{
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        })
        res.json({
            success: true
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message: "couldnt update a post"
        })
    }
}


export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const comment = { text: req.body.text, user: req.userId };

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    ).populate({ path: 'comments.user', select: 'fullName' });

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Couldn't add comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await PostModel.findById(postId).populate({
      path: 'comments.user',
      select: 'fullName',
    });

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }
    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось получить комментарии" });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.userId;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Нет прав для удаления комментария' });
    }
    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    res.json({ message: 'Комментарий удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Не удалось удалить комментарий" });
  }
};