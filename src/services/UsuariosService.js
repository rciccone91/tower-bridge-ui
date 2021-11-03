import http from "../http-common";
import { executeWithCatch } from "../http-common";


class UsuariosService {

    getAll(params) {
        return http.get("/usuarios", { params }).catch(error => {
            if (!error.response) {
                console.log(error.stack)
                return Promise.reject();
            } else {
                return Promise.reject(error.response);
            }
        });
    }

    getAllAAsignar(perfil) {
        return executeWithCatch(http.get(`/usuarios/a-asignar?perfil=`+perfil))
    }

    get(id) {
        return executeWithCatch(http.get(`/usuarios/${id}`))
    }

    create(data) {
        return executeWithCatch(http.post("/usuarios", data))
    }

    update(id, data) {
        return executeWithCatch(http.patch(`/usuarios/${id}`, data))
    }

    delete(id) {
        return executeWithCatch(http.delete(`/usuarios/${id}`))
    }

    login(data){
        return executeWithCatch(http.post(`/login`,data))
    }

}

export default new UsuariosService();
