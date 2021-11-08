import React from "react";
import {Link} from "react-router-dom";

function Finanzas(props){

    return(
        <div className="list row col-lg-12">
            <div className="col-lg-1">
            </div>
            <div className="card col-lg-3">
                <div className="card-body ">
                    <h6 className="card-title">Registrar el cobro de un arancel</h6>
                    <Link to={"/registrar-cobro"} className="btn btn-primary btn-sm">
                        Registrar cobro
                    </Link>
                </div>
            </div>
            <div className="col-lg-1">
            </div>
            <div className="card col-lg-3">
                <div className="card-body ">
                    <h6 className="card-title">Registrar el pago a un proveedor</h6>
                    <Link to={"/registrar-pago"} className="btn btn-primary btn-sm">
                        Registrar pago
                    </Link>
                </div>
            </div>
            <div className="col-lg-1">
            </div>
            <div className="card col-lg-3">
                <div className="card-body ">
                    <h6 className="card-title">Registrar movimiento manual </h6>
                    <Link to={"/registrar-movimiento"} className="btn btn-primary btn-sm">
                        Registrar movimiento
                    </Link>
                </div>
            </div>
            <div className="col-lg-1">
            </div>
            <div className="card col-lg-3">
                <div className="card-body ">
                    <h6 className="card-title">Consultar estado de Caja </h6>
                    <Link to={"/consultar-caja"} className="btn btn-primary btn-sm">
                        Consultar caja
                    </Link>
                </div>
            </div>
            <div className="col-lg-1">
            </div>
            <div className="card col-lg-3">
                <div className="card-body ">
                    <h6 className="card-title">Eliminar registración de cobro</h6>
                    <Link to={"/eliminar-cobro"} className="btn btn-primary btn-sm">
                        Eliminar Cobro
                    </Link>
                </div>
            </div>
            <div className="col-lg-1">
            </div>
            <div className="card col-lg-3">
                <div className="card-body ">
                    <h6 className="card-title">Eliminar registración de pago</h6>
                    <Link to={"/eliminar-pago"} className="btn btn-primary btn-sm">
                        Eliminar Pago
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Finanzas

