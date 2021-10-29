import http from "../http-common";
import { executeWithCatch } from "../http-common";


class ClasesService {

    getAll(params) {
        return http.get("/clases", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    get(id) {
        return executeWithCatch(http.get(`/clases/${id}`))
    }

    create(data) {
        console.log('En create clase '+data)
        return executeWithCatch(http.post("/clases", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/clases/${id}`, data))
    }

    delete(id) {
        return executeWithCatch(http.delete(`/clases/${id}`))
    }

}

export default new ClasesService();
