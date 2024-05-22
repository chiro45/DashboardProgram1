import React from "react";
import { ICategoria } from "../../../types/Categoria/ICategoria";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import { IconButton, List } from "@mui/material";
import { EditRounded } from "@mui/icons-material";
import { SwitchButton } from "../../ui/ButtonsTable/Switch";
import "./category.css";
import { ModalEditCategorias } from "../../ui/modals/ModalCategorias/ModalEditCategorias";
import { ICategoriaPost } from "../../../types/Categoria/ICategoriaPost";

interface CategoryItemProps {
  category: ICategoria;
  padding: number;
  handleUpdate: (id: number, category: ICategoria) => void;
  handleSave: (category: ICategoriaPost) => void;
  addSubCategoria: (id: number, subcategoria: ICategoriaPost) => void;
}
export const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  padding,
  handleUpdate,
  handleSave,
  addSubCategoria,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => setOpen(!open);
  const [openModal, setOpenModal] = React.useState(false);


  return (
    <div>
      <ListItemButton sx={{ pl: padding }}>
        <ListItemIcon>
          <GridViewOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary={category.denominacion} />
        <div style={{ padding: "10px" }}>
          <IconButton color="primary" onClick={() => setOpenModal(true)}>
            <EditRounded />
          </IconButton>
          <SwitchButton id={category.id} currentState={category.eliminado}/>
        </div>
        {category.subcategorias && category.subcategorias.length > 0 ? (
          open ? (
            <ExpandLess onClick={handleClick} />
          ) : (
            <ExpandMore onClick={handleClick} />
          )
        ) : null}
      </ListItemButton>
      {category.subcategorias && category.subcategorias.length > 0 && (
        <>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {category.subcategorias.map((subcategory) => (
                <CategoryItem
                  key={subcategory.id}
                  category={subcategory}
                  padding={padding ? padding + 4 : 4}
                  handleUpdate={handleUpdate}
                  handleSave={handleSave}
                  addSubCategoria={addSubCategoria}
                />
              ))}
            </List>
          </Collapse>
        </>
      )}
      <ModalEditCategorias
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleUpdate={handleUpdate}
        categoria={category}
        addSubCategoria={addSubCategoria}
        />
    </div>
  );
};
