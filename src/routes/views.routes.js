import { Router } from "express";
import { loginController } from "../controllers/views/login.controller.js";
import { plataformasController } from "../controllers/views/plataformas.controller.js";
import { plataformasDetalleController } from "../controllers/views/plataformasDetalle.Controller.js"
const router = Router();

router.get("/", loginController);
router.get("/plataformas", plataformasController);
router.get("/plataformas/detalle", plataformasDetalleController);



export default router;