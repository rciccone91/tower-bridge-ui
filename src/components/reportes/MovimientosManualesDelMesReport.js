import React, { useState, useEffect }from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { getMovimientosManualesDelMes } from "../../actions/reportes";

import {handleError } from "../../http-common";
import config from "../../config";
import {Link} from "react-router-dom";

function MovimientoItem(props){
    const movimiento = props.props
    return(
        <tr className="col-md-12">
            <td className="col-md-2">{movimiento.fecha}</td>
            <td className="col-md-4">{movimiento.detalle}</td>
            <td className="col-md-2">{movimiento.monto}</td>
            <td className="col-md-2">{movimiento.tipo}</td>
            <td className="col-md-2">{movimiento.medioDePago}</td>
        </tr>
    );
}

function exportPDF(movimientos){
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Movimientos manuales del mes";
    const headers = [["Fecha", "Detalle", "Monto","Tipo", "Medio de pago"]];

    const data = movimientos.map(m=> [m.fecha, m.detalle,m.monto, m.tipo, m.medioDePago]);

    let content = {
        startY: 50,
        head: headers,
        body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("movimientosMes-report.pdf")
}

const MovimientosManualesDelMesReport  = () => {

    const [movimientos, setMovimientos] = useState([]);

    const retrieveMovimientos = () => {
        getMovimientosManualesDelMes().then((response) => {
            const movimientos = response.data;
            setMovimientos(movimientos);

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err,`${config.appDns}/reportes`,"Hubo un error al buscar los datos del reporte.")
        });
    };

    useEffect(retrieveMovimientos, []);


    return (
        <div className="list row col-lg-12" >
            <h3><strong>{'Movimientos Manuales del Mes'}</strong></h3>
            <br/>
            <table className="table table-striped table-fit" style={{'height': '500px', 'width':'100%','overflow':'scroll', 'display': 'block'}}>
                <thead>
                <tr>
                    <th className="col-lg-2">Fecha</th>
                    <th className="col-lg-4">Detalle</th>
                    <th className="col-lg-2">Monto</th>
                    <th className="col-lg-2">Tipo</th>
                    <th className="col-lg-2">Medio de pago</th>
                </tr>
                </thead>
                <tbody>
                {
                    movimientos.map(function(movimiento)
                    {
                        return (
                            <MovimientoItem  props={movimiento} />
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
                    <button className="btn btn-info btn-md" onClick={() => exportPDF(movimientos)}>Exportar</button>
                </div>
            </div>
        </div>

    );
}

export default MovimientosManualesDelMesReport;
