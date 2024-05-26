import * as React from "react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// ---------- ARCHIVOS----------
import { useAppSelector } from "../../../hooks/redux";
import { CategoriaService } from "../../../services/CategoriaService";
import { ICategoria } from "../../../types/Categoria/ICategoria";
import { ICategoriaPost } from "../../../types/Categoria/ICategoriaPost";
import { CategoriaModal } from "../../ui/modals/ModalCategorias/ModalCategorias";
import { CategoryItem } from "./CategoryItem";
import { Loader } from "../../ui/Loader/Loader";
// ---------- ESTILOS ----------
import { IconButton, InputBase, List, alpha, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

// ------------------------------ CÓDIGO ------------------------------
// BARRA DE BÚSQUEDA DE SUCURSALES
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: 0, //theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    minWidth: "200px",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

const API_URL = import.meta.env.VITE_API_URL;

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export function SeccionCategorias() {
  // -------------------- STATES --------------------
  // Barra de búsqueda para categorías
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [Categoria, setCategoria] = useState<ICategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  // -------------------- SERVICES --------------------
  const categoriaService = new CategoriaService(API_URL + "/categoria");

  // -------------------- HANDLERS --------------------
  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres editar el estado?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Adelante!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await categoriaService.delete(id).then(() => {
          getCategoria();
        });
      }
    });
  };

  const handleSave = async (categoria: ICategoriaPost) => {
    try {
      const response = await categoriaService.post(categoria);
      console.log("Respuesta de handleSave");
      console.log(response);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: number, categoria: ICategoria) => {
    try {
      const response = await categoriaService.put(id, categoria);
      console.log("Respuesta de handleUpdate");
      console.log(response);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  // Barra de búsqueda para categorías
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // -------------------- FUNCIONES --------------------
  // BARRA DE BÚSQUEDA
  // Obtener los datos de la tabla en su estado inicial (sin datos)
  const dataTable = useAppSelector((state) => state.tableReducer.dataTable);

  const getCategoria = async () => {
    try {
      const categoriaData = await categoriaService.getAll();
      setCategoria(categoriaData);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSubCategoria = async (
    idCategoria: number,
    subCategoria: ICategoriaPost
  ) => {
    try {
      const response = await categoriaService.addSubCategoria(
        idCategoria,
        subCategoria
      );
      console.log("Respuesta de addSubCategoria");
      console.log(response);
      getCategoria();
    } catch (error) {
      console.error(error);
    }
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    getCategoria();
  }, []);

  // BARRA DE BÚSQUEDA
  // useEffect va a estar escuchando el estado 'dataTable' para actualizar los datos de las filas con los datos de la tabla
  useEffect(() => {
    const filteredRows = dataTable.filter((row) =>
      Object.values(row).some((value: any) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setRows(filteredRows);
  }, [dataTable, searchTerm]);

  // -------------------- RENDER --------------------
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        height: "100%",
        flexDirection: "column",
        gap: "3vh",
        marginTop: "3vh",
      }}
    >
      {!loading && (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Search
              style={{
                flexGrow: 1,
                marginLeft: "1rem",
                marginRight: "1rem",
                backgroundColor: "#f0f0f0",
              }}
            >
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar Categoría..."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <IconButton
              color="primary"
              aria-label="add"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {Categoria.length > 0 ? (
              Categoria.filter((category) =>
                category.denominacion
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ).map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  padding={2}
                  handleUpdate={handleUpdate}
                  handleSave={handleSave}
                  addSubCategoria={addSubCategoria}
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <div>No hay categorías creadas.</div>
            )}
          </List>
        </>
      )}
      {loading && <Loader />}
      <CategoriaModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSave}
      />
    </div>
  );
}
