import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui';
import ImportOrderForm from "../pages/ImportOrderForm"
import { MODAL_TYPES } from '../Shared/Model';
import '../styles/General.css';

function Modals(props: any) {

  return (
    <>
      <Modal style={{ width: "50%" }} isOpen={props.showModal} onClose={props.closeModal}>
        <ModalHeader>{props.header}</ModalHeader>
        <ModalBody>
          {(props.modalType === MODAL_TYPES.IMPORT_ORDER || props.modalType === MODAL_TYPES.EXPORT_ORDER) && <ImportOrderForm {...props} callback={props.callback} />}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={props.closeModal}>
              {props.cancel ? props.cancel : "Cancel"}
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={props.acceptModal}>
              {props.accept ? props.accept : "Accept"}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Modals;
