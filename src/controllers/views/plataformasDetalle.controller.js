export const plataformasDetalleController = async (req, res) => {
    try {
        res.render("plataformasDetalles");
    } catch (error) {
        res.status(500).send("Error al cargar la página solicitada.");
    }
}; 