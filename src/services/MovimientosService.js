import http from "../http-common";
import { executeWithCatch } from "../http-common";


class MovimientosService {

    getAll(params) {
        console.log("estoy en el get all movimientos")
        return http.get("/movimientos", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getAll(params) {
        console.log("estoy en el get all movimientos")
        return http.get("/movimientos", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getPaginated(params) {
        return http.get("/movimientos/paginated", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    cajaEstado(){
        return executeWithCatch(http.get(`/caja/estado`))
    }

    get(id) {
        return executeWithCatch(http.get(`/movimientos/${id}`))
    }

    create(data) {
        console.log('En create movimiento '+data)
        return executeWithCatch(http.post("/movimientos", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/movimientos/${id}`, data))
    }

    delete(id,params) {
        return executeWithCatch(http.delete(`/movimientos/${id}`, { params }))
    }

    getEstadoDeCuenta(params) {
        return executeWithCatch(http.get(`/estado-de-cuenta`, { params }))

    }
}

export default new MovimientosService();
