import http from "../http-common";
import { executeWithCatch } from "../http-common";


class ProveedoresService {

    getAll() {
        return http.get("/proveedores").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    get(id) {
        return executeWithCatch(http.get(`/proveedores/${id}`))
    }

    create(data) {
        console.log('En create clase '+data)
        return executeWithCatch(http.post("/proveedores", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/proveedores/${id}`, data))
    }

    delete(id) {
        return executeWithCatch(http.delete(`/proveedores/${id}`))
    }

    getAllAAsignar() {
        return executeWithCatch(http.get(`/proveedores/a-asignar`))
    }
}

export default new ProveedoresService();
