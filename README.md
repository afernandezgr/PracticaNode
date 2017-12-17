# Manual de uso de API REST NodePop 

## Consideraciones previas

La API sobreentiende que el motor de base de datos Mongo está en ejecución previamente con un script similar la que se incluye a continuación:

```
./bin/mongod --dbpath ./data/db --directoryperdb
```

El nombre que se le ha dado a la base de datos es: **nodepop**

## Consideraciones previas para despliegue

* Copiar el fichero .env.example a .env y revisar los valores ahí definidos

* Modificar la carpeta *certificados* para incluir en ella los certificados asociados al entorno de Producción.
Importante que el fichero que incluya el certificado se llame **host.cert** y el que incluye la clave privada se llame **host.key**


## Procedimiento para inicializar la base de datos

Desde consola ejecutar el siguiente comando 
```
npm run installDB
```

Reiniciará las colecciones Anuncios y Usuarios presentes en la Base de Datos NodePop

Para ello ejecutará internamente el comando 

```
install_db.js
```

Presente en el directorio init

## Procedimiento para arrancar API en modo single

Desde consola ejecutar el siguiente comando 

```
npm run start
```

## Procedimiento para arrancar API en modo single y conexión https

Desde consola ejecutar el siguiente comando 

```
npm run starthttps
```

Nota: en la carpeta 'certificados' se pueden encontrar los certificados utilizados para securizar la comunicación (se trata de certificados autofirmados por lo cual pueden saltar avisos en los distintos navegadores)
Durante el pase a producción se deberán incluir los certificados asociados al entorno de producción, sustituyendo los empleados (autofirmados) por unos de una CA reconocida.

## Procedimiento para arrancar API en modo cluster

Desde consola ejecutar el siguiente comando 

```
npm run cluster
```


## Métodos disponibles en la API

**Notas previas:**

***_Internacionalización_***

Los mensajes que devuelve la apliación serán devueltos al cliente en base al lenguaje configurado en el cliente, para el API se apoya en la libreria, i18n-node

[https://github.com/mashpie/i18n-node]()

En la carpetea *locale* se encuentra el módulo *CustomError *que cuenta con un método *translateMessage* al que tan solo hay que pasarle la cadena de mensaje especificada que desea ser devuelta en el lenguaje del cliente.
Dentro de la carpeta *locale/translations* existe un fichero JSON, por cada idioma, donde se han incorporado los mensajes de error en los distintos idiomas configurados (inglés y español)

Por ejemplo para inglés:

{

    "USER_NOT_FOUND":"User not found",  
    "INCORRECT_CREDENTIALS":"Incorrect credentials",
    ...
}

Por ejemplo para castellano:

{

    "USER_NOT_FOUND": "Usuario no encontrado",  
    "INCORRECT_CREDENTIALS":"Credenciales incorrecta",
    ...
}

***_Formato respuesta_***

El foramto de repuesta de la API siempre será un JSON, bien si son los resultados de respuesta obtenidos tras la consulta a la base de datos bien si es un JSON de respuesta antes una acción solicitada

Seguirá este formato:

{

    "success": ***,
    "result": ***
}

Donde:
* sucess: Podrá tener el valor true o false en función de que la acción solicitada haya tenido o no éxito
* result: Devolverá un mensaje de respuesta indicando resultado de la acción. El mensaje de respuesta irá en el idioma configurado por el cliente que realiza la llamada a la API

## Métodos asociados a Usuarios
Ruta:
**/apiv1/usuarios**

Tipo: `POST /usuarios`

Descripción: 

Crea un usuaurio en base al nombre, email y clave introducido por el cliente.
Los tres parametros son obligatorios y el email no puede estar repetido en base de datos, dado que es el identificado único que identifica al usuario

Parametros a utilizar:

 * *nombre*: (obligatorio) Nombre del usuario
 * *email*: (obligatorio) Email del usuario (será el usuario empleado para hacer login). Deberá tener un formato válido de email.
 * *clave*: (obligatorio) Clave a asignar al usuario que estamos registrando. En base de datos no se
almacenará nunca la clave propiamente dicha del usuario usuario, sino el hash de dicha *clave*, como medida de seguridad. Esto garantiza la no reversibilidad del datos almacenado. Para una futura versión se podría incluir la opción de 'salt' para la generación del hash, que vendría definida para el usuario en cuestión.
 
Requisitos para dar de alta un usuario:

* Para dar de alta un nuevo usaurio se deberán proporcionar los 3 campos de forma obligatorioa
* El campo email es único y no se puede repetir en base de datos
* El formato de email debe ser un formato válido


## Métodos asociados a Anuncios
Ruta:
**/apiv1/anuncios**

Tipo: `GET /anuncios`

Descripción:

Obtener una lista de anuncios en base a unos filtros proporcionados por el usuario.
Previo a poder obtener la lista de anuncios en base a los criterios que establezca el usuario éste debe estar identificado con un usuario válido y contar con un token válido.
El token puede ser proporcionado a través de la querystring, body o headers.


Parametros a utilizar:

 * *tag*: (opcional) indicaremos una tag cualquiera de las presentes en los anuncios incorporados en base de datos (inicialmente se parten solamente de 4 pero el sistema no está limitado a ese número)
 * *nombre*: (opcional) Filtará los anuncios por cualquier de los anuncios presentes en base de datos cuyo nombre de producto comience por el texto indicado
 * *venta*: (opcional) Podrá tomar el valor true si se trata de anuncios de venta o false si se trata de  anuncios de demanda
 * *precio*: (opcional) se podrá especificar el rango de precio del producto siguiendo este patrón para indicarlo inicio-fin :
    Por ejemplo:
    10-50  buscará  anuncios  con  precio  incluido  entre  estos  valores 10 y 50
         {   precio: {   '$gte':   '10',   '$lte':   '50'   }   }
    10-   buscará   los   que   tengan   precio   mayor   que   10 
         {   precio:   {   '$gte':'10'   }   }
    -50  buscará  los  que  tengan  precio  menor  de  50
         {   precio:   {   '$lte':'50'   }   }
    50  buscará  los  que  tengan  precio  igual  a  50
         {   precio:   '50'   } 
* *sort*: (opcional) Permitirá indicar el nombre del campo por el que deseamos que sean ordenados los resultados
* *skip*: (opcional) Permitirá indicar a partir de que registro queremos mostrar de entre todos los resultados, este parametro en conjunción con limit nos permitirá ir paginando los resultados
* *limit*: (opcional) Permitirá indicar el número de anuncios que queremos que devuelva la consulta, en conjunción con skip nos permitirá ir paginando los resultados
* *token*: (opcional) En cada petición que realice deberá de proporcionar el token previamente facilitado al realizar la autenticación en el sistems (email + clave). 

Ruta:
**/apiv1/anuncios/tags**

Tipo: `GET /anuncios/tags`

Descripción: 

Obtener una lista de las distintas tags presentes en todos los anuncios almacenados en base de datos.
Previo a poder obtener la lista de anuncios en base a los criterios que establezca el usuario éste debe estar identificado con un usuario válido y contar con un token válido.
El token puede ser proporcionado a través de la querystring, body o headers.

Parametros a utilizar:

No requiere de ningún parametro

#Métodos asociados a Autenticación

**/apiv1/authenticate**

Tipo: `POST /authenticate`

Descripción: Permite realizar la validación de un usuario y una constraseña para poder permitir el acceso a los datos almacenados en base de datos. Siguiendo el requerimiento establecido todas las operaciones que realicen a través del API han de ser previamente autenticadas haciendo uso de JWT. Lo cuál permitirá asignar un token de autenticación al usuario y si el email y la clave proporcionada son válidas.
El token asignado tras la autenticación correcta puede ser enviado a través de querystring, body o headers.

Parametros a utilizar:

* *email*: (obligatorio) Email del usuario
* *clave*: (obligatario) Clave del usuario, a la cual se le calculará el hash y se comparará con el hash almacenado en base de datos previo a dar por autenticado al usuario.


**