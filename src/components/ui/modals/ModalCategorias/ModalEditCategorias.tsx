import { useEffect, useState } from "react";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { ICategoriaPost } from "../../../../types/Categoria/ICategoriaPost";
import { CategoriaModal } from "./ModalCategorias";
import { Modal, Form } from "react-bootstrap";
import { Button, Grid } from "@mui/material";

// ---------- INTERFAZ ----------
interface ICategoriaModalProps {
  show: boolean;
  handleClose: () => void;
  handleUpdate: (id: number, categoria: ICategoriaPost) => void;
  categoria: ICategoria;
  addSubCategoria: (id: number, subCategoria: ICategoriaPost) => void;
}

// ------------------------------ COMPONENTE PRINCIPAL ------------------------------
export const ModalEditCategorias = ({
  show,
  handleClose,
  handleUpdate,
  categoria,
  addSubCategoria,
}: ICategoriaModalProps) => {
  // -------------------- STATES --------------------
  const [denominacion, setDenominacion] = useState(categoria.denominacion);
  const [idSucursales, setIdSucursales] = useState(categoria.sucursales);
  const [idSubcategorias, setIdSubcategorias] = useState(
    categoria.subCategorias
  );
  const [esParaElaborar, setEsParaElaborar] = useState(
    categoria.esParaElaborar
  );
  const [openModal, setOpenModal] = useState(false);

  // -------------------- HANDLERS --------------------
  const handleSaveSubcategoria = async (subcategoria: ICategoriaPost) => {
    await addSubCategoria(categoria.id, subcategoria);
    setOpenModal(false);
  };

  // -------------------- FUNCIONES --------------------
  const onSave = () => {
    const categoriaUpdate: ICategoriaPost = {
      // id: categoria.id,
      // eliminado: categoria.eliminado,
      denominacion: denominacion,
      idSucursales: idSucursales.map((sucursal) => sucursal.id), // Map the array of ISucursal to an array of numbers
      idSubCategorias: idSubcategorias.map((subcategoria) => subcategoria.id),
      esParaElaborar: esParaElaborar,
    };
    handleUpdate(categoria.id, categoriaUpdate);
    handleClose();
    setDenominacion(""); // Reset form
    setIdSucursales([]);
    setIdSubcategorias([]);
    setEsParaElaborar(false);
  };

  // -------------------- EFFECTS --------------------
  useEffect(() => {
    setDenominacion(categoria.denominacion);
    setIdSucursales(categoria.sucursales);
    setIdSubcategorias(categoria.subCategorias);
    setEsParaElaborar(categoria.esParaElaborar);
  }, [categoria]);

  // -------------------- RENDER --------------------
  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Form.Group controlId="formDenominacion" className="mb-3">
                  <Form.Label>Denominación</Form.Label>
                  <Form.Control
                    type="text"
                    value={denominacion}
                    onChange={(e) => setDenominacion(e.target.value)}
                  />
                </Form.Group>
              </Grid>
              <Grid item xs={4}>
                <Form.Group controlId="formEsParaElaborar" className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="checkbox-esParaElaborar"
                    label="Es para elaborar"
                    checked={esParaElaborar}
                    disabled
                  />
                </Form.Group>
              </Grid>
            </Grid>
            <Form.Group controlId="formIdSubcategorias" className="mb-3">
              <div className="d-flex mb-2 justify-content-between">
                <Form.Label className="mr-2">Subcategorías</Form.Label>
                <Button
                  variant="contained"
                  onClick={() => setOpenModal(true)}
                  className="ml-2"
                >
                  Agregar Sub Categoria
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={onSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
      <CategoriaModal
        show={openModal}
        handleClose={() => setOpenModal(false)}
        handleSave={handleSaveSubcategoria}
      />
    </>
  );
};
