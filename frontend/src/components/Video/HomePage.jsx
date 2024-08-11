import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
    const [input, setInput] = useState("");
const navigate = useNavigate();

    const submitHandler = () => {
     navigate(`/room/${input}`);
    }
  return (
 <div>
    <div>
    <input 
    value={input}
    onChange={(e) => setInput(e.target.value)}
    type='text' 
    placeholder='Enter your name'
    className="custom-input"
/>
<button onClick={submitHandler} className="custom-button">Join</button>

    </div>
 </div>
)
}

export default Homepage