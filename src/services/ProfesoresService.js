import http from "../http-common";

class ProfesoresService {
    getAll() {

        return http.get("/profesores").catch(error => {
            if (!error.response) {
                // network error
                alert('Un error inesperado ocurrió al buscar los datos. Por favor contactar al administrador');
            } else {
                this.errorStatus = error.response.data.message;
            }
        });
    }

    get(id) {
        return http.get(`/profesores/${id}`).catch(error => {
            if (!error.response) {
                // network error
                alert('Un error inesperado ocurrió al buscar los datos. Por favor contactar al administrador');
            } else {
                this.errorStatus = error.response.data.message;
            }
        });
    }

    create(data) {
        return http.post("/profesores", data).catch(error => {
            if (!error.response) {
                // network error
                alert('Un error inesperado ocurrió al buscar los datos. Por favor contactar al administrador');
            } else {
                this.errorStatus = error.response.data.message;
            }
        });
    }

    update(id, data) {
        return http.put(`/profesores/${id}`, data).catch(error => {
            if (!error.response) {
                // network error
                alert('Un error inesperado ocurrió al buscar los datos. Por favor contactar al administrador');
            } else {
                this.errorStatus = error.response.data.message;
            }
        });
    }

    delete(id) {
        return http.delete(`/profesores/${id}`).catch(error => {
            if (!error.response) {
                // network error
                alert('Un error inesperado ocurrió al buscar los datos. Por favor contactar al administrador');
            } else {
                this.errorStatus = error.response.data.message;
            }
        });
    }

//   deleteAll() {
//     return http.delete(`/tutorials`);
//   }

//   findByTitle(title) {
//     return http.get(`/tutorials?title=${title}`);
//   }
}

export default new ProfesoresService();
