import React, {useState, useEffect} from "react";
import swal from '@sweetalert/with-react';
import Pagination from "@material-ui/lab/Pagination";

import {getClases, deleteClase} from "../../actions/clases";

import {Link} from "react-router-dom";
import {handleError, handleResponse} from "../../http-common";
import config from "../../config";

const navigateDeleteOkOrError = `${config.appDns}/clases`

const ClasesList = (props) => {

    const readonly = props && props.props ? (props.props.profesorId || props.props.alumnoId) : undefined
    const profesorId = props && props.props ? props.props.profesorId : undefined
    const alumnoId = props && props.props ? props.props.alumnoId : undefined
    const [clases, setClases] = useState([]);
    const [currentClase, setCurrentClase] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchNombre, setSearchNombre] = useState("");
    const [searchCurso, setSearchCurso] = useState("");
    const [searchProfesor, setSearchProfesor] = useState("");
    const [searchDia, setSearchDia] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);


    function cleanSearches() {
        setSearchNombre("")
        setSearchCurso("")
        setSearchProfesor("")
        setSearchDia("")
    }

    const onChangeSearchNombre = (e) => {
        cleanSearches()
        const searchNombre = e.target.value;
        setSearchNombre(searchNombre);
    };

    const onChangeSearchCurso = (e) => {
        cleanSearches()
        const searchCurso = e.target.value;
        setSearchCurso(searchCurso);
    };

    const onChangeSearchProfesor = (e) => {
        cleanSearches()
        const searchProfesor = e.target.value;
        setSearchProfesor(searchProfesor);
    };

    const onChangeSearchDia = (e) => {
        cleanSearches()
        const searchDia = e.target.value;
        setSearchDia(searchDia);
    };

    const getRequestParams = (searchNombre, searchCurso, searchProfesor, searchDia, profesorId, alumnoId, page) => {
        let params = {};

        if (searchNombre) {
            params["nombre"] = searchNombre;
        }
        if (searchCurso) {
            params["curso"] = searchCurso;
        }
        if (searchProfesor) {
            params["profesor"] = searchProfesor;
        }
        if (searchDia) {
            params["dia"] = searchDia;
        }
        if (profesorId) {
            params["profesorId"] = profesorId;
        }

        if (alumnoId) {
            params["alumnoId"] = alumnoId;
        }

        if (page) {
            params["page"] = page - 1;
        }

        return params;
    };

    const retrieveClases = () => {
        const params = getRequestParams(searchNombre, searchCurso, searchProfesor, searchDia, profesorId, alumnoId, page);
        getClases(params).then((response) => {
            const {clases, totalPages} = response.data;

            setClases(clases);
            setCount(totalPages);
            setCurrentIndex(-1)
            setCurrentClase(null)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/clases`, "Hubo un error al buscar los datos de los clases")
        });
    };

    useEffect(retrieveClases, [page]);


    const handlePageChange = (event, value) => {
        setPage(value);
    };


    const setActiveClase = (clase, index) => {
        setCurrentClase(clase);
        setCurrentIndex(index);
    };

    const deleteClaseById = (id) => {
        deleteClase(id).then((response) => {
            handleResponse(204, response, navigateDeleteOkOrError, "La clase fue correctamente eliminada.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateDeleteOkOrError, "Hubo un error al eliminar la clase")
        })
    };

    return (
        <div className="list row col-md-12">
            {!readonly && <div className="row col-lg-12">
                <div style={{marginLeft: 10}} className="row col-lg-6">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por Nombre"
                            value={searchNombre}
                            onChange={onChangeSearchNombre}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveClases}
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
                            placeholder="Buscar por Profesor"
                            value={searchProfesor}
                            onChange={onChangeSearchProfesor}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveClases}
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
                            placeholder="Buscar por Curso"
                            value={searchCurso}
                            onChange={onChangeSearchCurso}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveClases}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{marginLeft: 10}} className="row col-lg-6">
                    <div className="input-group mb-3">
                        <label className="form-control">Día: </label>
                        <select
                            type="text"
                            className="form-control"
                            value={searchDia}
                            onChange={onChangeSearchDia}
                        >
                            <option value="LUNES">Lunes</option>
                            <option value="MARTES">Martes</option>
                            <option value="MIERCOLES">Miercoles</option>
                            <option value="JUEVES">Jueves</option>
                            <option value="VIERNES">Viernes</option>
                            <option value="SABADO">Sabado</option>
                        </select>
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveClases}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>

            </div>}
            <div className="col-md-6">
                {!readonly && <h4>Clases</h4>}
                {readonly && <h4>Mis Clases</h4>}

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
                    {clases &&
                    clases.map((clase, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveClase(clase, index)}
                            key={index}
                        >
                            {clase.nombre}
                        </li>
                    ))}
                </ul>
                {!readonly && <Link
                    to={"/claseForm"}
                    className="m-3 btn btn-sm btn-danger"
                >
                    Agregar Clase
                </Link>}
            </div>
            <div className="col-md-6">
                {currentClase ? (
                    <div>
                        <h4>Clase</h4>
                        <div>
                            <label>
                                <strong>Nombre:</strong>
                            </label>{" "}
                            {currentClase.nombre}
                        </div>
                        <div>
                            <label>
                                <strong>Dia:</strong>
                            </label>{" "}
                            {currentClase.dia}
                        </div>
                        <div>
                            <label>
                                <strong>Horario:</strong>
                            </label>{" "}
                            {currentClase.horarioInicio + " - " + currentClase.horarioFin}
                        </div>
                        <div>
                            <label>
                                <strong>Descripción:</strong>
                            </label>{" "}
                            {currentClase.descripcion}
                        </div>
                        <div>
                            <label>
                                <strong>Profesor:</strong>
                            </label>{" "}
                            {currentClase.profesor.nombreApellido}
                        </div>
                        <div>
                            <label>
                                <strong>Curso:</strong>
                            </label>{" "}
                            {currentClase.curso.nombre}
                        </div>

                        {!readonly && <Link
                            to={"/clases/" + currentClase.id}
                            className="btn btn-primary btn-sm"
                        >
                            Modificar
                        </Link>}
                        {!readonly && <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => swal({
                                title: "Eliminar",
                                text: "Se va a eliminar la clase " + currentClase.nombre + ". Por favor, confirmar dicha acción.",
                                icon: "warning",
                                buttons: ["Cancelar", "Eliminar"]
                            }).then(selection => {
                                if (selection) {
                                    deleteClaseById(currentClase.id)
                                }
                            })
                            }
                            style={{marginLeft: 10}}
                        >
                            Eliminar
                        </button>}
                        <Link
                            to={"/clase/detail/" + currentClase.id}
                            className="btn btn-info btn-sm"
                            style={{marginLeft: 10}}
                        >
                            Ver
                        </Link>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Por favor, seleccione una clase...</p>
                    </div>
                )}
            </div>
        </div>
    );
    // }
}

export default ClasesList;
