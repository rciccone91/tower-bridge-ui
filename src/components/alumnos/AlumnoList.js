import React, {useState, useEffect} from "react";
import swal from '@sweetalert/with-react';
import Pagination from "@material-ui/lab/Pagination";

import {getAlumnos, deleteAlumno} from "../../actions/alumnos";

import {Link} from "react-router-dom";
import {handleError, handleResponse} from "../../http-common";
import config from "../../config";

const navigateDeleteOkOrError = `${config.appDns}/alumnos`

const AlumnosList = () => {

    const [alumnos, setAlumnos] = useState([]);
    const [currentAlumno, setCurrentAlumno] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchNombreApellido, setSearchNombreApellido] = useState("");
    const [searchAnioEscolar, setSearchAnioEscolar] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    function cleanSearches() {
        setSearchNombreApellido("")
        setSearchAnioEscolar("")
    }

    const onChangeSearchNombreApellido = (e) => {
        cleanSearches()
        const searchNombreApellido = e.target.value;
        setSearchNombreApellido(searchNombreApellido);

    };

    const onChangeAnioEscolar = (e) => {
        cleanSearches()
        const searchAnioEscolar = e.target.value;
        setSearchAnioEscolar(searchAnioEscolar);
    };

    const getRequestParams = (searchNombreApellido, searchAnioEscolar, page) => {
        let params = {};

        if (searchNombreApellido) {
            params["nombreApellido"] = searchNombreApellido;
        } else if (searchAnioEscolar) {
            params["anioEscolar"] = searchAnioEscolar;
        }

        if (page) {
            params["page"] = page - 1;
        }

        return params;
    };

    const retrieveAlumnos = () => {
        const params = getRequestParams(searchNombreApellido, searchAnioEscolar, page);
        getAlumnos(params).then((response) => {
            const {alumnos, totalPages} = response.data;

            setAlumnos(alumnos);
            setCount(totalPages);
            setCurrentIndex(-1)
            setCurrentAlumno(null)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/alumnos`, "Hubo un error al buscar los datos de los alumnos")
        });
    };

    useEffect(retrieveAlumnos, [page]);


    const handlePageChange = (event, value) => {
        setPage(value);
    };


    const setActiveAlumno = (alumno, index) => {
        setCurrentAlumno(alumno);
        setCurrentIndex(index);
    };

    const deleteAlumnoById = (id) => {
        deleteAlumno(id).then((response) => {
            handleResponse(204, response, navigateDeleteOkOrError, "El alumno fue correctamente eliminado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateDeleteOkOrError, "Hubo un error al eliminar el alumno")
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
                                onClick={retrieveAlumnos}
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
                            placeholder="Buscar por Año Esoclar"
                            value={searchAnioEscolar}
                            onChange={onChangeAnioEscolar}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveAlumnos}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <h4>Alumnos</h4>

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
                    {alumnos &&
                    alumnos.map((alumno, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveAlumno(alumno, index)}
                            key={index}
                        >
                            {alumno.nombreApellido}
                        </li>
                    ))}
                </ul>
                <Link
                    to={"/alumnoForm"}
                    className="m-3 btn btn-sm btn-danger"
                >
                    Agregar Alumno
                </Link>
            </div>
            <div className="col-md-6">
                {currentAlumno ? (
                    <div>
                        <h4>Alumno</h4>
                        <div>
                            <label>
                                <strong>Nombre:</strong>
                            </label>{" "}
                            {currentAlumno.nombreApellido}
                        </div>
                        <div>
                            <label>
                                <strong>Fecha de Nac.:</strong>
                            </label>{" "}
                            {currentAlumno.fechaDeNacimiento}
                        </div>
                        <div>
                            <label>
                                <strong>DNI:</strong>
                            </label>{" "}
                            {currentAlumno.dni}
                        </div>
                        <div>
                            <label>
                                <strong>Año Escolar:</strong>
                            </label>{" "}
                            {currentAlumno.anioEscolar}
                        </div>
                        <div>
                            <label>
                                <strong>Colegio:</strong>
                            </label>{" "}
                            {currentAlumno.colegio}
                        </div>

                        <Link
                            to={"/alumnos/" + currentAlumno.id}
                            className="btn btn-primary btn-sm"
                        >
                            Modificar
                        </Link>
                        <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => swal({
                                title: "Eliminar",
                                text: "Se va a eliminar el alumno " + currentAlumno.nombreApellido + ". Por favor, confirmar dicha acción.",
                                icon: "warning",
                                buttons: ["Cancelar", "Eliminar"]
                            }).then(selection => {
                                if (selection) {
                                    deleteAlumnoById(currentAlumno.id)
                                }
                            })
                            }
                            style={{marginLeft: 10}}
                        >
                            Eliminar
                        </button>
                        <Link
                            to={"/alumno/detail/" + currentAlumno.id}
                            className="btn btn-info btn-sm"
                            style={{marginLeft: 10}}
                        >
                            Ver
                        </Link>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Por favor, seleccione un alumno...</p>
                    </div>
                )}
            </div>
        </div>
    );
    // }
}

export default AlumnosList;
