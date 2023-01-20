import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <div className="title">
                Welcome you stinkin' vandal
            </div>
            <div className="heading">
                <Link to="/about">About Us</Link>
                <span> | </span>
                <Link to="/contact">Contact</Link>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout