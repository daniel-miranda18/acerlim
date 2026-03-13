import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from "@coreui/react";

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  visible,
  title = "Confirmar",
  message,
  onConfirm,
  onCancel,
  loading,
}: ConfirmModalProps) {
  return (
    <CModal visible={visible} onClose={onCancel} alignment="center">
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{message}</CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </CButton>
        <CButton color="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Eliminando..." : "Eliminar"}
        </CButton>
      </CModalFooter>
    </CModal>
  );
}
