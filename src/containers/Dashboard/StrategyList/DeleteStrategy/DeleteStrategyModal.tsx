import { useRef } from 'react';

import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalFooter,
} from '@chakra-ui/react';

const DeleteStrategyModal = (
  {
    isOpen, onClose, strategyId, onDelete,
  }:
  { isOpen: boolean; onClose: () => void, strategyId: String, onDelete: Function },
) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm strategy deletion</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => onDelete(strategyId)}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { DeleteStrategyModal };
