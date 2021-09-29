import axios from "axios";
import config from "./config"
import swal from '@sweetalert/with-react';


export default axios.create({
  baseURL: `${config.serviceEndpoint}/api`,
  headers: {
    "Content-type": "application/json"
  }
});


export function handleError(errorResponse,navigate,errorMsg)
{
  if(errorResponse && errorResponse.data) {
    swal({
      title: "Error",
      text: errorMsg+". Detalles: "+errorResponse.data.errorMessage,
      icon: "error",
      button: "OK"
    })
  } else {
    showError(navigate)
  }
}

export function handleResponse(expectedStatusCode,response,navigate,okMsg)
{
  if(response && response.status === expectedStatusCode){
    swal({
      text: okMsg,
      icon: "success",
      button: "OK"
    }).then(() => {
      window.location = navigate
    })
  } else {
    showError(navigate)
  }
}

function showError(navigate){
  swal({
    title: "Error",
    text: 'Un error inesperado ocurrió al conectarse con los servicios. Por favor contactar al administrador',
    icon: "error",
    button: "OK"
  }).then(() => {
    window.location = navigate
  })
}

export function executeWithCatch(request){
  return request.catch(error => {
    if (!error.response) {
      console.log(error.stack)
      return Promise.reject();
    } else {
      return Promise.reject(error.response);
    }
  });
}
