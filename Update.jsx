import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Update = () => {
    const [event, setEvent] = useState({
        Name: "",
        Desc: "",
        Cover: null,
        Date: "",
    });

    const location = useLocation();
    const navigate = useNavigate();

    const eventId = location.pathname.split("/")[2];

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`http://localhost:3300/events/${eventId}`);
                setEvent(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvent();
    }, [eventId]);

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

            await axios.put(`http://localhost:3300/events/${eventId}`, formData, {
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
        <div className="form">
            <h1>Update the Event</h1>
            <input type="text" placeholder="Name" name="Name" value={event.Name} onChange={handleChange} />
            <input type="text" placeholder="Desc" name="Desc" value={event.Desc} onChange={handleChange} />
            <input type="file" name="Cover" onChange={handleChange} />
            {event.Cover && (
                <img src={URL.createObjectURL(event.Cover)} alt="Event Cover" />
            )}
            <input type="date" placeholder="Date" name="Date" value={event.Date} onChange={handleChange} />
            <button onClick={handleClick}>Update</button>
        </div>
    );
};

export default Update;
