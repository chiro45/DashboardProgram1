import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { IUnidadMedida } from "../../../../types/UnidadMedida/IUnidadMedida";
import { UnidadMedidaService } from "../../../../services/UnidadMedidaService";
import { UnidadMedidaModal } from "../ModalUnidadMedida/ModalUnidadMedida";
import { ImagenArticuloModal } from "../ModalImagenArticulo/ModalImagenArticulo";
import { Modal, Form } from "react-bootstrap";
import {
  Autocomplete,
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { darken, lighten, styled } from "@mui/material/styles";
import { ManufacturadosDetalleModal } from "../ModalManufacturadosDetalle/ModalManufacturadosDetalle";
import { IArticuloManufacturadoDetalle } from "../../../../types/ArticuloManufacturadoDetalle/IArticuloManufacturadoDetalle";
import { ManufacturadoDetalleService } from "../../../../services/ManufacturadoDetalleService";
import { IImagenArticulo } from "../../../../types/ImagenArticulo/IImagenArticulo";
import { ICategoria } from "../../../../types/Categoria/ICategoria";
import { CategoriaService } from "../../../../services/CategoriaService";

//Estilos del item de cabecera en el combo de categoría
const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

//Estilos del item de subcategoría en el combo de categoría
const GroupItems = styled("ul")({
  padding: 0,
});

// Función para aplanar las subcategorías
const flattenCategories = (
  categories: any[],
  parent: string | null = null
): any[] => {
  return categories.reduce((acc, category) => {
    acc.push({
      id: category.id,
      denominacion: category.denominacion,
      parent: null,
    });

    if (category.subcategorias) {
      category.subcategorias.forEach((subcategoria: ICategoria) => {
        acc.push({
          id: subcategoria.id,
          denominacion: subcategoria.denominacion,
          parent: category.denominacion,
        });
      });
    }

    return acc;
  }, []);
};

const API_URL = import.meta.env.VITE_API_URL;

interface IManufacturadosModalProps {
  getManufacturados: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const initialValues = {
  id: 0,
  denominacion: "",
  precioVenta: 0,
  descripcion: "",
  tiempoEstimadoMinutos: 0,
  preparacion: "",
  idArticuloManufacturadoDetalles: [],
  idImagenes: [],
  idUnidadMedida: 0,
  idCategoria: 0,
};

export const validationSchema = Yup.object({
  denominacion: Yup.string().required("Campo requerido"),
  precioVenta: Yup.number().required("Campo requerido"),
  descripcion: Yup.string().required("Campo requerido"),
  tiempoEstimadoMinutos: Yup.number().required("Campo requerido"),
  preparacion: Yup.string().required("Campo requerido"),
  articuloManufacturadoDetalles: Yup.array().required("Campo requerido"),
  imagenes: Yup.array().required("Campo requerido"),
  idUnidadMedida: Yup.number().required("Campo requerido"),
  idCategoria: Yup.number().required("Campo requerido"),
});

const steps = ["Información General", "Detalles", "Insumos e Imágenes"];

export const ModalArticuloManufacturado = ({
  getManufacturados,
  openModal,
  setOpenModal,
}: IManufacturadosModalProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [idImages, setIdImages] = useState<string[]>([]);
  const [images, setImages] = useState<IImagenArticulo[]>([]);

  const [showDetallesModal, setShowDetallesModal] = useState<boolean>(false);
  const [detalles, setDetalles] = useState<IArticuloManufacturadoDetalle[]>([]);

  //Abre el modal de unidad de medida
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] =
    useState<boolean>(false);
  //Guarda los valores de todas las unidades de medida que existen y que vayan a añadirse con el useEffect
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  //Utilizado para dar formato a los elementos del dropdown de unidades de medida
  const [opcionesUnidadMedida, setOpcionesUnidadMedida] = useState<
    { label: string; id: number }[]
  >([]);

  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  const getImages = () => {
    fetch(`${API_URL}/imagen-articulo/getImages`)
      .then((res) => res.json())
      .then((data) => {
        const imagesData = data;
        setImages(imagesData);
      });
  };

  const flatOptions = flattenCategories(categorias);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      getManufacturados();
      handleCloseModal();
    },
  });

  const handleSubmit = () => {
    formik.handleSubmit();
  };

  const handleCloseModal = () => {
    formik.resetForm();
    setOpenModal(false);
    setActiveStep(0); // Resetear el stepper al cerrar el modal
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const sortedOptions = flatOptions.sort((a, b) => {
    if (a.parent && b.parent) {
      return a.parent.localeCompare(b.parent);
    }
    if (a.parent) {
      return -1;
    }
    if (b.parent) {
      return 1;
    }
    return a.denominacion.localeCompare(b.denominacion);
  });

  const unidadMedidaService = new UnidadMedidaService(
    API_URL + "/unidad-medida"
  );
  const detallesService = new ManufacturadoDetalleService(
    API_URL + "/articulo-manufacturado-detalle"
  );
  const categoriaService = new CategoriaService(API_URL + "/categoria");

  const addUnidadMedida = (unidadMedida: IUnidadMedida) => {
    setUnidadesMedida([...unidadesMedida, unidadMedida]);
    setShowUnidadMedidaModal(false);
  };

  const addDetalles = (detalle: IArticuloManufacturadoDetalle) => {
    setDetalles([...detalles, detalle]);
    setShowDetallesModal(false);
  };

  const getUnidadesMedida = async () => {
    const response = await unidadMedidaService.getAll();
    setUnidadesMedida(response);
  };

  const getDetalles = async () => {
    const response = await detallesService.getAll();
    setDetalles(response);
  };

  const getCategorias = async () => {
    const response = await categoriaService.getAll();
    setCategorias(response);
  };

  //Trae las unidades de medida, detalles y categorías ya creadas
  useEffect(() => {
    getUnidadesMedida();
    getDetalles();
    getCategorias();
  }, []);

  //Da formato a las unidades de medida para el dropdown de MUI
  useEffect(() => {
    const opciones = unidadesMedida.map((unidadMedida) => ({
      label: unidadMedida.denominacion,
      id: unidadMedida.id,
    }));
    setOpcionesUnidadMedida(opciones);
  }, [unidadesMedida]);

  useEffect(() => {
    const opciones = detalles.map((detalles) => ({
      label: detalles.articuloInsumo.denominacion,
      id: detalles.id,
    }));
    setOpcionesUnidadMedida(opciones);
  }, [detalles]);

  // FIXME: No funca esto
  useEffect(() => {
    // const imagesId : string[] = images.map((image) => image.id);
    setIdImages((prevIdImages) => images.map((image) => image.id));
    console.log("CONSOLE LOG DESDE INSUMO");
    console.log(idImages);
  }, [images]);

  return (
    <>
      <Modal show={openModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Articulo Manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
          <Box sx={{ width: "100%" }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ padding: "20px 0" }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Box sx={{ flex: "1 1 auto" }} />
                  <Button onClick={handleCloseModal}>Finalizar</Button>
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Form onSubmit={formik.handleSubmit}>
                  {activeStep === 0 && (
                    <>
                      <Form.Group controlId="denominacion" className="mb-3">
                        <Form.Label>Denominación</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese la denominación"
                          name="denominacion"
                          value={formik.values.denominacion}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.denominacion &&
                            !!formik.errors.denominacion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.denominacion}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Grid container spacing={2}>
                        <Grid item xs={8}>
                          <Form.Group controlId="idCategoria" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Autocomplete
                              id="idCategoria"
                              options={sortedOptions}
                              groupBy={(option) =>
                                option.parent || option.denominacion
                              }
                              getOptionLabel={(option) => option.denominacion}
                              getOptionKey={(option) => option.id}
                              onChange={(event, value) => {
                                formik.setFieldValue(
                                  "idCategoria",
                                  value ? value.id : null
                                );
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField {...params} label="Categorías" />
                              )}
                              renderGroup={(params) => (
                                <li key={params.key}>
                                  <GroupHeader>{params.group}</GroupHeader>
                                  <GroupItems>{params.children}</GroupItems>
                                </li>
                              )}
                            />
                          </Form.Group>
                        </Grid>
                        <Grid item xs={4}>
                          <Form.Group controlId="precioVenta" className="mb-3">
                            <Form.Label>Precio de Venta</Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Ingrese el precio de venta"
                              name="precioVenta"
                              value={formik.values.precioVenta}
                              onChange={formik.handleChange}
                              isInvalid={
                                formik.touched.precioVenta &&
                                !!formik.errors.precioVenta
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.precioVenta}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Grid>
                      </Grid>
                      <Form.Group controlId="descripcion" className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Describa el producto"
                          name="descripcion"
                          value={formik.values.descripcion}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.descripcion &&
                            !!formik.errors.descripcion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.descripcion}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 1 && (
                    <>
                      <Form.Group controlId="idUnidadMedida" className="mb-3">
                        <Form.Label>Unidad de Medida</Form.Label>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={7}>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              options={opcionesUnidadMedida}
                              sx={{ width: "100%" }}
                              value={
                                opcionesUnidadMedida.find(
                                  (option) =>
                                    option.id === formik.values.idUnidadMedida
                                ) || null
                              }
                              onChange={(event, value) =>
                                formik.setFieldValue(
                                  "idUnidadMedida",
                                  value?.id || ""
                                )
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Seleccione la unidad"
                                />
                              )}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={5}
                            display="flex"
                            justifyContent="flex-end"
                          >
                            <Button
                              onClick={() => {
                                setShowUnidadMedidaModal(true);
                              }}
                              variant="contained"
                              startIcon={<AddIcon />}
                            >
                              Crear Unidad
                            </Button>
                          </Grid>
                        </Grid>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.idUnidadMedida}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="preparacion" className="mb-3">
                        <Form.Label>Preparación</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Ingrese la receta"
                          name="preparacion"
                          value={formik.values.preparacion}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.preparacion &&
                            !!formik.errors.preparacion
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.preparacion}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        controlId="tiempoEstimadoMinutos"
                        className="mb-3"
                      >
                        <Form.Label>
                          Tiempo estimado de preparación (minutos)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Ingrese el tiempo de preparación"
                          name="tiempoEstimadoMinutos"
                          value={formik.values.tiempoEstimadoMinutos}
                          onChange={formik.handleChange}
                          isInvalid={
                            formik.touched.tiempoEstimadoMinutos &&
                            !!formik.errors.tiempoEstimadoMinutos
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.tiempoEstimadoMinutos}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}
                  {activeStep === 2 && (
                    <>
                      <Form.Group controlId="detalles" className="mb-3">
                        <Form.Label>Insumos</Form.Label>
                        <Grid container spacing={2} alignItems="center">
                          <Grid
                            item
                            xs={5}
                            display="flex"
                            justifyContent="flex-end"
                          >
                            <Button
                              onClick={() => {
                                setShowDetallesModal(true);
                              }}
                              variant="contained"
                              startIcon={<AddIcon />}
                            >
                              Añadir insumo
                            </Button>
                          </Grid>
                          <Grid item xs={7}>
                            {detalles.length > 0 && (
                              <ul>
                                {detalles.map((detalle, index) => (
                                  <li key={index}>
                                    {detalle.articuloInsumo.denominacion}:{" "}
                                    {detalle.cantidad}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </Grid>
                        </Grid>
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.idArticuloManufacturadoDetalles}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="idImagenes" className="mb-3">
                        <Form.Label>Imágenes</Form.Label>
                        <ImagenArticuloModal
                          images={images}
                          getImages={getImages}
                          setIdImages={setIdImages}
                        />
                      </Form.Group>
                    </>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      pt: 2,
                      alignItems: "center",
                    }}
                  >
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                    >
                      Atrás
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button
                      onClick={
                        activeStep === steps.length - 1
                          ? handleSubmit
                          : handleNext
                      }
                      variant="contained"
                      color={
                        activeStep === steps.length - 1 ? "success" : "primary"
                      }
                    >
                      {activeStep === steps.length - 1
                        ? "Guardar"
                        : "Siguiente"}
                    </Button>
                  </Box>
                </Form>
              </React.Fragment>
            )}
          </Box>
        </Modal.Body>
      </Modal>
      <UnidadMedidaModal
        show={showUnidadMedidaModal}
        handleClose={() => setShowUnidadMedidaModal(false)}
        addUnidadMedida={addUnidadMedida}
      />
      {/* <ImagenArticuloModal show={showImagenArticuloModal} handleClose={() => { setShowImagenArticuloModal(false) }} handleSave={addImagenArticulo} /> */}
      <ManufacturadosDetalleModal
        getDetalles={getDetalles}
        openModal={showDetallesModal}
        setOpenModal={setShowDetallesModal}
      />
    </>
  );
};
