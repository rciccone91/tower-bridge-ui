import React, {useState, useEffect} from "react";
import swal from '@sweetalert/with-react';
import Pagination from "@material-ui/lab/Pagination";
import Loader from "react-loader-spinner";

import {getMovimientosPaginated, deleteMovimiento} from "../../actions/movimientos";

import {handleError, handleResponse} from "../../http-common";
import config from "../../config";

const navigateDeleteOkOrError = `${config.appDns}/finanzas`

function toStringDate(fecha) {
    let date = new Date(fecha);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`
}


function EliminarRegistracionMovimiento(props){

    const tipoMovimiento = props && props.props ? props.props.tipoMovimiento : undefined

    const [movimientos, setMovimientos] = useState([]);
    const [currentMovimiento, setCurrentMovimiento] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);



    const getRequestParams = (page, tipoMovimiento) => {
        let params = {};
        if (page) {
            params["page"] = page - 1;
        }
        if (tipoMovimiento) {
            params["tipoMovimiento"] = tipoMovimiento;
        }
        return params;
    };

    const retrieveMovimientos = () => {
        const params = getRequestParams(page,tipoMovimiento);
        getMovimientosPaginated(params).then((response) => {
            const {movimientos, totalPages} = response.data;

            setMovimientos(movimientos);
            setCount(totalPages);
            setCurrentIndex(-1)
            setCurrentMovimiento(null)
            setIsLoading(false)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/movimientos`, "Hubo un error al buscar los datos de los movimientos")
        });
    };

    useEffect(retrieveMovimientos, [page]);


    const handlePageChange = (event, value) => {
        setPage(value);
    };


    const setActiveMovimiento = (movimiento, index) => {
        setCurrentMovimiento(movimiento);
        setCurrentIndex(index);
    };

    const deleteMovimientoById = (id) => {
        deleteMovimiento(id).then((response) => {
            handleResponse(204, response, navigateDeleteOkOrError, "El movimiento fue correctamente eliminado.")
        }).catch(err => {
            console.log(err)
            handleError(err, navigateDeleteOkOrError, "Hubo un error al eliminar el movimiento")
        })
    };

    function getMovimientoDescription(movimiento){
        if(tipoMovimiento === 'COBRO'){
            return  `Fecha: ${toStringDate(movimiento.fecha)} Monto: ${movimiento.monto} Medio: ${movimiento.medioDePago} Alumno: ${movimiento.alumno.nombreApellido} Curso: ${movimiento.curso.nombre}`
        } else return  `Fecha: ${toStringDate(movimiento.fecha)} Monto: ${movimiento.monto}  Medio: ${movimiento.medioDePago} Proveedor: ${movimiento.proveedor.nombre}`
    }

    return (
        <div>
        {isLoading && <Loader
            type="Rings"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000} //3 secs
        />
}
    {!isLoading &&
        <div className="list row col-md-12">
            <div className="col-md-12">
                <h4>Cobros</h4>

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

                <ul className="list-group row-cols-md-12">
                    {movimientos &&
                    movimientos.map((movimiento, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveMovimiento(movimiento, index)}
                            key={index}
                        >
                            {getMovimientoDescription(movimiento)}
                        </li>
                    ))}
                </ul>
                <button
                    disabled={!currentMovimiento}
                    className="btn btn-danger btn-sm"
                    type="button"
                    onClick={() => swal({
                        title: "Eliminar",
                        text: "Se va a eliminar el movimiento seleccionado. Por favor, confirmar dicha acción.",
                        icon: "warning",
                        buttons: ["Cancelar", "Eliminar"]
                    }).then(selection => {
                        if (selection) {
                            deleteMovimientoById(currentMovimiento.id)
                        }
                    })
                    }
                    style={{marginTop: 10}}
                >
                    Eliminar
                </button>
            </div>
        </div>}
        </div>
    );
    // }
}

export default EliminarRegistracionMovimiento;
