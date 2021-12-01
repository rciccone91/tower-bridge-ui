import React, {useState, useEffect} from "react";
import Pagination from "@material-ui/lab/Pagination";
import jsPDFInvoiceTemplate, {OutputType} from "jspdf-invoice-template";

import {handleError, handleResponse} from "../../http-common";
import config from "../../config";
import {getEstadoDeCuenta} from "../../actions/movimientos";

function pdfProps(param)
{
    return {
        outputType: OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: "recibo",
        orientationLandscape: false,
        logo: {
            src: "https://raw.githubusercontent.com/rciccone91/prueba/master/logo-tower.png",
            width: 45.33, //aspect ratio = width/height
            height: 26.66,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {
            name: "Tower bridge School of English",
            address: "José C. Paz 2143, Jose C. Paz, Buenos Aires",
            phone: "(+54) 9 11 3603-9688 /1",
            email: "tower.bridge17@gmail.com",
        },
        contact: {
            label: "Recibo para:",
            name: `${param.nombre}`
        },
        invoice: {
            label: "Recibo ",
            invDate: `Fecha de pago: ${param.fecha}`,
            headerBorder: false,
            tableBodyBorder: false,
            header: ["Descripcion", "            ", "Total"],
            table: Array.from(Array(1), (item, index) => ([
                `Arancel correspondiente a ${param.arancel} para el curso ${param.curso}`,
                `                                  `,
                param.valor,
            ])),
            invTotalLabel: "Total:",
            invTotal: `${param.valor}`,

            invDescLabel: "Nota",
            invDesc: "El presente recibo es un documento válido. Este comprobante de pago es reconocido por parte del instituto Tower Brdige y acredita el pago del arancel según descripto en el mismo",
        },
        footer: {
            text: "Towr Bridge School of English",
        },
        pageEnable: true,
        pageLabel: "Page ",
    }
}


const EstadoDeCuenta = (props) => {

    const alumnoId = props && props.props ? parseInt(localStorage.getItem("id"), 10) : undefined
    const [movimientos, setMovimientos] = useState([]);
    const [currentMovimiento, setCurrentMovimiento] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);


    const getRequestParams = (alumnoId, page) => {
        let params = {};
        if (alumnoId) {
            params["alumnoId"] = alumnoId;
        }

        if (page) {
            params["page"] = page - 1;
        }

        return params;
    };

    const retrieveMovimientos = () => {
        const params = getRequestParams(alumnoId, page);
        getEstadoDeCuenta(params).then((response) => {
            const {movimientos, totalPages} = response.data;

            setMovimientos(movimientos);
            setCount(totalPages);
            setCurrentIndex(-1)
            setCurrentMovimiento(null)

            console.log(response.data);
        }).catch(err => {
            console.log(err)
            handleError(err, `${config.appDns}/home`, "Hubo un error al buscar los datos del estado de cuenta")
        });
    };

    useEffect(retrieveMovimientos, [page]);


    const handlePageChange = (event, value) => {
        setPage(value);
    };


    const setActiveMovimiento = (movimiento, index) => {
        setCurrentMovimiento(movimiento);
        setCurrentIndex(index);
    };


    function generarYDescargarRecibo() {
        jsPDFInvoiceTemplate(pdfProps(currentMovimiento));
    }

    return (
        <div className="list row col-md-12">
            <div className="col-md-6">
                <h4>Estado de cuenta</h4>

                <div className="mt-3">
                    <Pagination
                        className="my-3"
                        count={count}
                        page={page}
                        siblingCount={1}
                        boundaryCount={1}
                        variant="outlined"
                        shape="rounded"
                        size="small"
                        onChange={handlePageChange}
                    />
                </div>

                <ul className="list-group row-cols-md-8">
                    {movimientos &&
                    movimientos.map((movimiento, index) => (
                        <li
                            className={
                                "list-group-item " +
                                (index === currentIndex ? "active" : "")
                            }
                            onClick={() => setActiveMovimiento(movimiento, index)}
                            key={index}
                        >
                            {movimiento.arancel} - {movimiento.estado}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-md-6">
                {currentMovimiento ? (
                    <div>
                        <h4>Movimiento</h4>
                        <div>
                            <label>
                                <strong>Mes:</strong>
                            </label>{" "}
                            {currentMovimiento.arancel}
                        </div>
                        <div>
                            <label>
                                <strong>Estado:</strong>
                            </label>{" "}
                            {currentMovimiento.estado}
                        </div>
                        <div>
                            <label>
                                <strong>Curso:</strong>
                            </label>{" "}
                            {currentMovimiento.curso}
                        </div>
                        <div>
                            <label>
                                <strong>Valor arancel:</strong>
                            </label>{" "}
                            {currentMovimiento.valor}
                        </div>
                        <div>
                            <label>
                                <strong>Recargo:</strong>
                            </label>{" "}
                            {currentMovimiento.recargo}
                        </div>
                        <button
                            disabled={currentMovimiento.estado === 'Adeudado'}
                            className="btn btn-info btn-sm"
                            onClick={generarYDescargarRecibo}
                        >
                            Descargar Recibo
                        </button>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Por favor, seleccione un arancel...</p>
                    </div>
                )}
            </div>
        </div>
    );
    // }
}

export default EstadoDeCuenta;
