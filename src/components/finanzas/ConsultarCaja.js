import React, {useEffect, useState} from "react";
import config from "../../config"
import MovimientosService from "../../services/MovimientosService";
import swal from '@sweetalert/with-react';
import Loader from "react-loader-spinner";
import {handleError} from "../../http-common";


function MovimientoItem(props) {
    const movimiento = props.props

    function toStringDate(fecha) {
        let date = new Date(fecha);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`
    }


    return (
        <tr className="col-lg-12">
            <td className="col-lg-1">{movimiento.monto}</td>
            <td className="col-lg-2">{movimiento.medioDePago}</td>
            <td className="col-lg-2">{movimiento.tipoMovimiento}</td>
            <td className="col-lg-2">{toStringDate(movimiento.fecha)}</td>
            <td className="col-lg-2">{movimiento.proveedor && movimiento.proveedor.nombre}</td>
            <td className="col-lg-2">{movimiento.alumno && movimiento.alumno.nombreApellido}</td>
            <td className="col-lg-2">{movimiento.curso && movimiento.curso.nombre}</td>
        </tr>
    );
}

function ConsultarCaja(props) {

    const navigateFinanzas = `${config.appDns}/finanzas`

    const [data, setData] = useState({});
    const [movimientos, setMovimientos] = useState([]);
    const [fechaDesde, setFechaDesde] = useState(undefined);
    const [fechaHasta, setFechaHasta] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);


    function toParamDate(fecha) {
        let date = new Date(fecha);
        console.log('DATE: ' + date);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`
    }

    useEffect(() => {
        MovimientosService.cajaEstado().then(
            res => {
                setData(res.data);
                setIsLoading(false);
            }).catch(err => {
            console.log(err)
            swal({
                title: "Error",
                text: 'Un error ocurrió al buscar los datos de la caja y los movimientos. Por favor contactá al administrador.',
                icon: "error",
                button: "OK"
            }).then(() => {
                window.location = navigateFinanzas
            })
        });
    }, [])


    function onChangeFechaDesde(e) {
        const fechaDesde = e.target.value;
        setFechaDesde(fechaDesde);
    }

    function onChangeFechaHasta(e) {
        const fechaHasta = e.target.value;
        setFechaHasta(fechaHasta);
    }

    function getFechasParams() {
        return {fechaDesde: toParamDate(fechaDesde), fechaHasta: toParamDate(fechaHasta)}
    }

    // function getDaysDiff() {
    //     // One day in milliseconds
    //     const oneDay = 1000 * 60 * 60 * 24;
    //     // Calculating the time difference between two dates
    //     const diffInTime = fechaHasta.toLocaleString().getTime() - fechaDesde.toLocaleString().getTime();
    //     // Calculating the no. of days between two dates
    //     const diffInDays = Math.round(diffInTime / oneDay);
    //     return diffInDays;
    // }

    function retrieveMovimientos() {
        if (!fechaHasta || !fechaDesde) {
            swal({
                text: 'Ambas fechas deben estar definidas para realizar la búsqueda. ',
                icon: "warning",
                button: "OK"
            })
        } else if (fechaDesde > fechaHasta) {
            swal({
                text: 'La fecha desde debe ser anterior a la fecha hasta. ',
                icon: "warning",
                button: "OK"
            })
        }
        // TODO - check this
        // else if (getDaysDiff() > 90) {
        //     swal({
        //         text: 'El rango de busqueda no puede ser mayor a 3 meses. ',
        //         icon: "warning",
        //         button: "OK"
        //     })}
        else {
            const params = getFechasParams()
            MovimientosService.getAll(params).then((response) => {
                setMovimientos(response.data);
                console.log(response.data);
            }).catch(err => {
                console.log(err)
                handleError(err, `${config.appDns}/clases`, "Hubo un error al buscar los datos de los clases")
            });
        }
    }

    return (
        <div className="list row col-lg-12">
            {isLoading && <Loader
                type="Rings"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000} //3 secs
            />
            }
            {!isLoading &&
            <div>
                <div className="col-md-12">
                    <h4>Estado de Caja</h4>
                </div>
                <br/>
                <div className="col-md-12">
                    <h5>Dinero disponible: ${data.estadoCaja.valorActual}</h5>
                </div>
                <br/><br/>
                <div className="col-md-12">
                    <h4>Movimientos</h4>
                </div>
                <div className="row col-lg-12">
                    <div style={{marginLeft: 10}} className="row col-lg-5">
                        <label>Fecha desde:</label>
                    </div>
                    <div style={{marginLeft: 10}} className="row col-lg-5">
                        <label>Fecha hasta:</label>
                    </div>
                </div>
                <div className="row col-lg-12">
                    <div style={{marginLeft: 10}} className="row col-lg-5">
                        <div className="input-group mb-3">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="Fecha desde"
                                value={fechaDesde}
                                onChange={onChangeFechaDesde}
                            />
                            {/*<div className="input-group-append">*/}
                            {/*<button*/}
                            {/*    className="btn btn-outline-secondary"*/}
                            {/*    type="button"*/}
                            {/*    onClick={retrieveClases}*/}
                            {/*>*/}
                            {/*    Buscar*/}
                            {/*</button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div style={{marginLeft: 10}} className="row col-lg-5">
                        <div className="input-group mb-3">
                            <input
                                type="date"
                                className="form-control"
                                placeholder="Fecha hasta"
                                value={fechaHasta}
                                onChange={onChangeFechaHasta}
                            />
                        </div>
                    </div>
                    <div style={{marginLeft: 10}} className="row col-lg-2">
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveMovimientos}
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
                <br/>
                <div className="col-lg-12">
                    <table className="table table-striped table-fit"
                           style={{
                               'height': '600px',
                               'width': '100%',
                               'overflow': 'scroll',
                               'display': 'block'
                           }}>
                        <thead>
                        <tr>
                            <th className="col-lg-1">Monto</th>
                            <th className="col-lg-2">Medio de Pago</th>
                            <th className="col-lg-2">Tipo de Movimiento</th>
                            <th className="col-lg-2">Fecha</th>
                            <th className="col-lg-2">Proveedor</th>
                            <th className="col-lg-2">Alumno</th>
                            <th className="col-lg-2">Curso</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            movimientos.map(function (movimiento) {
                                return (
                                    <MovimientoItem props={movimiento}/>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>
    )

}

export default ConsultarCaja
