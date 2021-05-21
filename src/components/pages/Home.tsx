import { FC, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Slider from "react-slick";

import SlickCustomArrow from '../layout/SlickCustomArrow';
import { getAllGlasses } from '../utils/Actions';
import Frame from '../layout/Frame';
import { FrameType } from '../utils/Consts';

import Pic1 from '../../testPics/carousel-1.jpg';
import Pic2 from '../../testPics/carousel-2.jpg';
import Pic3 from '../../testPics/carousel-3.jpg';
import wGlass from '../../testPics/women-glass.jpg';
import mGlass from '../../testPics/men-glass.jpg';
import cGlass from '../../testPics/children-glass.jpg';
import sliderBackground from '../../testPics/sliderBackground.jpg';

import '../../css/Home.scss';

const Home: FC = () => {
    const [mounts, setMounts] = useState<FrameType[]>([]);

    useEffect(() => {
        document.title = 'Optica';

        (async () => {
            const { stateAction, allGlasses } = await getAllGlasses();
            if (stateAction) setMounts(allGlasses);
        })()
        return () => { }
    }, [])

    const bestSellsSettings = {
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        prevArrow: <SlickCustomArrow styles={{ left: '0', transform: 'rotate(180deg)' }} />,
        nextArrow: <SlickCustomArrow styles={{ right: '0' }} />,
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
        <div className="Home mb-5">
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

            <h1 className="principal-font title principal-font">... O NUESTRAS MARCAS MAS POPULARES</h1>

            <div className="brands" style={{ backgroundImage: `url(${sliderBackground})` }}>
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2020/03/Ray-Ban-logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2020/03/Oakley-logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2020/01/Prada-Logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://logoeps.com/wp-content/uploads/2013/04/muse-vector-logo.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/1200px-1960s_Gucci_Logo.svg.png)` }} />
                <div className="image" style={{ backgroundImage: `url(https://1000marcas.net/wp-content/uploads/2019/12/Carolina-Herrera-logo.png)` }} />
            </div>

            <h1 className="principal-font title principal-font">MEJORES VENTAS</h1>

            <Slider
                {...bestSellsSettings}
                className="best-sells"
            >
                {mounts.map((frame, index) =>
                    <Frame
                        className="w-100"
                        key={index}
                        image={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                        frameInfo={frame}
                    />
                )}
            </Slider>

            <h1 className="principal-font title principal-font">LOS MEJORES DESCUENTOS</h1>

            <Slider
                {...bestSellsSettings}
                className="best-offers"
                style={{ marginBottom: '150px' }}
            >
                {mounts.map((frame, index) =>
                    frame.discount > 0 && <Frame
                        className="w-100"
                        key={index}
                        image={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                        frameInfo={frame}
                    />
                )}
            </Slider>
        </div >
    )
}

export default Home
