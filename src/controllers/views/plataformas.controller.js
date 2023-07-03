
export const plataformasController = async (req, res) => {
    try {
        res.render("plataformas");
    } catch (error) {
        res.status(500).send("Error al cargar la página solicitada.");
    }
}; 