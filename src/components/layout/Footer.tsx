import { FC } from 'react';
import '../../css/Footer.scss';

const Footer: FC = () =>
    <footer className="text-lg-start principal-font">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#18161cdd" fillOpacity="1" d="M0,288L80,277.3C160,267,320,245,480,250.7C640,256,800,288,960,293.3C1120,299,1280,277,1360,266.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#18161cbb" fillOpacity="1" d="M0,288L80,293.3C160,299,320,309,480,309.3C640,309,800,299,960,282.7C1120,267,1280,245,1360,234.7L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#18161c11" fillOpacity="1" d="M0,288L80,266.7C160,245,320,203,480,202.7C640,203,800,245,960,266.7C1120,288,1280,288,1360,288L1440,288L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path></svg>
        <div className="sumary row mx-0">
            <div className="col-md-4 col-12 contact-us">
                <div>
                    <i className="material-icons">
                        help_outline
                                </i>
                    <p> Contáctanos </p>
                </div>
                <div>
                    <i className="material-icons">
                        perm_phone_msg
                                </i>
                    <p>
                        Llámanos
                                    <br />
                        <span>+57 310 555 44 33</span>
                    </p>

                </div>
                <div>
                    <i className="material-icons">
                        mail_outline
                                </i>
                    <p>
                        Envíanos un correo
                                    <br />
                        <span>optica@optica.com</span>
                    </p>
                </div>
            </div>
            <div className="col-md-8 col-12 row mx-0 categories text-center">
                <ul className="list-unstyled col-6 col-md-4 col-sm-6">
                    <h5>Tienda</h5>
                    <li>
                        <a href="#!">Gafas de hombre</a>
                    </li>
                    <li>
                        <a href="#!">Gafas de mujer</a>
                    </li>
                    <li>
                        <a href="#!">Gafas de niños</a>
                    </li>
                </ul>
                <ul className="list-unstyled col-6 col-md-4 col-sm-6">
                    <h5>Marcas de tienda</h5>
                    <li>
                        <a href="#!">Ray Ban</a>
                    </li>
                    <li>
                        <a href="#!">Oakley</a>
                    </li>
                    <li>
                        <a href="#!">Prada</a>
                    </li>
                    <li>
                        <a href="#!">Muse</a>
                    </li>
                    <li>
                        <a href="#!">Gucci</a>
                    </li>
                    <li>
                        <a href="#!">Carollina Herrera</a>
                    </li>
                </ul>
                <ul className="list-unstyled col-6 col-md-4 col-sm-6">
                    <h5>Acerca de nosotros</h5>
                    <li>
                        <a href="#!">Equipo</a>
                    </li>
                    <li>
                        <a href="#!">Blog</a>
                    </li>
                </ul>
            </div>
        </div>

        <div className="social-networks">
            <span className="material-icons facebook">
                facebook
                    </span>
            <span className="material-icons instagram">
                facebook
                    </span>
            <span className="material-icons twitter">
                facebook
                    </span>
            <span className="material-icons youtube">
                facebook
                    </span>
        </div>

        <div className="politics-and-copyright row mx-0 justify-content-between">
            <div className="politics">
                <a href="/">Políticas de privacidad</a>
                <a href="/">Términos de uso</a>
                <a href="/">Políticas de cookies</a>
                <a href="/">Políticas de compras</a>
            </div>
            <div className="copyright">
                <a href="https://mdbootstrap.com/">© MDBootstrap.com</a>
            </div>
        </div>
    </footer>

export default Footer;
