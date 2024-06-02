import { Box } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/pages/Login/Login.tsx";
import { SeccionEmpresa } from "../components/pages/Empresa/SeccionEmpresa.tsx";
import SeccionSucursal from "../components/pages/Sucursal/SeccionSucursal.tsx";
import PersistentDrawerLeft from "../components/ui/Sidebar/PersistentDrawerLeft.tsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route index path="/login" element={<Login />} />
      <Route path="/empresa" element={<SeccionEmpresa />} />
      <Route path="/sucursal" element={<SeccionSucursal />} />
      <Route
        path="/inicio"
        element={
          <Box sx={{ display: "flex" }}>
            <PersistentDrawerLeft sectionName="Inicio" />
          </Box>
        }
      />
      <Route
        path="/articulo-manufacturado"
        element={
          <Box sx={{ display: "flex" }}>
            <PersistentDrawerLeft sectionName="Artículos manufacturados" />
          </Box>
        }
      />
      <Route
        path="/articulo-insumo"
        element={
          <Box sx={{ display: "flex" }}>
            <PersistentDrawerLeft sectionName="Insumos" />
          </Box>
        }
      />
      <Route
        path="/categoria"
        element={
          <Box sx={{ display: "flex" }}>
            <PersistentDrawerLeft sectionName="Categorías" />
          </Box>
        }
      />
      <Route
        path="/promocion"
        element={
          <Box sx={{ display: "flex" }}>
            <PersistentDrawerLeft sectionName="Promociones" />
          </Box>
        }
      />
      <Route
        path="/usuario"
        element={
          <Box sx={{ display: "flex" }}>
            <PersistentDrawerLeft sectionName="Usuarios" />
          </Box>
        }
      />
      <Route
        path="/unidad-medida"
        element={
          <Box sx={{ display: "flex" }}>
            <PersistentDrawerLeft sectionName="Unidades de Medida" />
          </Box>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;