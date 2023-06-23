import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import React, { useState } from 'react';
import './login.scss';

Login.propTypes = {
    
};

function Login(props) {
    const { setShowLogin, myStorage, setCurrentUser } = props;
    const [ error, setError ] = useState(false);
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            email, 
            password,
        }

        try {
            const res = await axios.post("http://127.0.0.1:8080/api/users/login", user);
            myStorage.setItem("user", res.data.user);
            setCurrentUser(res.data.user);
            setShowLogin(false);
            setError(false);
            
        } catch (error) {
            setError(true);
            setShowLogin(true);
        }
    }
    return (
        <div className="login-container">
            <div className="logo">
                <LocationOnIcon />
                Community Landmark
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="loginBtn">Login</button>
              
                {error && (<span className="failure">Something went wrong!</span>)}
            </form>
            <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
        </div>
    );
}

export default Login;