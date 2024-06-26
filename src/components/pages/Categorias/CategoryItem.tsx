import React from "react";
// ---------- ARCHIVOS----------
import { ICategoria } from "../../../types/Categoria/ICategoria";
import { ICategoriaPost } from "../../../types/Categoria/ICategoriaPost";
import { ModalEditCategorias } from "../../ui/modals/ModalCategorias/ModalEditCategorias";
import { ButtonsTable } from "../../ui/ButtonsTable/ButtonsTable";
// ---------- ESTILOS ----------
import {
  Chip,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

// ------------------------------ CÓDIGO ------------------------------
// -------------------- INTERFAZ --------------------
interface CategoryItemProps {
  category: ICategoria;
  padding: number;
  handleUpdate: (id: number, category: ICategoriaPost) => void;
  handleSave: (category: ICategoriaPost) => void;
  addSubCategoria: (id: number, subcategoria: ICategoriaPost) => void;
  handleDelete: (id: number) => void;
  reloadPagina: () => void;
  isCategoriaPadre: boolean;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  padding,
  handleUpdate,
  handleSave,
  addSubCategoria,
  handleDelete,
  reloadPagina,
  isCategoriaPadre,
}) => {
  // -------------------- STATES --------------------
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number>();

  // -------------------- FUNCIONES --------------------
  const handleClick = () => setOpen(!open);

  return (
    <div>
      <ListItemButton sx={{ pl: padding }}>
        <ListItemIcon>
          <GridViewOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary={category.denominacion} />
        <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
          {category.esParaElaborar ? (
            <>
              <Chip
                label="Para elaborar"
                variant="outlined"
                color="primary"
                sx={{ alignSelf: "center" }}
              />
            </>
          ) : null}
          <ButtonsTable
            setSelectedId={setSelectedId}
            setOpenModal={() => setOpenModal(true)}
            el={category}
            handleDelete={handleDelete}
          />
        </div>
        {category.subCategorias && category.subCategorias.length > 0 ? (
          open ? (
            <ExpandLess onClick={handleClick} />
          ) : (
            <ExpandMore onClick={handleClick} />
          )
        ) : null}
      </ListItemButton>
      {category.subCategorias && category.subCategorias.length > 0 && (
        <>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.subCategorias.map((subcategory) => (
                <CategoryItem
                  key={subcategory.id}
                  category={subcategory}
                  padding={padding ? padding + 4 : 4}
                  handleUpdate={handleUpdate}
                  handleSave={handleSave}
                  addSubCategoria={addSubCategoria}
                  handleDelete={handleDelete}
                  reloadPagina={reloadPagina}
                  isCategoriaPadre={false}
                />
              ))}
            </List>
          </Collapse>
        </>
      )}
      <ModalEditCategorias
        show={openModal}
        handleClose={() => setOpenModal(false)}
        selectedId={selectedId}
        reloadPagina={reloadPagina}
        isCategoriaPadre={isCategoriaPadre}
      />
    </div>
  );
};
