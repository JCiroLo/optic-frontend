import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Catalogue from './components/pages/Catalogue';
import TestGlasses from './components/pages/TestGlasses';
import Management from './components/pages/Management';
import DetailMount from './components/pages/DetailMount';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.scss';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const App = () =>
  <Router>
    <Navbar />
    <div className='Content' >
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/test' component={TestGlasses} />
        <Route exact path="/management" component={Management} />
        <Route exact path="/catalogo" component={Catalogue} />
        <Route exact path='/other' component={() => <div style={{ margin: '66vh 0' }}> </div>} />
        <Route exact path='/detail/:id?' component={DetailMount} />
      </Switch>
    </div>
    <Footer />
  </Router>


export default App;