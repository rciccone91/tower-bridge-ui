import React, { useState, useEffect }from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { getPagosProveedoresDelMes } from "../../actions/reportes";

import {handleError } from "../../http-common";
import config from "../../config";
import {Link} from "react-router-dom";

function PagoItem(props){
    const pago = props.props
    return(
        <tr className="col-md-12">
            <td className="col-md-2">{pago.proveedor}</td>
            <td className="col-md-2">{pago.cuit}</td>
            <td className="col-md-2">{pago.detalle}</td>
            <td className="col-md-2">{pago.fecha}</td>
            <td className="col-md-2">{pago.monto}</td>
            <td className="col-md-2">{pago.medioDePago}</td>
        </tr>
    );
}

function exportPDF(pagos){
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "landscape"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Pagos a proveedores del mes";
    const headers = [["Proveedor", "CUIT", "Detalle","Fecha", "Monto","Medio de Pago"]];

    const data = pagos.map(p=> [p.proveedor, p.cuit, p.detalle, p.fecha, p.monto, p.medioDePago]);

    let content = {
        startY: 50,
        head: headers,
        body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("pagosMes-report.pdf")
}

const PagosProveedoresDelMesReport  = () => {

    const [pagos, setPagos] = useState([]);

    const retrievePagosDelMes = () => {
        getPagosProveedoresDelMes().then((response) => {
            const pagos = response.data;
            setPagos(pagos);

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err,`${config.appDns}/reportes`,"Hubo un error al buscar los datos del reporte.")
        });
    };

    useEffect(retrievePagosDelMes, []);


    return (
        <div className="list row col-lg-12" >
            <h3><strong>{'Pagos a proveedores del mes actual'}</strong></h3>
            <br/>
            <table className="table table-striped table-fit" style={{'height': '500px', 'width':'100%','overflow':'scroll', 'display': 'block'}}>
                <thead>
                <tr>
                    <th className="col-lg-2">Proveedor</th>
                    <th className="col-lg-2">Cuit</th>
                    <th className="col-lg-4">Detalle</th>
                    <th className="col-lg-1">Fecha</th>
                    <th className="col-lg-1">Monto</th>
                    <th className="col-lg-2">Medio de pago</th>
                </tr>
                </thead>
                <tbody>
                {
                    pagos.map(function(pago)
                    {
                        return (
                            <PagoItem  props={pago} />
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
                    <button className="btn btn-info btn-md" onClick={() => exportPDF(pagos)}>Exportar</button>
                </div>
            </div>
        </div>

    );
}

export default PagosProveedoresDelMesReport;
