import axios from "axios";
import config from "./config"
import swal from '@sweetalert/with-react';


export default axios.create({
  baseURL: `${config.serviceEndpoint}/api`,
  headers: {
    "Content-type": "application/json"
  }
});

export function handleResponse(expectedStatusCode,response,navigate,errorMsg,okMsg)
{
  if(response && response.status === expectedStatusCode){
    swal({
      text: okMsg,
      icon: "success",
      button: "OK"
    }).then(() => {
      window.location = navigate
    })
  } else if( response && response.status !== expectedStatusCode) {
    // alert(errorMsg+". Detalles: "+response.statusText+". "+response.data)
    swal({
      title: "Error",
      text: errorMsg+". Detalles: "+response.statusText+". "+response.data,
      icon: "error",
      button: "OK"
    })
  } else {
    showError(errorMsg,response,navigate)
  }
}

function showError(errorMsg,response,navigate){
  swal({
    title: "Error",
    text: 'Un error inesperado ocurrió al conectarse con los servicios. Por favor contactar al administrador',
    icon: "error",
    button: "OK"
  }).then(() => {
    window.location = navigate
  })
}
