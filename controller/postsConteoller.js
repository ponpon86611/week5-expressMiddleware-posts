const Post = require('../models/postsModel');
const User = require('../models/userModel');
const resHandler = require('../services/resHandler');

const postController = {
     async getPosts(req, res, next) {
        try{
            //排序，預設為 DESC(由新到舊)，若網址有帶上 timeSort=asc 則為 ASC (由舊到新)
            const timeSort = req.query.timeSort == "asc" ? "createAt":"-createAt"
            const searchKeyword = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
            const posts = await Post.find(searchKeyword).populate({
                path: 'user',
                select: 'name photo'
            }).sort(timeSort);
            resHandler.successHandler(res, posts, 200);
        } catch(err) {
            resHandler.errorHandler(res,'取得貼文失敗',400);
        }
    },
     async addPost(req, res, next) {
         try{
             const newPost = req.body;
             if(!newPost.user || !newPost.content ){ 
                return resHandler.errorHandler(res, 'ID與內容須填寫!', 400);
             }
             //確認是否有該user， res: null 不存在
             const userInfo = await User.findById(newPost.user).exec();
             if(!userInfo) {
                 return resHandler.errorHandler(res, 'ID 不存在!', 400);
             }
             const post = await Post.create(newPost);
             resHandler.successHandler(res, '貼文新增成功', 200);
         } catch(err) {
            resHandler.errorHandler(res,'新增post失敗',400);
         }
    },
    async deletePostAll(req, res, next) {
        try {
            await Post.deleteMany({});
            const posts = await Post.find();
            resHandler.successHandler(res, posts, 200);
        } catch(err) {
            resHandler.errorHandler(res, `刪除所有貼文失敗...`, 400);
        }      
    },
     async deletePostOne(req, res, next) {
         try{
            //須考慮到傳入不存在的id 或是 不符合格式的id EX: 125drg
            const deletePostId = req.params.id;
            const posts = await Post.findByIdAndDelete(deletePostId);

            if(posts) {
                const posts = await Post.find();
                resHandler.successHandler(res, posts, 200);
            } else {
                // posts is null 代表傳入符合格式的16進制的id，但不存在於DB中，故會回傳null
                resHandler.errorHandler(res, `刪除貼文失敗...`, 400);
            }        
         } catch(err) {
             //不符合id格式
            resHandler.errorHandler(res, '刪除貼文失敗', 400);
         }      
    },
     async patchPost(req, res, body) {
        try{
            const updatePost = req.body;
            const updatePostId = req.params.id;  

            if( !updatePost.content) {
               return resHandler.errorHandler(res, '內容須填寫',400);
            }

            const updatePostRes = await Post.findByIdAndUpdate(updatePostId, updatePost);
            if( updatePostRes ) {
                const posts = await Post.find();
                resHandler.successHandler(res, posts, 200);
            } else {
                // posts is null 代表傳入符合格式的16進制的id，但不存在於DB中，故會回傳null
                resHandler.errorHandler(res, '修改貼文失敗',400);
            }
        } catch(err) {
             //不符合id格式
            resHandler.errorHandler(res, '修改貼文失敗',400);
        }
        
    },
     optionsPost(res) {
        resHandler.successHandler(res, null, 200);
    }
}

module.exports = postController;