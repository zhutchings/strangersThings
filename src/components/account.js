import React, { useState } from "react";

const Account = ({user, setUser, token, setToken}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registering, setRegistering] = useState(false);


    
    const loginUser = async(username, password) => {
        const login = await fetch('https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/users/login', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: {
                username: username,
                password: password
              }
            })
          })

        const response = await login.json();
        console.log(response)

        const user = await fetch('https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/users/me', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${response.data.token}`
            }
        })

        const responseTwo = await user.json();
        console.log(responseTwo)
        return {
            user: responseTwo.data,
            token: response.data.token
        }  
    }
      

    const registerUser = async(username, password) => {
        const registration = await fetch('https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/users/register', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user: {
                username: username,
                password: password
              }
            })
          })
        const response = await registration.json();
        console.log(response)

        const user = await fetch('https://strangers-things.herokuapp.com/api/2204-FTB-MT-WEB-PT/users/me', {
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${response.data.token}`
            }
        })

        const responseTwo = await user.json();
        console.log(responseTwo)
        return {
            user: responseTwo.data,
            token: response.data.token
        }
    }

    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (registering) {
          const {user, token} = await registerUser(username, password)
          setUser(user);
          setToken(token);
        } else {
          const {user, token} = await loginUser(username, password)
          setToken(token);
          setUser(user);
        }
    }
    
    const handleLogout = () => {
        setUser(false);
        setToken('');
    }
    
    const toggleRegistration = () => {
        setRegistering(!registering);
    }
    
    return <>
      {
        (user && token) ?
        <>
          <h1>User Profile</h1>
          <p>Hi {user.username} is logged in</p>
          <button onClick={handleLogout}>Logout</button>
        </> :
        <>
          <h1>{registering ? "Registration" : "Login"}</h1>
          <form onSubmit={handleSubmit}>
            <input
              onChange={(event) => setUsername(event.target.value) }
              required
              name="username"
              type="text"
              placeholder="username"
              value={username}
            ></input>
            <input
              onChange={(event) => setPassword(event.target.value) }
              required
              name="password"
              type="password"
              placeholder="password"
              value={password}
            ></input>
            <button type="submit">Submit</button>
          </form>
            <button onClick={toggleRegistration} >Register/Login toggle</button>
        </>
    }
      </>
}  

export default Account;



