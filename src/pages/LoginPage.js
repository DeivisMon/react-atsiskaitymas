import React, { useState } from 'react';
import http from '../plugins/http';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await http.post('/login', {
                name: username,
                password
            });

            if (response && response.data && response.data.success) {
                const { secretKey, message } = response.data;
                const loggedInUser = {
                    name: username,
                    secretKey,
                    message
                };
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
                navigate('/posts');
                window.location.reload(); //kazkur klaida, nerodo kas pasijungia, be page reload
            } else {
                setError(response?.data?.message);
                setTimeout(() => {
                    setError('');
                }, 2000);
            }
        } catch (err) {
            console.error('Error logging in:', err);
            setError('An error occurred during login');
        }
        setUsername('');
        setPassword('');
    };

    return (
        <div >
            <h2>Login</h2>
            <form className="loginForm" onSubmit={handleLogin}>
                <label htmlFor="username">Username</label>
                <input
                    className='loginInput'
                    type="text"
                    placeholder="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    className='loginInput'
                    type="password"
                    placeholder="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p style={{marginLeft:'10px', color: 'indianred', fontSize:'18px' }}>{error}</p>}
                <span style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'black', marginLeft: '10px' }}>
                    <input id='check' type="checkbox" />Stay signed in
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'white', marginLeft: '10px' }}>
                    <p>Not a member?</p><Link to="/register/" className='registerLink'>Register</Link>
                </span>
                <button id='loginBtn' type='submit'>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
