import http from "../http-common";
import { executeWithCatch } from "../http-common";


class CursosService {

    getAll(params) {
        return http.get("/cursos", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    get(id) {
        return executeWithCatch(http.get(`/cursos/${id}`))
    }

    create(data) {
        console.log('En create clase '+data)
        return executeWithCatch(http.post("/cursos", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/cursos/${id}`, data))
    }

    delete(id) {
        return executeWithCatch(http.delete(`/cursos/${id}`))
    }

    getAllAAsignar() {
        return executeWithCatch(http.get(`/cursos/a-asignar`))
    }
}

export default new CursosService();
