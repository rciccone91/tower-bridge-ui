import http from "../http-common";
import { executeWithCatch } from "../http-common";


class MovimientosService {

    getAll(params) {
        return http.get("/movimientos", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
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

    delete(id) {
        return executeWithCatch(http.delete(`/movimientos/${id}`))
    }

}

export default new MovimientosService();
