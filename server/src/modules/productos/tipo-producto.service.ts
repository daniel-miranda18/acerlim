import { TipoProductoRepository } from "./tipo-producto.repository";

export class TipoProductoService {
  private repository: TipoProductoRepository;

  constructor() {
    this.repository = new TipoProductoRepository();
  }

  async obtenerTiposActivos() {
    return this.repository.findAllActives();
  }
}
