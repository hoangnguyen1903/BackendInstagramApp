# Backend Instagram App

## Features:

- Authentication: login, register
- User: get all users, get user, update profile, update password, follow user, unfollow user
- Post: get all posts, get post by id, create post, update post, delete post, like post, unlike post
- Comment: get comments for post, create comment, delete comment, like comment, unlike comment

## Using Technology:

- Node js
- Express Js
- MongoDB
- JWT

## API:

- Login : <br/>
  localhost:5000/api/v1/auth/login
- Register : <br/>
  localhost:5000/api/v1/auth/register

- Get all users :<br/>
  localhost:5000/api/v1/users
- Get user :<br/>
  localhost:5000/api/v1/users/:id
- Update profile :<br/>
  localhost:5000/api/v1/users/profile
- Update password : <br/>
  localhost:5000/api/v1/users/update-password
- Follow user :<br/>
  localhost:5000/api/v1/users/:id/follow
- Unfollow user :<br/>
  localhost:5000/api/v1/users/:id/unfollow

- Get all posts : <br/>
  localhost:5000/api/v1/posts
- Get post by id : <br/>
  localhost:5000/api/v1/posts/:id
- Create post : <br/>
  localhost:5000/api/v1/posts
- Update post : <br/>
  localhost:5000/api/v1/posts/:id
- Delete post : <br/>
  localhost:5000/api/v1/posts/:id
- Like post : <br/>
  localhost:5000/api/v1/posts/:id/like
- Unlike post : <br/>
  localhost:5000/api/v1/posts/:id/unlike

- Create comment : <br/>
  localhost:5000/api/v1/posts/:postId/comments
- Delete comment : <br/>
  localhost:5000/api/v1/posts/:postId/comments/:id
- Like comment : <br/>
  localhost:5000/api/v1/posts/:postId/comments/:id/like
- Unlike comment :<br/>
  localhost:5000/api/v1/posts/:postId/comments/:id/unlike

## Install Dependencies

```
npm install
```

## Run App

```
npm run server
```

## Database

```
# Delete all data
npm run deleteData

# Insert all data
npm run insertData
```
