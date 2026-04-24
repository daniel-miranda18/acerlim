import { despachoRepository } from "./despacho.repository";
import { CrearDespachoDTO } from "./despacho.schema";
import QRCode from "qrcode";

export const despachoService = {
  listar: () => despachoRepository.findAll(),

  buscarPorCodigoQr: async (codigoQr: string) => {
    const despacho = await despachoRepository.findByCodigoQr(codigoQr);
    if (!despacho) return null;
    return despacho;
  },

  generarQrImage: async (codigoQr: string): Promise<string> => {
    return QRCode.toDataURL(codigoQr, {
      width: 300,
      margin: 2,
      color: { dark: "#000000", light: "#ffffff" },
    });
  },

  crear: async (data: CrearDespachoDTO, usuarioCreacion: number) => {
    return despachoRepository.create(data, usuarioCreacion);
  },
};
