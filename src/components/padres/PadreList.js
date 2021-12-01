import React, {useState, useEffect} from "react";
import swal from '@sweetalert/with-react';
import Pagination from "@material-ui/lab/Pagination";

import {getPadres, deletePadre} from "../../actions/padres";

import {Link} from "react-router-dom";
import {handleError, handleResponse} from "../../http-common";
import config from "../../config";

const navigateDeleteOkOrError = `${config.appDns}/padres`

const PadresList = () => {

    const [padres, setPadres] = useState([]);
    const [currentPadre, setCurrentPadre] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchNombreApellido, setSearchNombreApellido] = useState("");
    const [searchAlumno, setSearchAlumno] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);


    function cleanSearches() {
        setSearchNombreApellido("")
        setSearchAlumno("")
    }

    const onChangeSearchNombreApellido = (e) => {
        cleanSearches()
        const searchNombreApellido = e.target.value;
        setSearchNombreApellido(searchNombreApellido);
    };

    const onChangeSearchAlumno = (e) => {
        cleanSearches()
        const searchAlumno = e.target.value;
        setSearchAlumno(searchAlumno);
    };

    const getRequestParams = (searchNombreApellido, searchAlumno, page) => {
        let params = {};

        if (searchNombreApellido) {
            params["nombreApellido"] = searchNombreApellido;
        } else {
            if (searchAlumno) {
                params["alumno"] = searchAlumno;
            }
        }

        if (page) {
            params["page"] = page - 1;
        }

        return params;
    };

    const retrievePadres = () => {
        const params = getRequestParams(searchNombreApellido, searchAlumno, page);
        getPadres(params).then((response) => {
            const {padres, totalPages} = response.data;

            setPadres(padres);
            setCount(totalPages);
            setCurrentIndex(-1)
            setCurrentPadre(null)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/padres`, "Hubo un error al buscar los datos de los padres")
        });
    };

    useEffect(retrievePadres, [page]);


    const handlePageChange = (event, value) => {
        setPage(value);
    };


    const setActivePadre = (padre, index) => {
        setCurrentPadre(padre);
        setCurrentIndex(index);
    };

    const deletePadreById = (id) => {
        deletePadre(id).then((response) => {
            handleResponse(204, response, navigateDeleteOkOrError, "El padre fue correctamente eliminado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateDeleteOkOrError, "Hubo un error al eliminar el padre")
        })
    };

    return (
        <div className="list row col-md-12">
            <div className="row col-lg-12">
                <div style={{marginLeft: 10}} className="row col-lg-6">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por Nombre"
                            value={searchNombreApellido}
                            onChange={onChangeSearchNombreApellido}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrievePadres}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{marginLeft: 10}} className="row col-lg-6">

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por Alumno"
                            value={searchAlumno}
                            onChange={onChangeSearchAlumno}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrievePadres}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <h4>Padres</h4>

                <div className="mt-3">
                    <Pagination
                        className="my-3"
                        count={count}
                        page={page}
                        siblingCount={1}
                        boundaryCount={1}
                        variant="outlined"
                        shape="rounded"
                        size="small"
                        onChange={handlePageChange}
                    />
                </div>

                <ul className="list-group row-cols-md-8">
                    {padres &&
                    padres.map((padre, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActivePadre(padre, index)}
                            key={index}
                        >
                            {padre.nombreApellido}
                        </li>
                    ))}
                </ul>
                <Link
                    to={"/padreForm"}
                    className="m-3 btn btn-sm btn-danger"
                >
                    Agregar Padre
                </Link>
            </div>
            <div className="col-md-6">
                {currentPadre ? (
                    <div>
                        <h4>Padre</h4>
                        <div>
                            <label>
                                <strong>Nombre:</strong>
                            </label>{" "}
                            {currentPadre.nombreApellido}
                        </div>
                        <div>
                            <label>
                                <strong>Detalles:</strong>
                            </label>{" "}
                            {currentPadre.detalles}
                        </div>
                        <div>
                            <label>
                                <strong>Contacto:</strong>
                            </label>{" "}
                            {currentPadre.contacto.telefono } / {currentPadre.contacto.email}
                        </div>
                        <div>
                            <label>
                                <strong>DNI:</strong>
                            </label>{" "}
                            {currentPadre.dni}
                        </div>


                        <Link
                            to={"/padres/" + currentPadre.id}
                            className="btn btn-primary btn-sm"
                        >
                            Modificar
                        </Link>
                        <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => swal({
                                title: "Eliminar",
                                text: "Se va a eliminar el padre " + currentPadre.nombreApellido + ". Por favor, confirmar dicha acción.",
                                icon: "warning",
                                buttons: ["Cancelar", "Eliminar"]
                            }).then(selection => {
                                if (selection) {
                                    deletePadreById(currentPadre.id)
                                }
                            })
                            }
                            style={{marginLeft: 10}}
                        >
                            Eliminar
                        </button>
                        <Link
                            to={"/padre/detail/" + currentPadre.id}
                            className="btn btn-info btn-sm"
                            style={{marginLeft: 10}}
                        >
                            Ver
                        </Link>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Por favor, seleccione un padre...</p>
                    </div>
                )}
            </div>
        </div>
    );
    // }
}

export default PadresList;
