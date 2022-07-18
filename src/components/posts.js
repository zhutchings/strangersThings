import React, { useEffect, useState } from "react";
import { fetchPosts } from "../utility/api";
//import { apiCall, fetchPosts } from "../utility/api";

const Posts = ({posts, setPosts, user, token}) => {

    const [search, setSearch] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [willDeliver, setWillDeliver] = useState(false);
    const [postId, setPostId] = useState('');
    const [message, setMessage] = useState('');
    
    
    useEffect(() => {   
    
    if(user && token) {
        fetchPostsIfRegistered();
    } else {
        fetchPosts();
    }
    },[])

    const fetchPosts = async () => {
        const response = await fetch ('https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/posts');
        const data = await response.json();
        console.log('data: ', data)
        setPosts(data.data.posts);
        console.log(posts);
    }

    const fetchPostsIfRegistered = async () => {
        const response = await fetch('https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/posts', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('data: ', data)
        setPosts(data.data.posts);
        console.log(posts, "Check to see if this has messages");
    }
    

    const searchPosts = (posts) => {
        return `${posts.title} ${posts.description}`
        .toLowerCase()
        .includes(search.toLowerCase());
    }

    const handleSubmitPost  = async (e) => {
        e.preventDefault();
        const response = await fetch('https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/posts', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              post: {
                title: title,
                description: description,
                price: price,
                willDeliver: willDeliver
              }
            })
        });
        const newPosts = await response.json();
        console.log(newPosts);

        fetchPostsIfRegistered();
    } 

    const handleSubmitComment  = async (e, post) => {
        console.log(e.target.querySelector("input").value, "THIS ONE")
        const message = e.target.querySelector("input").value
        console.log(post);
        e.preventDefault();
        const response = await fetch(`https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/posts/${post._id}/messages`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message: {
                    content: message
                  }
              })
        });
        const newPosts = await response.json();
        fetchPostsIfRegistered();
        e.target.querySelector("input").value = "";
    }



    const deletePost = async (e, post) => {
        console.log(post)
        e.stopPropagation();
        const response = await fetch(`https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/posts/${post._id}`, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          })
        const data = await response.json();
        console.log(data);
        fetchPostsIfRegistered();
    }

    return <>
        <h1 id = "banner"> POSTS </h1>

        <h3> Search Posts</h3>
        <input 
            onChange={(e) => setSearch(e.target.value)}
            type="text" name="search" placeholder="search"
        />

       
    {user && token && <form onSubmit={handleSubmitPost}>
        <h3> Create a New Post</h3>
        <input 
          onChange={(e) => setTitle(e.target.value)}
          type="text" name="title"
          placeholder="title" value={title} />
        <input 
          onChange={(e) => setDescription(e.target.value)}
          type="text" name="description"
          placeholder="description" value={description} />
        <input 
          onChange={(e) => setPrice(e.target.value)}
          type="text" name="price"
          placeholder="price" value={price} />
         <input 
          onChange={(e) =>  {
            console.log(e.target.value);
                if (e.target.value === "on") {
                    setWillDeliver(true); 
                } else {
                setWillDeliver(false)
                }
            }   
        }          
        type="checkbox" name="willDeliver"
        placeholder="will deliver"  />
        <label for="willDeliver">Will Deliver?</label>
        <button type="submit">Submit Post</button>
      </form>
    }

    <ul>
        {
        posts.filter(posts => {
                return searchPosts(posts)
        }).map(post => <div key = {post.id}>
                <h3>{post.title}</h3>
                <div>{post.description}</div>
                <div>{post.price}</div>
                <div>{post.willDeliver}</div>
                {user && token && (user._id === post.author._id) && <button onClick={(e) => deletePost(e, post)}>Delete Post</button>}
                {user && token && (user._id !== post.author._id) && <form onSubmit={(e) => handleSubmitComment(e, post)}>
                {/* <input value={message} placeholder="content" onChange={(ev) => setMessage(ev.target.value)}></input>        */}
                <input placeholder="content" ></input>
                        <button type="submit">Send Message</button>
                        </form>
                }
            </div>
         )}
     </ul>
    </>
}


export default Posts;
  
