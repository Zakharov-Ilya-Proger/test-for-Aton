import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./styles/Login.css"

function Login() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.clear()
        try {
            const response = await axios.post('http://127.0.0.1:8000/login', {
                login,
                password,
            });
            const { jwt: token } = response.data;
            localStorage.setItem('token', token);
            navigate('/info');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Login</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <label className="login-label">
                    <input
                        placeholder="login"
                        className="login-input"
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </label>
                <br />
                <label className="login-label">
                    <input
                        placeholder="password"
                        className="login-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button className="login-button" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;