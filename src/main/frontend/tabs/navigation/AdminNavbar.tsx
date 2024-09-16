import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './sidebar.css';
import { IconContext } from 'react-icons';
import {AdminSidebarData} from "./AdminSidebarData";
import {AiOutlineClose} from 'react-icons/ai';
import logo from "./logo.png"

function Navbar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
    return (
        <div className="sticky-nav" style={{zIndex: 9999}}>
        <>
            <IconContext.Provider value={{ color: 'white' }}>
                <div className='navbar'>
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                    <h1 style={{color:"white", paddingLeft:"33%", paddingRight:"33%"}}>
                        <a href="https://www.zeltverleiherfurt.de" target={"_blank"}>
                            Zeltverleih Erfurt
                        </a>
                    </h1>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'} style={{zIndex: "1"}}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className={"nav-text"}>
                            <a href="https://www.zeltverleiherfurt.de" target={"_blank"}>
                                <img src={logo} style={{height:20, width:20}}/>
                                <span style={{fontSize:20}}>Internetseite</span>
                            </a>
                        </li>
                        {AdminSidebarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className={sidebar ? 'nav-menu-div active' : 'nav-menu-div'} style={{zIndex: "1"}}>
                    <Link to='#' className='menu-bars'>
                        <AiOutlineClose onClick={showSidebar} style={{paddingTop:"75%"}}/>
                    </Link>
                </div>
            </IconContext.Provider>
        </>
        </div>

    );
}

export default Navbar;
