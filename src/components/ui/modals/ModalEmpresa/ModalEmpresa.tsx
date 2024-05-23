// EmpresaModal.tsx
import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Box, Button } from "@mui/material";
import { IEmpresaPost } from "../../../../types/Empresa/IEmpresaPost";
import { EmpresaService } from "../../../../services/EmpresaService";

const API_URL = import.meta.env.VITE_API_URL;
interface EmpresaModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (empresa: IEmpresaPost) => void;
}

export const ModalEmpresa: React.FC<EmpresaModalProps> = ({
  show,
  handleClose,
  handleSave,
}) => {
  const [nombre, setNombre] = useState<string>("");
  const [razonSocial, setRazonSocial] = useState<string>("");
  const [cuil, setCuil] = useState<number>(0);

  const onSave = () => {
    const empresa: IEmpresaPost = {
      nombre: nombre,
      razonSocial: razonSocial,
      cuil: cuil,
    };
    handleSave(empresa);
    handleClose();
    setNombre("");
    setRazonSocial("");
    setCuil(0); // Reset form
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Empresa</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        <Form>
          <Form.Group controlId="formNombre" className="mb-3">
            <Form.Label>Nombre de la Empresa</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRazonSocial" className="mb-3">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCuil" className="mb-3">
            <Form.Label>CUIL</Form.Label>
            <Form.Control
              type="number"
              value={cuil}
              onChange={(e) => setCuil(Number(e.target.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button variant="outlined" color="primary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={onSave}>
            Guardar
          </Button>
        </Box>
      </Modal.Footer>
    </Modal>
  );
};
// import * as Yup from "yup";
// import { GenericModal } from "../GenericModal";
// import { IEmpresa } from "../../../../types/Empresa/IEmpresa";
// import { useAppSelector } from "../../../../hooks/redux";

// interface IModalEmpresa {
//     getEmpresa: () => void; // Función para obtener las empresas
//     openModal: boolean;
//     setOpenModal: (state: boolean) => void;
// }

// export const ModalEmpresa = ({ getEmpresa, openModal, setOpenModal }: IModalEmpresa) => {

//     const elementActive = useAppSelector(
//         (state) => state.tableReducer.elementActive
//     );

//     // Necesario para el modal genérico con insumos
//     const initialValues: IEmpresa = elementActive?.element || {
//         id: 0,
//         nombre: '',
//         razonSocial: '',
//         cuil: 0,
//         actions: '',
//         eliminado: true,
//     };

//     //validación del formulario
//     const validationSchema = Yup.object({
//         nombre: Yup.string().required('Campo requerido'),
//         razonSocial: Yup.string().required('Campo requerido'),
//         cuil: Yup.number().required('Campo requerido'),
//     }) as Yup.ObjectSchema<object>;

//     // Traducción de los placeholders del formulario de insumos
//     const translatedPlaceholder = {
//         nombre: 'Nombre',
//         razonSocial: 'Razon Social',
//         cuil: 'Cuil',
//     }

//     // Englobamos todas las props referidas al formulario que vamos a pasarle al Modal genérico
//     const formDetails = {
//         validationSchema: validationSchema,
//         initialValues: initialValues,
//         translatedPlaceholder: translatedPlaceholder,
//         formInputType: {
//             nombre: 'text',
//             razonSocial: 'text',
//             cuil: 'number',
//         },
//     }
//     return (
//         <GenericModal<IEmpresa>
//             openModal={openModal}
//             setOpenModal={setOpenModal}
//             modalTitle="Empresas"
//             formDetails={formDetails}
//             route="empresa"
//             getItems={getEmpresa}/>
//     )
// }
