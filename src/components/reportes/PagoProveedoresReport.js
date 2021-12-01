import React, {useEffect, useState} from "react";
import config from "../../config"
import MovimientosService from "../../services/MovimientosService";
import swal from '@sweetalert/with-react';
import Loader from "react-loader-spinner";
import {handleError} from "../../http-common";
import jsPDF from "jspdf";
import {Link} from "react-router-dom";

function toStringDate(fecha) {
    let date = new Date(fecha);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`
}

function MovimientoItem(props) {
    const movimiento = props.props

    return (
        <tr className="col-lg-12">
            <td className="col-lg-1">{movimiento.monto}</td>
            <td className="col-lg-3">{movimiento.medioDePago}</td>
            <td className="col-lg-2">{toStringDate(movimiento.fecha).trim()}</td>
            <td className="col-lg-2">{movimiento.proveedor && movimiento.proveedor.nombre}</td>
            <td className="col-lg-4">{movimiento.detalle}</td>
        </tr>
    );
}

function PagoProveedoresReport(props) {

    const navigateReportes = `${config.appDns}/reportes`

    const [movimientos, setMovimientos] = useState([]);
    const [fechaDesde, setFechaDesde] = useState(undefined);
    const [fechaHasta, setFechaHasta] = useState(undefined);

    function exportPDF(movimientos) {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(12);

        const title = "Pagos a proveedores entre fechas";
        const headers = [["Monto", "Medio de Pago", "Fecha", "Proveedor", "Detalle"]];

        const data = movimientos.map(m => [m.monto, m.medioDePago, toStringDate(m.fecha).trim(), m.proveedor.nombre, m.detalle]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("pagos-proveedores.pdf")
    }

    function toParamDate(fecha) {
        let date = new Date(fecha);
        console.log('DATE: ' + date);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
        return `${yyyy}-${mm}-${dd}`
    }


    function onChangeFechaDesde(e) {
        const fechaDesde = e.target.value;
        setFechaDesde(fechaDesde);
    }

    function onChangeFechaHasta(e) {
        const fechaHasta = e.target.value;
        setFechaHasta(fechaHasta);
    }

    function getFechasParams() {
        return {fechaDesde: toParamDate(fechaDesde), fechaHasta: toParamDate(fechaHasta), tipoMovimiento: 'PAGO'}
    }

    function getDifferenceInDays(d1, d2) {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) - Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) / (1000 * 60 * 60 * 24));
    }

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
        } else if (getDifferenceInDays(fechaDesde, fechaHasta) > 90) {
            swal({
                text: 'El rango de busqueda no puede ser mayor a 3 meses. ',
                icon: "warning",
                button: "OK"
            })
        } else {
            const params = getFechasParams()
            MovimientosService.getAll(params).then((response) => {
                if (response.data.length === 0) {
                    swal({
                        text: 'La búsqueda realizada no trajo ningún resultado. Verificar los parámetros ingresados.',
                        icon: "warning",
                        button: "OK"
                    })
                } else {
                    setMovimientos(response.data);
                    console.log(response.data);
                }
            }).catch(err => {
                console.log(err)
                handleError(err, `${config.appDns}/reportes`, "Hubo un error al buscar los datos de los pagos")
            });
        }
    }

    return (
        <div className="list row col-lg-12">
            <div>
                <div className="col-md-12">
                    <h3><strong>{'Pago a proveedores entre fechas'}</strong></h3>
                </div>
                <br/>
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
                <div className="row col-lg-12">
                    <table className="table table-striped table-fit"
                           style={{
                               'height': '700px',
                               'width': '100%',
                               'overflow': 'scroll',
                               'display': 'block'
                           }}>
                        <thead>
                        <tr>
                            <th className="col-lg-1">Monto</th>
                            <th className="col-lg-3">Medio de Pago</th>
                            <th className="col-lg-2">Fecha</th>
                            <th className="col-lg-2">Proveedor</th>
                            <th className="col-lg-4">Detalle</th>
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
                    <div className="list row col-md-6">
                        <div className="list row col-md-3">
                            <Link
                                to={"/reportes"}
                                className="btn btn-secondary btn-md"
                            >
                                Volver
                            </Link>
                        </div>
                        <div className="list row col-md-3">
                            <button className="btn btn-info btn-md" onClick={() => exportPDF(movimientos)}>Exportar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default PagoProveedoresReport
