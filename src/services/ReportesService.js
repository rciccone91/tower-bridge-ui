import http from "../http-common";

class ReportesService {

    getExamenInternacionalReport() {
        return http.get("/reportes/examen-internacional").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getDeudaMesActualReport() {
        return http.get("/reportes/mes-adeudado").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getTresMesesAdeudadosReport() {
        return http.get("/reportes/tres-meses-adeudados").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getAlumnosConMalDesempenioReport() {
        return http.get("/reportes/mal-desempenio").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getPagosProveedoresDelMes() {
        return http.get("/reportes/pagos-del-mes").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getMovimientosManualesDelMes() {
        return http.get("/reportes/movimientos-manuales-del-mes").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getCursosValorExamen() {
        return http.get("/cursos/valor-examen").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getClasesDeCursosEspecificosReport() {
        return http.get("/reportes/clases-cursos-especificos").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getClasesPorDiaYHorario(params) {
        return http.get("/reportes/clases-por-horario", {params}).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }
}

export default new ReportesService();
