import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import classnames from 'classnames'

import useEventListener from '../utils/useEventListener'
import '../../css/Navbar.scss'
import favicon from '../../testPics/favicon.png'

const Navbar = () => {
    const [toggleNav, settoggleNav] = React.useState(false)
    const [scrollCoord, setScrollCoord] = React.useState(0)

    const scrollHandler = React.useCallback(
        (event) => {
            setScrollCoord(event.target.scrollingElement.scrollTop)
        }, [setScrollCoord]
    )

    useEventListener('scroll', scrollHandler)

    return (
        <nav className={
            classnames("navbar navbar-expand-md fixed-top r-font", {
                'scrolling': scrollCoord > 100,
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
                onClick={() => settoggleNav(!toggleNav)}
            >
                <span className="material-icons">{toggleNav ? 'close' : 'menu'}</span>
            </button>

            <div className="navbar-collapse">
                <div className="ml-auto nav-links navbar-nav principal-font">
                    <NavLink to="/" exact activeClassName="active"><span>Incicio</span></NavLink>
                    <NavLink to="/catalogo" activeClassName="active"><span>Catálogo</span></NavLink>
                    {/* <NavLink to="/other" activeClassName="active"><span>Otras cosas</span></NavLink> */}
                    <NavLink to="/probar" className="btn-premium" activeClassName="active"><span>Prueba tus gafas</span></NavLink>
                </div>
            </div>
        </nav >
    )
}

export default Navbar
