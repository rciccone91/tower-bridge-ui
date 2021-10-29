import React, { useState, useEffect }from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {  getCursosValorExamen } from "../../actions/reportes";

import {handleError } from "../../http-common";
import config from "../../config";
import {Link} from "react-router-dom";

function CursoItem(props){
    const curso = props.props
    return(
        <tr className="col-md-12">
            <td className="col-md-4">{curso.nombre}</td>
            <td className="col-md-4">{curso.arancel}</td>
            <td className="col-md-4">{curso.valorExamen}</td>
        </tr>
    );
}

function exportPDF(cursos){
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Valor examenes internacionales";
    const headers = [["Curso", "Arancel", "Valor Examen"]];

    const data = cursos.map(c=> [c.nombre, c.arancel, c.valorExamen ]);

    let content = {
        startY: 50,
        head: headers,
        body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("valorExamen-report.pdf")
}

const ValorExamenInternacionalReport  = () => {

    const [cursos, setCursos] = useState([]);

    const retrieveCursos = () => {
        getCursosValorExamen().then((response) => {
            const cursos = response.data;
            setCursos(cursos);

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err,`${config.appDns}/reportes`,"Hubo un error al buscar los datos del reporte.")
        });
    };

    useEffect(retrieveCursos, []);


    return (
        <div className="list row col-lg-12" >
            <h3><strong>{'Valor de exámenes internacionales'}</strong></h3>
            <br/>
            <table className="table table-striped table-fit" style={{'height': '500px', 'width':'100%','overflow':'scroll', 'display': 'block'}}>
                <thead>
                <tr>
                    <th className="col-lg-4">Curso</th>
                    <th className="col-lg-4">Arancel</th>
                    <th className="col-lg-4">Valor Examen</th>
                </tr>
                </thead>
                <tbody>
                {
                    cursos.map(function(curso)
                    {
                        return (
                            <CursoItem  props={curso} />
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
                    <button className="btn btn-info btn-md" onClick={() => exportPDF(cursos)}>Exportar</button>
                </div>
            </div>
        </div>

    );
}

export default ValorExamenInternacionalReport;
