import React from 'react';
import { useAppContext } from '../configs/AppContext';
import '../styles/UserCard.css';

export default function UserCard() {
    const { user } = useAppContext();
    return (
        <div className='Usercard'>
            {(user === null) ? (<h2>No User Found</h2>) :
                <>
                    <h2>User Card</h2>
                    <img src={user.img} alt="User" />
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Roll No: {user.rollNo}</p>
                </>
            }
        </div>
        );
}