import { FC, useState, /* useCallback */ } from 'react'
import { Link, NavLink } from 'react-router-dom'
import classnames from 'classnames'

//import useEventListener from '../utils/useEventListener'
import ButtonToggler from './ButtonToggler';
import '../../css/Navbar.scss'
import navBrand from '../../testPics/nav_brand.png'

const Navbar: FC = () => {
    const [toggleNav, settoggleNav] = useState(false);
    //const [scrollCoord, setScrollCoord] = useState(0);

    /* const scrollHandler = useCallback((event) => {
        setScrollCoord(event.target.scrollingElement.scrollTop)
    }, [setScrollCoord]
    ) */

    const toggleCollpase = () => {
        !toggleNav ?
            document.body.classList.add("fix-overflow") :
            document.body.classList.remove("fix-overflow");
        settoggleNav(!toggleNav);
    }

    //useEventListener('scroll', scrollHandler)

    return (
        <nav className={
            classnames("navbar navbar-expand-md fixed-top r-font", {
                /* "scrolling": scrollCoord > 100, */
                "collapsed": toggleNav
            })
        } >
            <Link className="navbar-brand principal-font" to="/">
                <img src={navBrand} alt="nav_brand" />
            </Link>

            {/* Search bar */}

            <ButtonToggler
                className="navbar-toggler"
                state={toggleNav}
                onClick={toggleCollpase}
            />

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
                        to="/test"
                        className="btn-premium"
                        activeClassName="active"
                        onClick={() => toggleNav && toggleCollpase()}
                    >
                        <i className="material-icons">face</i> <span>Prueba tus gafas</span>
                    </NavLink>
                    <NavLink
                        className="nav-brand"
                        to="/"
                        onClick={() => toggleNav && toggleCollpase()}
                    ><img src={navBrand} alt="favicon" /></NavLink>
                </div>
            </div>
        </nav >
    )
}

export default Navbar;
