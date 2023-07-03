
export const loginController = async (req, res) => {
    try {
      // Verificar si hay un mensaje de error en los parámetros de la solicitud
      const errorMessage = req.query.error;
  
      res.render("login", { errorMessage: errorMessage }); // Renderizar la vista del formulario de inicio de sesión
    } catch (error) {
      res.status(500).send("Error al cargar la página solicitada.");
    }
  };