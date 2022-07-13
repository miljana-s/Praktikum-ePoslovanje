import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";


class TopMenuProperties {
    currentMenuType: "administrator" | "visitor" = "visitor";
}

export default class TopMenu extends React.Component<TopMenuProperties> {
    render() {
        if (this.props.currentMenuType === "visitor") {
            return (
                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/">Home</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/categories">Categories</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/contact">Contact</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/login">Admin login</Link>
                    </Nav.Item> 
 
                </Nav>
            );
        }

        if (this.props.currentMenuType === "administrator") {
            return (
                <Nav className="justify-content-center">
                    <Nav.Item>
                        <Link className="nav-link" to="/">Home</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/categories">Categories</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/articles">Add Article</Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Link className="nav-link" to="/administrator/logout">Logout</Link>
                    </Nav.Item>
                </Nav>
            ); 
        }
    }
}


