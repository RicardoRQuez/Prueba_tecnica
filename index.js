import app from "./src/app.js"

const main = async () => {
    try {
        console.log("APP conectada a la API...");
        let PORT = 3001;
        app.listen(PORT, () =>
            console.log("Servidor escuchando en http://localhost:" + PORT)
        );
    } catch (error) {
        console.log("Ha ocurrido un error: ", error);
    }
};

main();