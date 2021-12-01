import React, {useState, useEffect} from "react";
import swal from '@sweetalert/with-react';
import Pagination from "@material-ui/lab/Pagination";

import {getUsuarios, deleteUsuario} from "../../actions/usuarios";

import {Link} from "react-router-dom";
import {handleError, handleResponse} from "../../http-common";
import config from "../../config";
import UsuariosService from "../../services/UsuariosService";

const navigateDeleteOkOrError = `${config.appDns}/usuarios`

const UsuariosList = () => {

    const [usuarios, setUsuarios] = useState([]);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [searchUsername, setSearchUsername] = useState("");
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);


    const onChangeSearchUsername = (e) => {
        const searchUsername = e.target.value;
        setSearchUsername(searchUsername);
    };


    const getRequestParams = (searchUsername, page) => {
        let params = {};

        if (searchUsername) {
            params["username"] = searchUsername;
        }
        if (page) {
            params["page"] = page - 1;
        }

        return params;
    };

    const retrieveUsuarios = () => {
        const params = getRequestParams(searchUsername, page);
        getUsuarios(params).then((response) => {
            const {usuarios, totalPages} = response.data;

            setUsuarios(usuarios);
            setCount(totalPages);
            setCurrentIndex(-1)
            setCurrentUsuario(null)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/usuarios`, "Hubo un error al buscar los datos de los usuarios")
        });
    };

    useEffect(retrieveUsuarios, [page]);


    const handlePageChange = (event, value) => {
        setPage(value);
    };


    const setActiveUsuario = (usuario, index) => {
        setCurrentUsuario(usuario);
        setCurrentIndex(index);
    };

    const deleteUsuarioById = (id) => {
        deleteUsuario(id).then((response) => {
            handleResponse(204, response, navigateDeleteOkOrError, "El usuario fue correctamente eliminado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateDeleteOkOrError, "Hubo un error al eliminar el usuario")
        })
    };

    function askAndShowPass() {
        swal({
            text: 'Ingrese su password para realizar dicha acción',
            type: "info",
            content: "input",
            button: {
                text: "Confirmar",
                closeModal: false,
            },
        }).then(pass => {
            if (!pass) throw null;

            UsuariosService.login({"username": localStorage.getItem("user"), "password": pass}).then(
                res => {
                    swal({
                        text: `Password del usuario ${currentUsuario.username}: ${currentUsuario.password}`,
                        icon: "info",
                        button: "OK"
                    })
                }).catch(err => {
                console.log(err)
                swal({
                    title: "Error",
                    type: "password",
                    text: "La password ingresada no es la correcta para el usuario.",
                    icon: "error",
                    button: "OK"
                }).then(() => {
                    window.location = navigateDeleteOkOrError
                })
            })

        })
    }

    return (
        <div className="list row col-md-12">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Nombre"
                        value={searchUsername}
                        onChange={onChangeSearchUsername}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={retrieveUsuarios}
                        >
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <h4>Usuarios</h4>

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
                    {usuarios &&
                    usuarios.map((usuario, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveUsuario(usuario, index)}
                            key={index}
                        >
                            {usuario.username}
                        </li>
                    ))}
                </ul>
                <Link
                    to={"/usuarioForm"}
                    className="m-3 btn btn-sm btn-danger"
                >
                    Agregar Usuario
                </Link>
            </div>
            <div className="col-md-6">
                {currentUsuario ? (
                    <div>
                        <h4>Usuario</h4>
                        <div>
                            <label>
                                <strong>Nombre:</strong>
                            </label>{" "}
                            {currentUsuario.username}
                        </div>
                        <div>
                            <label>
                                <strong>DNI:</strong>
                            </label>{" "}
                            {currentUsuario.perfil}
                        </div>


                        <Link
                            to={"/usuarios/" + currentUsuario.id}
                            className="btn btn-primary btn-sm"
                        >
                            Modificar
                        </Link>
                        <button
                            className="btn btn-danger btn-sm"
                            type="button"
                            onClick={() => swal({
                                title: "Eliminar",
                                text: "Se va a eliminar el usuario " + currentUsuario.username + ". Por favor, confirmar dicha acción.",
                                icon: "warning",
                                buttons: ["Cancelar", "Eliminar"]
                            }).then(selection => {
                                if (selection) {
                                    deleteUsuarioById(currentUsuario.id)
                                }
                            })
                            }
                            style={{marginLeft: 10}}
                        >
                            Eliminar
                        </button>
                        <button
                            className="btn btn-info btn-sm"
                            style={{marginLeft: 10}}
                            onClick={askAndShowPass}
                        >
                            Ver Password
                        </button>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Por favor, seleccione un usuario...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsuariosList;
