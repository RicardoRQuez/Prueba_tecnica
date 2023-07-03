import express from "express";
import { create } from "express-handlebars";
import axios from "axios";
import cookieParser from "cookie-parser";

import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let ruta = path.resolve(__dirname, "./views");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


const hbs = create({
    partialsDir: [path.join(ruta, "/partials")],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// Ruta para mostrar el formulario de inicio de sesión (ruta "/")
app.get("/", (req, res) => {
    res.render("login"); // Renderizar la vista del formulario de inicio de sesión
});

// Ruta para procesar el formulario de inicio de sesión (ruta "/")
app.post("/", async (req, res) => {
    try {
        // Obtener las credenciales del formulario de inicio de sesión
        const email = req.body.Email;
        const password = req.body.Password;


        // Hacer la solicitud POST a la API para obtener el token de autenticación
        const response = await axios.post("https://devtest.a2g.io/api/Auth", {
            email: email,
            password: password,
        });

        // Obtener el token JWT de la respuesta de la API
        const token = response.data.token;

        // Guardar el token en una cookie (ajusta las opciones según tus necesidades)
        res.cookie("jwt", token, { httpOnly: true });

        // Redirigir al usuario a la página de dashboard
        res.redirect("/plataformas");
    } catch (error) {
        console.error(error);
        // Si ocurre un error al hacer la solicitud a la API, redirigimos al login con el mensaje de error
        res.redirect("/?error=Hubo un problema al iniciar sesión. Por favor, verifica tus credenciales.");
    }
});


app.get("/plataformas", async (req, res) => {
    try {
        // Verificar si el usuario tiene el token JWT en la cookie
        const token = req.cookies.jwt;



        if (!token) {
            // Si el token no existe, redirigir al usuario al formulario de inicio de sesión
            return res.redirect("/");
        }

        // Obtener el número de página actual de la consulta (por ejemplo, a través de req.query)
        const currentPageNumber = parseInt(req.query.pageNumber) || 1;

        // Hacer la solicitud GET a la API para obtener los datos de "Platforms"
        const response = await axios.get(`https://devtest.a2g.io/api/Platforms?pageNumber=${currentPageNumber}&pageSize=10`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Obtener los datos de "Platforms" y el enlace a la página siguiente de la respuesta de la API
        const platformsData = response.data;

        // Guardar plataforma en una cookie (ajusta las opciones según tus necesidades)
        res.cookie("plataformas", JSON.stringify(response.data.data)  , { httpOnly: true });
        
        // Calcula los números de página anterior y siguiente
        const prevPageNumber = currentPageNumber > 1 ? currentPageNumber - 1 : null;
        const nextPageNumber = platformsData.nextPage ? currentPageNumber + 1 : null;

        // Renderiza la vista y pasa los datos y los números de página a la plantilla
        res.render("plataformas", {
            platformsData: platformsData,
            prevPageNumber: prevPageNumber,
            nextPageNumber: nextPageNumber,
        });
    } catch (error) {
        // Manejo de errores...
        console.error(error);
        // Si ocurre un error al hacer la solicitud a la API, redirigimos al login
        res.redirect("/");
    }
});

app.get("/plataformas/detalle/:id", async (req, res) => {
    try {
        // Verificar si el usuario tiene el token JWT en la cookie
        const token = req.cookies.jwt;
        const idPlataforma = req.params.id
        if (!token) {
            // Si el token no existe, redirigir al usuario al formulario de inicio de sesión
            return res.redirect("/");
        }

        // Hacer la solicitud GET a la API para obtener los datos de "Platforms"
        const response = await axios.get(`https://devtest.a2g.io/api/Platforms/${idPlataforma}`, {
            headers: {                      
                Authorization: `Bearer ${token}`,
            },
        });
        const htmlS3 = await axios.get(response.data.data.lastReport, {
           
        });
        console.log(htmlS3.data)
        res.render("plataformasDetalle", {
            data: response.data.data
        });
    }catch(error){
        console.log(error)
    }
    

});


export default app;
