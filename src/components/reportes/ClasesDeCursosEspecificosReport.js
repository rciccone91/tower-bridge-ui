import React, { useState, useEffect }from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { getClasesDeCursosEspecificosReport } from "../../actions/reportes";

import {handleError } from "../../http-common";
import config from "../../config";
import {Link} from "react-router-dom";

function ClaseItem(props){
    const clase = props.props
    return(
        <tr className="col-md-12">
            <td className="col-md-3">{clase.clase}</td>
            <td className="col-md-3">{clase.dia}</td>
            <td className="col-md-3">{clase.curso}</td>
            <td className="col-md-3">{clase.profesor}</td>
        </tr>
    );
}

function exportPDF(clases){
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Clases para necesidades especificas";
    const headers = [["Clase", "Día", "Curso","Profesor"]];

    const data = clases.map(c=> [c.clase, c.dia, c.curso, c.profesor]);

    let content = {
        startY: 50,
        head: headers,
        body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("clasesEspcificas-report.pdf")
}

const ClasesDeCursosEspecificosReport  = () => {

    const [clases, setClases] = useState([]);

    const retrieveClases = () => {
        getClasesDeCursosEspecificosReport().then((response) => {
            const clases = response.data;
            setClases(clases);

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err,`${config.appDns}/reportes`,"Hubo un error al buscar los datos del reporte.")
        });
    };

    useEffect(retrieveClases, []);


    return (
        <div className="list row col-lg-12" >
            <h3><strong>{'Clases para necesidades específicas'}</strong></h3>
            <br/>
            <table className="table table-striped table-fit" style={{'height': '500px', 'width':'100%','overflow':'scroll', 'display': 'block'}}>
                <thead>
                <tr>
                    <th className="col-lg-3">Clase</th>
                    <th className="col-lg-3">Dia</th>
                    <th className="col-lg-3">Curso</th>
                    <th className="col-lg-3">Profesor</th>
                </tr>
                </thead>
                <tbody>
                {
                    clases.map(function(clase)
                    {
                        return (
                            <ClaseItem  props={clase} />
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
                    <button className="btn btn-info btn-md" onClick={() => exportPDF(clases)}>Exportar</button>
                </div>
            </div>
        </div>

    );
}

export default ClasesDeCursosEspecificosReport;
