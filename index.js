const url = require("url");
const http = require('http');
const fs = require('fs');  // * 1. Ocupar el módulo File System para la manipulación de archivos alojados en el servidor (3 Puntos)
const axios = require("axios")
const { v4: uuidv4 } = require("uuid");
const { Console } = require("console");



const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    let roommatesJSON = JSON.parse(fs.readFileSync("roommates.json", "utf8"));
    let usuarios = roommatesJSON.roommates;

    let gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "utf8"));
    let gastos = gastosJSON.gastos;




    if (req.url == "/" && req.method === "GET") {
        res.setHeader("content-type", "text/html");
        const html = fs.readFileSync("index.html", "utf8");
        res.end(html);
    }



    /**
    2. Capturar los errores para condicionar el código a través del manejo de excepciones.
    (1 Punto)
     */





    /**
 3. El botón “Agregar roommate” de la aplicación cliente genera una petición POST (sin
 payload) esperando que el servidor registre un nuevo roommate random con la API
 randomuser, por lo que debes preparar una ruta POST /roommate en el servidor que
 ejecute una función asíncrona importada de un archivo externo al del servidor (la
 función debe ser un módulo), para obtener la data de un nuevo usuario y la acumule
 en un JSON (roommates.json).
 
 El objeto correspondiente al usuario que se almacenará debe tener un id generado
 con el paquete UUID. (2 Puntos)
  */
    if (req.url == "/roommate" && req.method === "POST") {
        axios
            .get("https://randomuser.me/api/")
            .then((datos) => {
                let randomUser = datos.data.results[0];
                randomrommate = {
                    id: uuidv4().slice(30),
                    nombre: randomUser.name.first,
                    debe: 0,
                    recibe: 50000
                };
                usuarios.push(randomrommate);
                fs.writeFileSync("roommates.json", JSON.stringify(roommatesJSON));
                res.end(JSON.stringify(roommatesJSON));
            })
            // Paso 4
            .catch((e) => {
                res.end(e.message);
            });
    }






    /**
    4. Crear una API REST que contenga las siguientes rutas:
    a. GET /gastos: Devuelve todos los gastos almacenados en el archivo
    gastos.json.
     */
    if (req.url.startsWith("/gastos") && req.method == "GET") {
        //  console.log(gastosJSON);
        res.end(JSON.stringify(gastosJSON));
    }




    /**
    b. POST /gasto: Recibe el payload con los datos del gasto y los almacena en un
    archivo JSON (gastos.json).
     */
    if (req.url.startsWith("/gasto") && req.method == "POST") {
        let body;
        req.on("data", (payload) => {
            body = JSON.parse(payload);
        });
        console.log(body);
        req.on("end", () => {
            nuevoGasto = {
                id: uuidv4().slice(30),
                roommate: body.roommate,
                descripcion: body.descripcion,
                monto: body.monto
            };
            gastos.push(nuevoGasto);
            fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
            res.end();
        });
    }






    /**
    c. PUT /gasto: Recibe el payload de la consulta y modifica los datos
    almacenados en el servidor (gastos.json).
     */
    if (req.url.startsWith("/gasto") && req.method == "PUT") {
        let body;
        const { id } = url.parse(req.url, true).query;
        req.on("data", (payload) => {
        body = JSON.parse(payload);
        });
        console.log(id);
        req.on("end", () => {
            gastosJSON.gastos = gastos.map((b) => {
                if (b.id == id) {
                    return body;
                }
                return b;
            });
            fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
            res.end();
        });
    }






    /**
    d. DELETE /gasto: Recibe el id del gasto usando las Query Strings y la elimine
    del historial de gastos (gastos.json).
     */
    if (req.url.startsWith("/gasto") && req.method == "DELETE") {
        // Paso 3
        const { id } = url.parse(req.url, true).query;
        // Paso 4
        gastosJSON.gastos = gastos.filter((b) => b.id !== id);
        // Paso 5
        fs.writeFileSync("gastos.json",
            JSON.stringify(gastosJSON));
        res.end();
    }



    /**
    e. GET /roommates: Devuelve todos los roommates almacenados en el servidor
    (roommates.json)
    Se debe considerar recalcular y actualizar las cuentas de los roommates luego de
    este proceso. (3 Puntos)
     */
    if (req.url.startsWith("/roommates") && req.method == "GET") {
        //  console.log(roommatesJSON);
        res.end(JSON.stringify(roommatesJSON));
    }



    /**
    5. Devolver los códigos de estado HTTP correspondientes a cada situación. (1 Punto)
     */




    /**
    6. Enviar un correo electrónico a todos los roommates cuando se registre un nuevo
    gasto. Se recomienda agregar a la lista de correos su correo personal para verificar
    esta funcionalidad. (Opcional)
     */











}).listen(PORT, () => {
    console.log('SERVER CORRIENDO EN EL PUERTO: ' + PORT);
});



















/**

* Rutas que debes crear en tu servidor:
● / GET: Debe devolver el documento HTML disponibilizado en el apoyo.
● /roommate POST: Almacena un nuevo roommate ocupando random user.
● /roommate GET: Devuelve todos los roommates almacenados.
● /gastos GET: Devuelve el historial con todos los gastos registrados.
● /gasto PUT: Edita los datos de un gasto.
● /gasto DELETE: Elimina un gasto del historial.

 */