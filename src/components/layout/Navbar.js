import React, { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import classnames from 'classnames'

import useEventListener from '../utils/useEventListener'
import '../../css/Navbar.scss'
import favicon from '../../testPics/favicon.png'

const Navbar = () => {
    const [toggleNav, settoggleNav] = React.useState(false);
    const [scrollCoord, setScrollCoord] = React.useState(0);

    const scrollHandler = React.useCallback(
        (event) => {
            setScrollCoord(event.target.scrollingElement.scrollTop)
        }, [setScrollCoord]
    )

    const toggleCollpase = () => {
        !toggleNav ? document.body.classList.add("fix-overflow") : document.body.classList.remove("fix-overflow");
        settoggleNav(!toggleNav);
    }

    useEventListener('scroll', scrollHandler)

    return (
        <nav className={
            classnames("navbar navbar-expand-md fixed-top r-font", {
                "scrolling": scrollCoord > 100,
                "collapsed": toggleNav
            })
        } >
            <Link className="navbar-brand principal-font" to="/">
                <img src={favicon} alt="favicon" />
                    Optic
            </Link>

            {/* Search bar */}

            <button
                className="navbar-toggler toggler"
                onClick={() => toggleCollpase()}
            >
                <span className="material-icons">{toggleNav ? 'close' : 'menu'}</span>
            </button>

            <div className="navbar-collapse">
                <div className="nav-links navbar-nav principal-font">
                    <NavLink
                        exact
                        to="/"
                        activeClassName="active"
                        onClick={() => toggleNav && toggleCollpase()}
                    ><i className="material-icons">home</i> <span>Incicio</span></NavLink>
                    <NavLink
                        to="/catalogo"
                        activeClassName="active"
                        onClick={() => toggleNav && toggleCollpase()}
                    ><i className="material-icons">menu_book</i> <span>Catálogo</span></NavLink>
                    <NavLink
                        to="/other"
                        activeClassName="active"
                        onClick={() => toggleNav && toggleCollpase()}
                    ><i className="material-icons">info</i> <span>Otras cosas</span></NavLink>
                    <NavLink
                        to="/probar"
                        className="btn-premium"
                        activeClassName="active"
                        onClick={() => toggleNav && toggleCollpase()}
                    >
                        <span>Prueba tus gafas</span>
                    </NavLink>
                    <NavLink
                        className="nav-brand"
                        to="/"
                        onClick={() => toggleNav && toggleCollpase()}
                    ><img src={favicon} alt="favicon" /> Optic</NavLink>
                </div>
            </div>
        </nav >
    )
}

export default Navbar
