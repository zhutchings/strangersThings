import React, { useState } from "react";
import { NavLink, Route } from "react-router-dom";
import Posts from './posts';
import Account from "./account";






const App = () => {

    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [user, setUser] = useState(false);

  return <main> 
    <nav>
      <NavLink exact to="/" className="navlink" activeClassName="active">
        Home
      </NavLink>

      <NavLink to="/posts" className="navlink" activeClassName="active">
        posts
      </NavLink>

      <NavLink to="/account" className="navlink" activeClassName="active">
        Account
      </NavLink>
    </nav>
   
    <Route exact path="/">
      <div></div>
    </Route>

    <Route path="/posts">
         <Posts posts={posts} setPosts={setPosts} user={user} token={token} />
    </Route>

    <Route path="/account">
      <Account 
        user={user} setUser={setUser} 
        token={token} setToken={setToken}
      />
    </Route>


  </main>
}

export default App;