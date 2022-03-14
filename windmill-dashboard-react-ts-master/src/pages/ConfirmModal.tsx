import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui';
import React from 'react';

function ConfirmModal(props : any) {
    return (
      <>
        <Modal isOpen={props.modalOpen} onClose={props.onClose}>
          <ModalHeader>{props.header}</ModalHeader>
          <ModalBody>
            {props.body}
          </ModalBody>
          <ModalFooter>
            <Button className="w-full sm:w-auto" layout="outline" onClick={props.onClose}>
              {props.cancel}
            </Button>
            <Button className="w-full sm:w-auto" onClick={props.callback}>{props.accept}</Button>
          </ModalFooter>
        </Modal>
      </>
    )
  }
  export default ConfirmModal