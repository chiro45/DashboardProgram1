import React, { useEffect, useState } from "react";
import { ManufacturadoService } from "../../../../services/ManufacturadoService";
import { useAppDispatch } from "../../../../hooks/redux";
import { setDataTable } from "../../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import GenericTable from "../../../ui/Generic/GenericTable/GenericTable";
import { Loader } from "../../../ui/Loader/Loader";
import { ModalManufacturados } from "../../../ui/modals/ModalManufacturados/ModalManufacturados";

import "./manufacturados.css";
import { IArticuloManufacturado } from "../../../../types/ArticuloManufacturado/IArticuloManufacturado";

const API_URL = import.meta.env.VITE_API_URL;

export const SeccionManufacturados = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const manufacturadoService = new ManufacturadoService(
    API_URL + "/articulo-manufacturado"
  );
  const dispatch = useAppDispatch();

  // Necesario para establecer las columnas de la tabla genérica
  const ColumnsManufacturado = [
    {
      label: "id",
      key: "id",
      render: (manufacturado: IArticuloManufacturado) =>
        manufacturado?.id ? manufacturado.id : 0,
    },
    { label: "Denominación", key: "denominacion" },
    { label: "Precio de Venta", key: "precioVenta" },
    { label: "Descripción", key: "description" },
    { label: "Tiempo Estimado (minutos)", key: "tiempoEstimadoMinutos" },
    { label: "Preparación", key: "preparacion" },
    {
      label: "Ingredientes",
      key: "articuloManufacturadoDetalles",
      render: (manufacturado: IArticuloManufacturado) => (
        <>{manufacturado.articuloManufacturadoDetalles.length}</> // TODO: Modificar para mostrar lista de ingredientes con cantidades.
      ),
    },
    {
      label: "Imagen",
      key: "image",
      render: (manufacturado: IArticuloManufacturado) => (
        <img
        src={manufacturado.imagenes[0].url}
        alt={manufacturado.denominacion}
        style={{ maxWidth: "100px", maxHeight: "100px" }}
        />
      ), // TODO: Modificar para mostrar slider de imágenes o algo similar.
    },
    { label: "Unidad de Medida", key: "unidadMedida" },
    { label: "Categoría", key: "categoria" },
    // {
    //   label: "Acciones",
    //   key: "actions",
    // },
    { label: "Estado", key: "eliminado" },
  ];

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await manufacturadoService.delete(id).then(() => { // TODO: IMPLEMENTAR ELIMINAR LOGICO
          getManufacturado();
        });
      }
    });
  };

  const getManufacturado = async () => {
    await manufacturadoService.getAll().then((manufacturadoData) => {
      // console.log(manufacturadoData)
      dispatch(setDataTable(manufacturadoData));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getManufacturado();
  }, []);

  return (
    <>
      {/* Mostrar indicador de carga mientras se cargan los datos */}
      {loading ? (
        <Loader />
      ) : (
        // Mostrar la tabla de personas una vez que los datos se han cargado
        <div style={{ height: "85vh" }}>
          <GenericTable<IArticuloManufacturado>
            handleDelete={handleDelete}
            columns={ColumnsManufacturado}
            setOpenModal={setOpenModal}
          />
        </div>
      )}

      <ModalManufacturados
        getManufacturados={getManufacturado}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
