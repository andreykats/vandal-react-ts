import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <div className="title">
                Welcome you stinkin' Vandal
            </div>
            <div>
                <Link to="/contact">Contact</Link>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;