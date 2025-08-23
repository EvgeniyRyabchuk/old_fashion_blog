




`ToDoList` 

1. Text/Image editor 
    1. Category crud 
    2. Tags crud 


2. Cloudinary 
3. Firebase 
4. User Auth + 
    1. admins system 
    2. more ways to login 

5. Paggination 
6. Loadeer 
7. Filter/Sort 
8. Adaptive design
9. Validation

normalized db in firebase 



Add func to make different template of posts: image+text - vertical |  image+text - horizontal  



`Db stucture` 

users:
    createdAt
    email
    name
tags:
    name
posts: 
    categoryId
    content
    coverUrl
    createdAt
    date_range
    title
    userId
post_tag: 
    postId
    tagId
comments:
    content
    createdAt
    userId
admins: 
    userId

