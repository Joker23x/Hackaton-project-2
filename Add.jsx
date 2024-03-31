import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
    const [event, setEvent] = useState({
        Name: "",
        Desc: "",
        Cover: null,
        Date: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.name === 'Cover') {
            setEvent(prev => ({ ...prev, [e.target.name]: e.target.files[0] }));
        } else {
            setEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
    };

    const handleClick = async () => {
        try {
            const formData = new FormData();
            formData.append('Name', event.Name);
            formData.append('Desc', event.Desc);
            formData.append('Date', event.Date);
            if (event.Cover) {
                formData.append('Cover', event.Cover);
            }

            await axios.post("http://localhost:3300/events", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='form'>
            <h1>Add New Event</h1>
            <input type="text" placeholder='Name' onChange={handleChange} name="Name" />
            <input type="text" placeholder='Desc' onChange={handleChange} name="Desc" />
            <input type="file" onChange={handleChange} name="Cover" />
            {event.Cover && (
                <img src={URL.createObjectURL(event.Cover)} alt="Event Cover" />
            )}
            <input type="date" placeholder='Date' onChange={handleChange} name="Date" />
            <button onClick={handleClick}>Add</button>
        </div>
    );
};

export default Add;

