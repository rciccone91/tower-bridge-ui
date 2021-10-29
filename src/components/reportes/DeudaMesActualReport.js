import React, { useState, useEffect }from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { getDeudaMesActualReport } from "../../actions/reportes";

import {handleError } from "../../http-common";
import config from "../../config";
import {Link} from "react-router-dom";

function AlumnoItem(props){
    const alumno = props.props
    return(
            <tr className="col-md-12">
                <td className="col-md-2">{alumno.nombreApellido}</td>
                <td className="col-md-2">{alumno.dni}</td>
                <td className="col-md-2">{alumno.curso}</td>
                <td className="col-md-2">{alumno.clase}</td>
                <td className="col-md-2">{alumno.arancel}</td>
                <td className="col-md-2">{alumno.recargo}</td>
            </tr>
    );
}

function exportPDF(alumnos){
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);

    const title = "Deuda mes actual";
    const headers = [["Nombre", "DNI", "Curso","Clase", "Arancel","Recargo"]];

    const data = alumnos.map(a=> [a.nombreApellido, a.dni, a.curso, a.clase, a.arancel, a.recargo]);

    let content = {
        startY: 50,
        head: headers,
        body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("deudaMes-report.pdf")
}

const DeudaMesActualReport  = () => {

    const [alumnos, setAlumnos] = useState([]);

    const retrieveAlumnos = () => {
        getDeudaMesActualReport().then((response) => {
            const alumnos = response.data;
            setAlumnos(alumnos);

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err,`${config.appDns}/reportes`,"Hubo un error al buscar los datos del reporte.")
        });
    };

    useEffect(retrieveAlumnos, []);


    return (
        <div className="list row col-lg-12" >
                <h3><strong>{'Deuda arancel mes actual'}</strong></h3>
                <br/>
                <table className="table table-striped table-fit" style={{'height': '500px', 'width':'100%','overflow':'scroll', 'display': 'block'}}>
                    <thead>
                    <tr>
                        <th className="col-lg-2">Alumno</th>
                        <th className="col-lg-2">DNI</th>
                        <th className="col-lg-2">Curso</th>
                        <th className="col-lg-2">Clase</th>
                        <th className="col-lg-2">Valor</th>
                        <th className="col-lg-2">Recargo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        alumnos.map(function(alumno)
                        {
                            return (
                                <AlumnoItem  props={alumno} />
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
                    <button className="btn btn-info btn-md" onClick={() => exportPDF(alumnos)}>Exportar</button>
                </div>
            </div>
        </div>

    );
}

export default DeudaMesActualReport;
