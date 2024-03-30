# Proyecto Red Social
Red Social con MERN STACK

Dependencias a usar:

Un framework de aplicación web rápido, minimalista y flexible para Node.js. Se utiliza para crear aplicaciones web y APIs.

npm i express
npm i @types/express --save-dev

Una biblioteca de modelado de objetos de MongoDB para Node.js. Proporciona una solución sencilla basada en esquemas para modelar los datos de la aplicación.

npm i mongoose
npm i @types/mongoose --save-dev (deprecated )

Un plugin de paginación para Mongoose. Permite paginar los resultados de las consultas a la base de datos de manera conveniente.

npm i mongoose-pagination

Un middleware de Node.js para manejar datos de formularios en el servidor. Se utiliza comúnmente para procesar la carga de archivos en aplicaciones web.

npm i multer

Una biblioteca para analizar, validar, manipular y formatear fechas en JavaScript. Es muy útil para trabajar con fechas y horas de una manera fácil y flexible.

npm i moment
npm i @types/moment --save-d (deprecated )

Una biblioteca de validación para JavaScript y Node.js. Se utiliza para validar datos como cadenas de texto, números, fechas, etc., según ciertos criterios.

npm i validator
npm i @types/validator --save-d

Un módulo para cifrar contraseñas en Node.js utilizando el algoritmo de hash bcrypt

npm i bcrypt-nodejs (deprecated, remplazar por bcrypt or bcryptjs )
npm i @types/bcrypt-nodejs --save-d

Una biblioteca simple para codificar y decodificar tokens JWT (JSON Web Tokens). Se utiliza para autenticación y autorización en aplicaciones web y APIs.

npm i jwt-simple

Un middleware para Express que permite el acceso a recursos de diferentes dominios en el navegador

npm i cors

Una utilidad que reinicia automáticamente la aplicación Node.js cuando se detectan cambios en los archivos del proyecto. Es útil durante el desarrollo para evitar tener que reiniciar manualmente el servidor después de cada cambio en el código.

npm i nodemon --save-d

para cargar las variables de entorno
npm i dotenv

ayuda  a proteger las aplicaciones de node
npm i helmet

comprimir las respuestas HTTP enviadas desde el servidor y reducir el tamaño de los datos que se envían desde el servidor al cliente lo que resulta en una transferencia más rápida de los recursos y una mejora en el rendimiento de la aplicación web

CONFIGURACION DE PACKAGE.JSON 

para ejecutarse en entorno de produccion con pm2

"build": "tsc",

"start": "npm run build && pm2 start dist/index.js"

para ejecutarse de manera local con nodemon

"start": "nodemon dist/index.js",
