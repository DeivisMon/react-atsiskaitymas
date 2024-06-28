import React, { useState } from 'react';
import http from '../plugins/http';
import {Link, useNavigate} from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [passwordOne, setPasswordOne] = useState('');
    const [passwordTwo, setPasswordTwo] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (passwordOne !== passwordTwo) {
            setError('Passwords do not match');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        try {
            const response = await http.post('/createaccount', {
                name: username,
                passwordOne,
                passwordTwo
            });
            if (response && response.data && response.data.success) {
                navigate('/');
            } else {
                setError(response?.data?.message);
                setTimeout(() => {
                    setError('');
                }, 2000);
            }
        } catch (err) {
            console.error('Error registering:', err);
            setError('An error occurred during registration');
        }
    };


    return (
        <div >
            <h2>Register</h2>
            <form className="loginForm" onSubmit={handleRegister}>
                <label htmlFor="username">Create Username</label>
                <input
                    className='loginInput'
                    type="text"
                    placeholder="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="passwordOne">Create Password</label>
                <input
                    className='loginInput'
                    type="password"
                    placeholder="password"
                    name="passwordOne"
                    value={passwordOne}
                    onChange={(e) => setPasswordOne(e.target.value)}
                />
                <label htmlFor="passwordTwo">Repeat Password</label>
                <input
                    className='loginInput'
                    type="password"
                    placeholder="repeat password"
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={(e) => setPasswordTwo(e.target.value)}
                />
                {error && <p style={{marginLeft:'10px', color: 'indianred', fontSize:'18px' }}>{error}</p>}
                <span
                    style={{display: 'flex', alignItems: 'center', gap: '15px', color: '#d2cece', marginLeft: '10px'}}>
                    <input id='check' type="checkbox"/>I Agree to Terms & Conditions
                </span>
                <span style={{display: 'flex', alignItems: 'center', gap: '15px', color: 'white', marginLeft: '10px'}}>
                    <p>Already A Member?</p><Link to="/" className='registerLink'>Login</Link>
                </span>
                <button id='loginBtn' type='submit'>Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;
