import React, {useState, useEffect} from "react";
import swal from '@sweetalert/with-react';

import {Link} from "react-router-dom";
import {handleError, handleResponse} from "../../http-common";
import config from "../../config";
import {deleteProfesor, getProfesores} from "../../actions/profesores";

const navigateDeleteOkOrError = `${config.appDns}/profesores`

const ProfesoresList = () => {

    const [profesores, setProfesores] = useState([]);
    const [currentProfesor, setCurrentProfesor] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchNombre, setSearchNombre] = useState("");
    const [searchCurso, setSearchCurso] = useState("");


    const getRequestParams = (searchNombre, searchCurso) => {
        let params = {};

        if (searchNombre) {
            params["nombre"] = searchNombre;
        }
        if (searchCurso) {
            params["curso"] = searchCurso;
        }

        return params;
    };

    const retrieveProfesores = () => {
        const params = getRequestParams(searchNombre, searchCurso);
        getProfesores(params).then((response) => {
            const profesores = response.data;

            setProfesores(profesores);
            setCurrentIndex(-1)
            setCurrentProfesor(null)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/profesores`, "Hubo un error al buscar los datos de los profesores")
        });
    };

    useEffect(retrieveProfesores, []);


    const setActiveProfesor = (profesor, index) => {
        setCurrentProfesor(profesor);
        setCurrentIndex(index);
    };

    function cleanSearches() {
        setSearchNombre("")
        setSearchCurso("")
    }

    function onChangeSearchNombre(e) {
        cleanSearches()
        const searchNombre = e.target.value;
        setSearchNombre(searchNombre);
    }

    function onChangeSearchCurso(e) {
        cleanSearches()
        const searchCurso = e.target.value;
        setSearchCurso(searchCurso);
    }


    const deleteProfesorById = (id) => {
        deleteProfesor(id).then((response) => {
            handleResponse(204, response, navigateDeleteOkOrError, "El profesor fue correctamente eliminado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateDeleteOkOrError, "Hubo un error al eliminar el profesor")
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
                            value={searchNombre}
                            onChange={onChangeSearchNombre}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveProfesores}
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
                                onClick={retrieveProfesores}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="col-md-6">
                <h4>Profesores</h4>

                <ul className="list-group row-cols-md-8">
                    {profesores &&
                    profesores.map((profesor, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveProfesor(profesor, index)}
                            key={index}
                        >
                            {profesor.nombreApellido}
                        </li>
                    ))}
                </ul>
                <Link
                    to={"/profesorForm"}
                    className="m-3 btn btn-sm btn-danger"
                >
                    Agregar Profesor
                </Link>
            </div>
            <div className="col-md-6">
                {currentProfesor ? (
                    <div>
                        <h4>Profesor</h4>
                        <div>
                            <label>
                                <strong>Nombre:</strong>
                            </label>{" "}
                            {currentProfesor.nombreApellido}
                        </div>
                        <div>
                            <label>
                                <strong>Fecha de Nacimiento:</strong>
                            </label>{" "}
                            {currentProfesor.fechaDeNacimiento}
                        </div>
                        <div>
                            <label>
                                <strong>Contacto:</strong>
                            </label>{" "}
                            {currentProfesor.contacto.telefono } / {currentProfesor.contacto.email}
                        </div>
                        <div>
                            <label>
                                <strong>Detalles:</strong>
                            </label>{" "}
                            {currentProfesor.detalles}
                        </div>
                        <div>
                            <label>
                                <strong>DNI:</strong>
                            </label>{" "}
                            {currentProfesor.dni}
                        </div>


                        <Link
                            to={"/profesores/" + currentProfesor.id}
                            className="btn btn-primary btn-sm"
                        >
                            Modificar
                        </Link>
                        <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => swal({
                                title: "Eliminar",
                                text: "Se va a eliminar el profesor " + currentProfesor.nombreApellido + ". Por favor, confirmar dicha acción.",
                                icon: "warning",
                                buttons: ["Cancelar", "Eliminar"]
                            }).then(selection => {
                                if (selection) {
                                    deleteProfesorById(currentProfesor.id)
                                }
                            })
                            }
                            style={{marginLeft: 10}}
                        >
                            Eliminar
                        </button>
                        <Link
                            to={"/profesor/detail/" + currentProfesor.id}
                            className="btn btn-info btn-sm"
                            style={{marginLeft: 10}}
                        >
                            Ver
                        </Link>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Por favor, seleccione un profesor...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfesoresList;
