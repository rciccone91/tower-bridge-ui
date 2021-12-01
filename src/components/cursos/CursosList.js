import React, {useState, useEffect} from "react";
import swal from '@sweetalert/with-react';

import {Link} from "react-router-dom";
import {handleError, handleResponse} from "../../http-common";
import config from "../../config";
import {deleteCurso, getCursos} from "../../actions/cursos";
import Pagination from "@material-ui/lab/Pagination";

const navigateDeleteOkOrError = `${config.appDns}/cursos`

const CursosList = (props) => {

    const consulta = props && props.props ? props.props.consulta : undefined
    const [cursos, setCursos] = useState([]);
    const [currentCurso, setCurrentCurso] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchNombre, setSearchNombre] = useState("");
    const [searchTipo, setSearchTipo] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);


    const getRequestParams = (searchNombre, searchTipo) => {
        let params = {};

        if (searchNombre) {
            params["nombre"] = searchNombre;
        }
        if (searchTipo) {
            params["tipo"] = searchTipo;
        }

        if (page) {
            params["page"] = page - 1;
        }

        return params;
    };

    const retrieveCursos = () => {
        const params = getRequestParams(searchNombre, searchTipo);
        getCursos(params).then((response) => {
            const {cursos, totalPages} = response.data;

            setCursos(cursos);
            setCount(totalPages)
            setCurrentIndex(-1)
            setCurrentCurso(null)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/cursos`, "Hubo un error al buscar los datos de los cursos")
        });
    };

    useEffect(retrieveCursos, [page]);

    function cleanSearches() {
        setSearchNombre("")
        setSearchTipo("")
    }

    const setActiveCurso = (curso, index) => {
        setCurrentCurso(curso);
        setCurrentIndex(index);
    };

    function onChangeSearchNombre(e) {
        cleanSearches()
        const searchNombre = e.target.value;
        setSearchNombre(searchNombre);
    }

    function onChangeSearchTipo(e) {
        cleanSearches()
        const searchTipo = e.target.value;
        setSearchTipo(searchTipo);
    }

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const deleteCursoById = (id) => {
        deleteCurso(id).then((response) => {
            handleResponse(204, response, navigateDeleteOkOrError, "El curso fue correctamente eliminado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateDeleteOkOrError, "Hubo un error al eliminar el curso")
        })
    };

    return (
        <div className="list row col-md-12">
            <div className="row col-lg-12">
                <div style={{marginLeft: 10}} className="row col-lg-5">
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
                                onClick={retrieveCursos}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
                <div style={{marginLeft: 10}} className="row col-lg-7">
                    <div className="input-group mb-3">
                        <label className="form-control">Tipo:</label>
                        <select
                            type="text"
                            className="form-control"
                            value={searchTipo}
                            onChange={onChangeSearchTipo}
                        >
                            <option value="CAMBRIDGE_INTERNATIONAL">Cambridge</option>
                            <option value="ADULTOS">Adultos</option>
                            <option value="ESPECIFICOS">Específicos</option>
                        </select>
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveCursos}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="col-md-6">
                <h4>Cursos</h4>

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
                    {cursos &&
                    cursos.map((curso, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveCurso(curso, index)}
                            key={index}
                        >
                            {curso.nombre}
                        </li>
                    ))}
                </ul>
                {!consulta && <Link
                    to={"/cursoForm"}
                    className="m-3 btn btn-sm btn-danger"
                >
                    Agregar Curso
                </Link>}
            </div>
            <div className="col-md-6">
                {currentCurso ? (
                    <div>
                        <h4>Curso</h4>
                        <div>
                            <label>
                                <strong>Nombre:</strong>
                            </label>{" "}
                            {currentCurso.nombre}
                        </div>
                        <div>
                            <label>
                                <strong>Descripción:</strong>
                            </label>{" "}
                            {currentCurso.descripcion}
                        </div>
                        <div>
                            <label>
                                <strong>Tipo de Curso:</strong>
                            </label>{" "}
                            {currentCurso.tipoDeCurso}
                        </div>
                        <div>
                            <label>
                                <strong>Arancel:</strong>
                            </label>{" "}
                            {currentCurso.valorArancel}
                        </div>
                        <div>
                            <label>
                                <strong>Valor Examen internacional:</strong>
                            </label>{" "}
                            {currentCurso.valorExamen ?  `${currentCurso.valorExamen} USD` : 'No hay examen' }
                        </div>


                        {!consulta && <Link
                            to={"/cursos/" + currentCurso.id}
                            className="btn btn-primary btn-sm"
                        >
                            Modificar
                        </Link>}
                        {!consulta && <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => swal({
                                title: "Eliminar",
                                text: "Se va a eliminar el curso " + currentCurso.nombre + ". Por favor, confirmar dicha acción.",
                                icon: "warning",
                                buttons: ["Cancelar", "Eliminar"]
                            }).then(selection => {
                                if (selection) {
                                    deleteCursoById(currentCurso.id)
                                }
                            })
                            }
                            style={{marginLeft: 10}}
                        >
                            Eliminar
                        </button>}
                        <Link
                            to={"/curso/detail/" + currentCurso.id}
                            className="btn btn-info btn-sm"
                            style={{marginLeft: 10}}
                        >
                            Ver
                        </Link>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Por favor, seleccione un curso...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CursosList;
