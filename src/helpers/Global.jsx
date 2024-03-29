
export const Global = {
    //para trabajar en local
    //url: 'http://localhost:3900/api/'
    //para trabajar en un entorno de produccion real usando variables de entorno
    
  
    url: import.meta.env.VITE_REACT_APP_API_URL
    //url: import.meta.env.VITE_LOCAL_REACT_APP_API_URL
   

}

