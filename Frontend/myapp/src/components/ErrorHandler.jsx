import React from 'react';
import { useAppContext } from '../configs/AppContext';
import '../styles/Error.css';

export default function ErrorHandler() {
    const { err } = useAppContext();
    return (
        <>
            {err && (
                <div className={"error " + err.type}>
                    {
                        err.type === "success" ? (
                            <span role="img" aria-label="success">✅</span>
                        ) : (
                            <span role="img" aria-label="danger">❌</span>
                        )
                    }
                    <p>{err.message}</p>
                </div>
            )}
        </>
    );
}