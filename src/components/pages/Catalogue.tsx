import { useState, useEffect, FC, ChangeEvent, FormEvent } from 'react';
import classnames from 'classnames';

import { formatText, getAllGlasses } from '../utils/Actions';
import { COLORS, MATERIALS, SHAPES, FrameType } from '../utils/Consts';
import Input from '../layout/Input';
import LoadingScreen from '../layout/LoadingScreen';
import Frame from '../layout/Frame';
import Error from '../layout/Error';
import ButtonToggler from '../layout/ButtonToggler';

import '../../css/Catalogue.scss';

const Catalogue: FC = () => {
    const [mounts, setMounts] = useState<FrameType[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortingMode, setSortingMode] = useState('recent');
    const [searchQuery, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<FrameType[]>([]);
    const [isSearch, setIsSearch] = useState(false);
    const [filterMode, setFilterMode] = useState({ mode: 'none', choice: 'none' });
    const [toggleFilters, setTogglerFilters] = useState<boolean>(
        !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    useEffect(() => {
        document.title = 'Catálogo';
        window.scrollTo(0, 0);
        (async () => {
            const { stateAction, allGlasses } = await getAllGlasses();
            if (stateAction) {
                setMounts(allGlasses);
            }
            setLoading(false);
        })()
        return () => { }
    }, [])

    /* Search */

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const submitSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchQuery.trim().length === 0) { deleteFilter(); return }

        const arrSearch = searchQuery.trim().split(' ');

        let results: FrameType[] = [];

        arrSearch.forEach(search => {
            results = mounts.filter(frame => {
                if (verifyMatch(frame.brand, search) || verifyMatch(frame.material, search) ||
                    verifyMatch(frame.shape, search) || verifyMatch(frame.color, search)) {
                    return frame;
                }
                return null;
            })
        })

        setIsSearch(true);
        setSearchResults(results);
    }

    /* Filters */

    const verifyMatch = (outerString: string, innerString: string) =>
        outerString.trim().toLowerCase().includes(innerString.trim().toLowerCase());

    const filterByColor = (color: string) => {
        setSearchResults(mounts.filter(frame => frame.color === color));
        setIsSearch(true);
        setFilterMode({ mode: 'color', choice: color })
    }

    const filterByMaterial = (material: string) => {
        setSearchResults(mounts.filter(frame => frame.material === material));
        setIsSearch(true);
        setFilterMode({ mode: 'material', choice: material })
    }

    const filterByShape = (shape: string) => {
        setSearchResults(mounts.filter(frame => frame.shape === shape));
        setIsSearch(true);
        setFilterMode({ mode: 'shape', choice: shape })
    }

    const deleteFilter = () => {
        setSearchResults([]);
        setIsSearch(false);
        setFilterMode({ mode: 'none', choice: 'none' });
    }

    /* Sorter */

    const sorMounts = (mode: string) => {
        setSortingMode(mode);

        if (isSearch) {
            switch (mode) {
                case 'recent':
                    searchResults.sort((x, y) => {
                        let a = new Date(x.updatedAt);
                        let b = new Date(y.updatedAt);
                        return a.getMilliseconds() - b.getMilliseconds();
                    })
                    break;
                case 'popular':
                    alert('Ordenando por pularidad');
                    break;
                case 'lowToHigh':
                    searchResults.sort((x, y) => {
                        return (x.price * (1 - x.discount / 100)) - (y.price * (1 - y.discount / 100));
                    })
                    break;
                case 'highToLow':
                    searchResults.sort((x, y) => {
                        return (y.price * (1 - y.discount / 100)) - (x.price * (1 - x.discount / 100));
                    })
                    break;
                case 'discount':
                    searchResults.sort((x, y) => {
                        return y.discount - x.discount;
                    })
                    break;
            }
        }
        else {
            switch (mode) {
                case 'recent':
                    mounts.sort((x, y) => {
                        let a = new Date(x.updatedAt);
                        let b = new Date(y.updatedAt);
                        return a.getMilliseconds() - b.getMilliseconds();
                    })
                    break;
                case 'popular':
                    alert('Ordenando por pularidad');
                    break;
                case 'lowToHigh':
                    mounts.sort((x, y) => {
                        return (x.price * (1 - x.discount / 100)) - (y.price * (1 - y.discount / 100));
                    })
                    break;
                case 'highToLow':
                    mounts.sort((x, y) => {
                        return (y.price * (1 - y.discount / 100)) - (x.price * (1 - x.discount / 100));
                    })
                    break;
                case 'discount':
                    mounts.sort((x, y) => {
                        return y.discount - x.discount;
                    })
                    break;
            }
        }

    }

    /* Layout */


    return (
        <div className="Catalogue row mx-0">
            {loading && <LoadingScreen />}

            <div className={classnames("filters principal-font", { 'active': !toggleFilters })}>
                <ButtonToggler
                    className="btn-open-filters-mobile"
                    state={toggleFilters}
                    onClick={() => setTogglerFilters((prev) => !prev)}
                />
                <p style={{ marginTop: '1em' }}><strong>Filtrar por color</strong></p>
                <div className="colors row mx-0">
                    {COLORS.map(({ id, color, style }) =>
                        <span
                            key={id}
                            className="col"
                            onClick={() => filterByColor(color)}
                            style={style}
                        />
                    )}
                    <span
                        className="material-icons col"
                        onClick={deleteFilter}
                    >close</span>
                </div>
                <hr />
                <p className=""><strong>Filtrar por material</strong></p>
                <div className="materials d-flex secondary-font">
                    {MATERIALS.map(({ id, material }) =>
                        <div key={id} onClick={() => filterByMaterial(material)}>
                            <span>{formatText(material)}</span>
                            <strong>({mounts.filter(frame => frame.material === material).length})</strong>
                        </div>
                    )}
                    <div onClick={deleteFilter}>
                        <span>Todos</span>
                        <strong>({mounts.length})</strong>
                    </div>
                </div>
                <hr />
                <p className=""><strong>Filtrar por forma</strong></p>
                <div className="styles d-flex secondary-font">
                    {SHAPES.map(({ id, shape }) =>
                        <div key={id} onClick={() => filterByShape(shape)}>
                            <span>{formatText(shape)}</span>
                            <strong>({mounts.filter(frame => frame.shape === shape).length})</strong>
                        </div>
                    )}
                    <div onClick={deleteFilter}>
                        <span>Todos</span>
                        <strong>({mounts.length})</strong>
                    </div>
                </div>
            </div>
            <div className={classnames("shop row", { 'active': !toggleFilters })}>
                <div className="filter-actions col-12 row secondary-font">
                    <ButtonToggler
                        className="btn-open-filters"
                        state={toggleFilters}
                        onClick={() => setTogglerFilters((prev) => !prev)}
                    />

                    <form className="search-bar" noValidate onSubmit={submitSearch}>
                        <Input
                            id="searchbar"
                            formType="input"
                            inputType="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            labelClassName={searchQuery !== '' ? 'active' : undefined}
                            labelText="Buscar"
                        />
                        <button><span className="material-icons">search</span></button>
                    </form>

                    <div className="filter-info secondary-font">
                        {filterMode.mode !== 'none' && `Filtrando por ${formatText(filterMode.choice)}`}
                    </div>

                    <div className="sorting-dropdown">
                        <div className="dropdown-title">
                            {sortingMode === 'recent' ? 'Más recientes' :
                                sortingMode === 'popular' ? 'Más populares' :
                                    sortingMode === 'lowToHigh' ? 'Más baratos' :
                                        sortingMode === 'highToLow' ? 'Más caros' :
                                            sortingMode === 'discount' && 'Los mejores descuentos'
                            } <span className="material-icons">
                                arrow_drop_down
                            </span>
                        </div>
                        <div className="dropdown-items">
                            <div className="dropdown-action" onClick={() => sorMounts('recent')}>Más recientes</div>
                            <div className="dropdown-action" onClick={() => sorMounts('popular')}>Más populares</div>
                            <div className="dropdown-action" onClick={() => sorMounts('lowToHigh')}>Más baratos</div>
                            <div className="dropdown-action" onClick={() => sorMounts('highToLow')}>Más caros</div>
                            <div className="dropdown-action" onClick={() => sorMounts('discount')}>Los mejores descuentos</div>
                        </div>
                    </div>

                </div>
                {isSearch ?
                    searchResults.length > 0 ?
                        searchResults.map((frame, index) => (
                            <Frame
                                className="col-6 col-md-4 col-lg-3 my-2"
                                key={index}
                                image={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                                frameInfo={frame}
                            />
                        )) :
                        <Error
                            message="Error :("
                            className="w-75 mx-auto mt-5 text-muted secondary-font h1"
                            iconClassName="h1 my-0"
                        >
                            <h4>No se encontraron resultados</h4>
                        </Error> :
                    mounts.map((frame, index) => (
                        <Frame
                            className="col-6 col-md-4 col-lg-3 my-2"
                            key={index}
                            image={`https://firebasestorage.googleapis.com/v0/b/optica-809a9.appspot.com/o/${frame._id}_model.png?alt=media&token=2cc6b58c-a5fe-4688-83eb-8f0337e2e7cc`}
                            frameInfo={frame}
                        />
                    ))
                }
            </div>
        </div >
    )
}

export default Catalogue;
