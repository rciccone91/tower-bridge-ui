import React from "react";
import {Link} from "react-router-dom";

function Reportes(props){

    return(
        <div className="list row col-md-12">
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Deuda mes corriente</h5>
                    <p className="card-text">Lista con los alumnos que adeudan el mes actual, informando también el recargo a pagar.</p>
                    <Link to={"/report2"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Examen internacional</h5>
                    <p className="card-text">Lista a todos aquellos alumnos dados de alta en el sistema que rinden examen internacional.</p>
                    <Link to={"/report3"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Desempeño</h5>
                    <p className="card-text">Lista de alumnos cuyo desempeño no es bueno, mostrando datos de desempeño</p>
                    <Link to={"/report4"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Pagos del mes</h5>
                    <p className="card-text">Lista con todos los pagos a proveedores realizados en el mes corriente.</p>
                    <Link to={"/report5"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Movimientos del Mes</h5>
                    <p className="card-text">Lista con todos los movimientos de dinero ingresados manualmente del mes(salidas y entradas)</p>
                    <Link to={"/report6"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Clases para necesidades específicas</h5>
                    <p className="card-text">Lista con todas las clases que correspondan a un curso que atiende una necesidad específica.</p>
                    <Link to={"/report10"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Valor Examen Internacional</h5>
                    <p className="card-text">Lista con el valor de examen internacional (en dolares) por cada uno de los cursos que se rinden.</p>
                    <Link to={"/report11"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Tres meses adeudados</h5>
                    <p className="card-text">Lista con los alumnos que adeudan 3 o mas meses de arancel.</p>
                    <Link to={"/report1"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Pago a proveedores entre fechas</h5>
                    <p className="card-text">Lista con los pagos a proveedores entre fechas.</p>
                    <Link to={"/report7"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Movimientos de dinero entre fechas</h5>
                    <p className="card-text">Lista con los movimientos manuales de dinero entre fechas</p>
                    <Link to={"/report8"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
            <div className="col-md-1">
            </div>
            <div className="card col-md-5">
                <div className="card-body ">
                    <h5 className="card-title">Clases por dia y horario</h5>
                    <p className="card-text">Lista las clases para un día y rango horario específico</p>
                    <Link to={"/report9"} className="btn btn-primary btn-sm">
                        Ver reporte
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Reportes

