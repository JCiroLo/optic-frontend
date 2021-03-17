import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Catalogue from './components/pages/Catalogue';
import TestGlasses from './components/pages/TestGlasses';
import Management from './components/pages/Management';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";


export default function App() {

  return (
    <Router>
      <Navbar />
      <div className='Content'>
        <Route exact path='/' component={Home} />
        <Route exact path='/probar' component={TestGlasses} />
        {/* <Route exact path="/management" component={Management} /> */}
        <Route exact path="/catalogo" component={Catalogue} />
      </div>
      <Footer />
    </Router>
  )
};
