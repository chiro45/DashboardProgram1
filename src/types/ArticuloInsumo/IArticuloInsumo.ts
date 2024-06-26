import { ICategoria } from "../Categoria/ICategoria";
import { IBaseEntity } from "../IBaseEntity";
import { IImagen } from "../Imagen/IImagen";
import { ISucursal } from "../Sucursal/ISucursal";
import { IUnidadMedida } from "../UnidadMedida/IUnidadMedida";

export interface IArticuloInsumo extends IBaseEntity {
  denominacion: string;
  precioVenta: number;
  imagenes: IImagen[];
  precioCompra: number;
  stockMinimo: number;
  stockActual: number;
  stockMaximo: number;
  esParaElaborar: boolean;
  unidadMedida: IUnidadMedida;
  categoria: ICategoria;
  sucursal: ISucursal;
}
