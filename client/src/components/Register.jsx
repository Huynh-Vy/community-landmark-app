import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import React, { useState } from 'react';
import './register.scss';

Register.propTypes = {
   
};

function Register(props) {
    const { setShowRegister } = props;
    const [ success, setSuccess ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            username: name,
            email, 
            password,
        }

        try {
            await axios.post("http://127.0.0.1:8080/api/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (error) {
            setSuccess(false);
            setError(true);
        }
    }
    return (
        <div className="register-container">
            <div className="logo">
                <LocationOnIcon />
                Community Landmark
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" onChange={(e) => setName(e.target.value)}/>
                <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" className="registerBtn">Register</button>
                {success && (<span className="success">Successful. You can login now!</span>)}
                {error && (<span className="failure">Something went wrong!</span>)}
            </form>
            <CancelIcon className="registerCancel" onClick={() => setShowRegister(false)} />
        </div>
    );
}

export default Register;