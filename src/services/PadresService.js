import http from "../http-common";
import { executeWithCatch } from "../http-common";


class PadresService {

    getAll(params) {
        return http.get("/padres", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getAllForSelect() {
        return http.get("/padres/all").catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    get(id) {
        return executeWithCatch(http.get(`/padres/${id}`))
    }

    create(data) {
        return executeWithCatch(http.post("/padres", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/padres/${id}`, data))
    }

    delete(id) {
        return executeWithCatch(http.delete(`/padres/${id}`))
    }

}

export default new PadresService();
