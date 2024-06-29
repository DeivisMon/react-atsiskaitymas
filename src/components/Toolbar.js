import React, { useState, useEffect } from 'react';
import {NavLink, Link, useNavigate} from 'react-router-dom';



const Toolbar = ({ favoritesCount }) => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            setLoggedInUser(user);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        navigate('/');
    };
    const username = loggedInUser ? loggedInUser.username || loggedInUser.name || loggedInUser.userName : null;
    return (
        <>
            <div className='toolbar'>
                <NavLink className='toolbarLink' to="/posts/">All posts</NavLink>

                {loggedInUser ? (
                    <div className="userInfo" style={{textAlign: 'center'}}>
                        <span>Welcome, {loggedInUser.name}</span>
                        <button className='logoutBtn' onClick={handleLogout}>Logout</button>
                        <div style={{display:"flex"}}>
                            <NavLink className="loginLinks" to='/favorites'><p>Favorites: {favoritesCount}</p></NavLink>
                            <span style={{marginRight:"7px"}}>|</span>
                            <NavLink className="loginLinks" to={`/posts/${username}`}>My Posts</NavLink>
                        </div>

                    </div>
                ) : (
                    <div>
                        <Link className="loginLinks" to="/">Login</Link>
                        <span>| </span>
                        <Link className="loginLinks" to="/register">Register</Link>
                    </div>
                )}

            </div>
        </>
    );
};

export default Toolbar;