import React, { useState, useEffect }from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { getAlumnosConMalDesempenioReport } from "../../actions/reportes";

import {handleError } from "../../http-common";
import config from "../../config";
import {Link} from "react-router-dom";

function AlumnoItem(props){
    const alumno = props.props
    return(
        <tr className="col-md-12">
            <td className="col-md-3">{alumno.nombreApellido}</td>
            <td className="col-md-3">{alumno.dni}</td>
            <td className="col-md-1">{alumno.escritura}</td>
            <td className="col-md-1">{alumno.escucha}</td>
            <td className="col-md-1">{alumno.fonetica}</td>
            <td className="col-md-1">{alumno.gramatica}</td>
            <td className="col-md-1">{alumno.lectura}</td>
            <td className="col-md-1">{alumno.vocabulario}</td>
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

    const title = "Almunos cuyo desempeño no es bueno";
    const headers = [["Nombre", "DNI", "Escritura","Escucha", "Fonetica","Gramatica","Lectura","Vocabulario" ]];

    const data = alumnos.map(a=> [a.nombreApellido, a.dni, a.escritura, a.escucha, a.fonetica, a.gramatica, a.lectura, a.vocabulario]);

    let content = {
        startY: 50,
        head: headers,
        body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("desempenio-report.pdf")
}

const AlumnosConMalDesempenioReport  = () => {

    const [alumnos, setAlumnos] = useState([]);

    const retrieveAlumnos = () => {
        getAlumnosConMalDesempenioReport().then((response) => {
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
            <h3><strong>{'Almunos cuyo desempeño no es bueno'}</strong></h3>
            <br/>
            <table className="table table-striped table-fit" style={{'height': '500px', 'width':'100%','overflow':'scroll', 'display': 'block'}}>
                <thead>
                <tr>
                    <th className="col-lg-3">Alumno</th>
                    <th className="col-lg-3">DNI</th>
                    <th className="col-lg-1">Escritura</th>
                    <th className="col-lg-1">Escucha</th>
                    <th className="col-lg-1">Fonetica</th>
                    <th className="col-lg-1">Gramatica</th>
                    <th className="col-lg-1">Lectura</th>
                    <th className="col-lg-1">Vocabulario</th>
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

export default AlumnosConMalDesempenioReport;
