import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import Slider from "react-slick";

import Pic1 from '../../testPics/carousel-1.jpg';
import Pic2 from '../../testPics/carousel-2.jpg';
import Pic3 from '../../testPics/carousel-3.jpg';
import wGlass from '../../testPics/women-glass.jpg';
import mGlass from '../../testPics/men-glass.jpg';
import cGlass from '../../testPics/children-glass.jpg';

import '../../css/Home.scss';

const mounts = [
    { id: 1, title: 'Gucci T2', price: 50000 },
    { id: 2, title: 'Torus 3k', price: 45900 },
    { id: 3, title: 'Arnette', price: 20000 },
    { id: 4, title: 'Carolina Herrera', price: 149900 },
    { id: 5, title: 'Polaroid', price: 75000 },
    { id: 6, title: 'Oakley', price: 40000 },
    { id: 7, title: 'Gucci Kl', price: 500000 },
]

const Home = () => {
    document.title = 'Optica'

    var bestSellsSettings = {
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: false,
                }
            }
        ]
    };

    return (
        <div className="Home">
            <Carousel
                autoPlay
                stopOnHover
                showStatus={false}
                showThumbs={false}
                infiniteLoop={true}
            >
                <div className="carousel-image" style={{ backgroundImage: `url(${Pic1})` }} />
                <div className="carousel-image" style={{ backgroundImage: `url(${Pic2})` }} />
                <div className="carousel-image" style={{ backgroundImage: `url(${Pic3})` }} />
            </Carousel>

            <h1 className="principal-font title principal-font">ELIGE TU ESTILO</h1>

            <div className="glass-categories principal-font">
                <div className="glasses">
                    <div className="image" style={{ backgroundImage: `url(${mGlass})` }} />
                    <span>Para hombre</span>
                </div>
                <div className="glasses">
                    <div className="image" style={{ backgroundImage: `url(${wGlass})` }} />
                    <span>Para mujer</span>
                </div>

                <div className="glasses">
                    <div className="image" style={{ backgroundImage: `url(${cGlass})` }} />
                    <span>Para niños</span>
                </div>
            </div>

            <h1 className="principal-font title principal-font">MEJORES VENTAS</h1>

            <Slider
                {...bestSellsSettings}
                className="slide-shop"
            >
                {mounts.map(mount =>
                    <React.Fragment key={mount.id}>
                        <small className="principal-font">{mount.title}</small>
                        <img
                            key={mount.id}
                            src={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/ex${mount.id}.png?alt=media&token=8f686261-a1d4-41f2-9d84-4036f2d1d67f`}
                            alt={`montura${mount.id}`}
                        />

                        <h5>${new Intl.NumberFormat("de-DE").format(mount.price)}</h5>
                    </React.Fragment>
                )}
            </Slider>

            <h1 className="principal-font title principal-font">CON LAS MARCAS MAS POPULARES</h1>

            <div className="brands">
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2020/03/Ray-Ban-logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2020/03/Oakley-logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2020/01/Prada-Logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://logoeps.com/wp-content/uploads/2013/04/muse-vector-logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/1200px-1960s_Gucci_Logo.svg.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2019/12/Carolina-Herrera-logo.png)` }} />
            </div>

        </div >
    )
}

export default Home
