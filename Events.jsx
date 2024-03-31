// Events.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get("http://localhost:3300/events");
                setEvents(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchEvents();
    }, []);

    const handleDelete = async (eventId) => {
        try {
            await axios.delete(`http://localhost:3300/events/${eventId}`);
            setEvents(events.filter(event => event.id !== eventId));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h1>OSU Events</h1>
            <div className="events">
                {events.map(event => (
                    <div className="event" key={event.id}>
                        {event.Cover && <img src={`http://localhost:3300${event.Cover}`} alt="" />}
                        <h2>{event.Name}</h2>
                        <p>{event.Desc}</p>
                        <span>{event.Date}</span>
                        <button className="delete" onClick={() => handleDelete(event.id)}>Delete</button>
                        <button className="update"><Link to={`/update/${event.id}`}>Update</Link></button>
                    </div>
                ))}
            </div>
            <button className="addHome">
                <Link to="/add"> Add new Event</Link>
            </button>
        </div>
    );
};

export default Events;
