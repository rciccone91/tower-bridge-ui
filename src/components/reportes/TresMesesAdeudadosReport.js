import React, { useState, useEffect }from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {  getTresMesesAdeudados } from "../../actions/reportes";

import {handleError } from "../../http-common";
import config from "../../config";
import {Link} from "react-router-dom";

function AdeudadoItem(props){
    const adeudado = props.props
    return(
        <tr className="col-md-12">
            <td className="col-md-4">{adeudado.nombre}</td>
            <td className="col-md-4">{adeudado.dni}</td>
            <td className="col-md-4">{adeudado.mesesAdeudados}</td>
        </tr>
    );
}

function exportPDF(adeudados){
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Valor examenes internacionales";
    const headers = [["Nombre", "DNI", "Meses Adeudados"]];

    const data = adeudados.map(c=> [c.nombre, c.dni, c.mesesAdeudados ]);

    let content = {
        startY: 50,
        head: headers,
        body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("tre-meses-adeudados-report.pdf")
}

const TresMesesAdeudadosReport  = () => {

    const [adeudados, setAdeudados] = useState([]);

    const retrieveAdeudados = () => {
        getTresMesesAdeudados().then((response) => {
            const adeudados = response.data;
            setAdeudados(adeudados);

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err,`${config.appDns}/reportes`,"Hubo un error al buscar los datos del reporte.")
        });
    };

    useEffect(retrieveAdeudados, []);


    return (
        <div className="list row col-lg-12" >
            <h3><strong>{'Alumnos con 3 meses o mas adeudados'}</strong></h3>
            <br/>
            <table className="table table-striped table-fit" style={{'height': '500px', 'width':'100%','overflow':'scroll', 'display': 'block'}}>
                <thead>
                <tr>
                    <th className="col-lg-4">Nombre</th>
                    <th className="col-lg-4">DNI</th>
                    <th className="col-lg-4">Meses adeudados</th>
                </tr>
                </thead>
                <tbody>
                {
                    adeudados.map(function(adeudado)
                    {
                        return (
                            <AdeudadoItem  props={adeudado} />
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
                    <button className="btn btn-info btn-md" onClick={() => exportPDF(adeudados)}>Exportar</button>
                </div>
            </div>
        </div>

    );
}

export default TresMesesAdeudadosReport;
