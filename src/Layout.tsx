import { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import { OpenAPI } from './client';

export default function Layout(): JSX.Element {
    const [isLoggedIn, setLoggedIn] = useState<boolean>()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }, [])

    const logout = () => {
        localStorage.removeItem('token')
        OpenAPI.TOKEN = ""
    }

    return (
        <div>
            <div className="title">
                VANDAL
            </div>
            <div className="heading">
                <Link to="/">Home</Link>
                <span> | </span>
                <Link to="/about">About Us</Link>
                <span> | </span>
                {isLoggedIn &&
                    <span>
                        <Link to="/account">Account</Link>
                        <span> | </span>
                        <a href="/" onClick={logout}>Logout</a>
                    </span>
                }
                {!isLoggedIn &&
                    <Link to="/login">Login</Link>
                }
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}