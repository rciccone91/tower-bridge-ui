import React, {useState} from "react";
import config from "../../config"
import {handleError} from "../../http-common";
import jsPDF from "jspdf";
import {Link} from "react-router-dom";
import swal from '@sweetalert/with-react';
import ReportesService from "../../services/ReportesService";

function ClaseItem(props) {
    const clase = props.props

    return (
        <tr className="col-lg-12">
            <td className="col-lg-2">{clase.nombre}</td>
            <td className="col-lg-1">{clase.dia}</td>
            <td className="col-lg-1">{clase.horario}</td>
            <td className="col-lg-3">{clase.descripcion}</td>
            <td className="col-lg-2">{clase.curso}</td>
            <td className="col-lg-3">{clase.profesor}</td>
        </tr>
    );
}

function MovimientosEntreFechas(props) {

    const [clases, setClases] = useState([]);
    const [horarioInicio, setHorarioInicio] = useState(9);
    const [horarioFin, setHorarioFin] = useState(10);
    const [dia, setDia] = useState("LUNES");

    function exportPDF(clases) {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "landscape"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(12);

        const title = `Clases para día ${dia}. Horario: ${horarioInicio} - ${horarioFin}`;
        const headers = [["Nombre", "Dia", "Horario", "Descripción", "Curso", "Profesor"]];

        const data = clases.map(c => [c.nombre, c.dia, c.horario, c.descripcion, c.curso, c.profesor]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("clases-por-dia-horario.pdf")
    }

    function getParams() {
        return {dia: dia, horarioInicio: horarioInicio, horarioFin: horarioFin}
    }


    function retrieveClases() {
        if (horarioFin <= horarioInicio) {
            swal({
                text: 'Rango incorrecto. El horario de finalización de la clase debe ser posterior al de inicio',
                icon: "warning",
                button: "OK"
            })
        } else {
            setClases([])
            ReportesService.getClasesPorDiaYHorario(getParams()).then((response) => {
                if (response.data.length === 0) {
                    swal({
                        text: 'La búsqueda realizada no trajo ningún resultado. Verificar los parámetros ingresados.',
                        icon: "warning",
                        button: "OK"
                    })
                } else {
                    setClases(response.data)
                    console.log(response.data);
                }
            }).catch(err => {
                console.log(err)
                handleError(err, `${config.appDns}/reportes`, "Hubo un error al buscar los datos de las clases.")
            });
        }
    }

    function onChangeDia(e) {
        const dia = e.target.value;
        setDia(dia);
    }

    function onChangeHorarioInicio(e) {
        const horarioInicio = e.target.value;
        setHorarioInicio(horarioInicio);
    }

    function onChangeHorarioFin(e) {
        const horarioFin = e.target.value;
        setHorarioFin(horarioFin);
    }

    return (
        <div className="list row col-lg-12">
            <div>
                <div className="col-md-12">
                    <h3><strong>{'Clases por dia y horario'}</strong></h3>
                </div>
                <br/>
                <div className="row col-lg-12">
                    <div className="row col-lg-4">
                        <label>Día:</label>
                    </div>
                    <div style={{marginLeft: 5}} className="row col-lg-8">
                        <label>Rango horario (Inicio - Fin): </label>
                    </div>
                </div>
                <div className="row col-lg-12">
                    <div className="row col-lg-4">
                        <div className="input-group mb-3">
                            <select
                                name="dia"
                                className={`form-control`}
                                onChange={onChangeDia}
                                defaultValue="LUNES">
                                <option selected value="LUNES">Lunes</option>
                                <option value="MARTES">Martes</option>
                                <option value="MIERCOLES">Miercoles</option>
                                <option value="JUEVES">Jueves</option>
                                <option value="VIERNES">Viernes</option>
                                <option value="SABADO">Sabado</option>
                            </select>
                        </div>
                    </div>
                    <div style={{marginLeft: 5}} className="row col-lg-3">
                        <div className="input-group mb-3">
                            <select
                                name="horarioInicio"
                                defaultValue={9}
                                className={`form-control`}
                                onChange={onChangeHorarioInicio}>
                                <option value={9}>9</option>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                                <option value={12}>12</option>
                                <option value={13}>13</option>
                                <option value={14}>14</option>
                                <option value={15}>15</option>
                                <option value={16}>16</option>
                                <option value={17}>17</option>
                                <option value={18}>18</option>
                                <option value={19}>19</option>
                            </select>
                        </div>
                    </div>
                    <div style={{marginLeft: 5}} className="row col-lg-3">
                        <div className="input-group mb-3">
                            <select
                                name="horarioFin"
                                className={`form-control`}
                                defaultValue={10}
                                onChange={onChangeHorarioFin}>
                                <option value={10}>10</option>
                                <option value={11}>11</option>
                                <option value={12}>12</option>
                                <option value={13}>13</option>
                                <option value={14}>14</option>
                                <option value={15}>15</option>
                                <option value={16}>16</option>
                                <option value={17}>17</option>
                                <option value={18}>18</option>
                                <option value={19}>19</option>
                                <option value={20}>20</option>
                                <option value={21}>21</option>
                            </select>
                        </div>
                    </div>
                    <div style={{marginLeft: 10}} className="row col-lg-2">
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={retrieveClases}
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
                            <th className="col-lg-2">Nombre</th>
                            <th className="col-lg-1">Día</th>
                            <th className="col-lg-1">Horario</th>
                            <th className="col-lg-3">Descripción</th>
                            <th className="col-lg-2">Curso</th>
                            <th className="col-lg-3">Profesor</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            clases.map(function (clase) {
                                return (
                                    <ClaseItem props={clase}/>
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
                            <button className="btn btn-info btn-md" onClick={() => exportPDF(clases)}>Exportar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default MovimientosEntreFechas
