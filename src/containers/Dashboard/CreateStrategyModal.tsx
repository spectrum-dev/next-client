import { useRef } from 'react';

import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter,
} from '@chakra-ui/react';

const CreateStrategyModal = (
  { isOpen, onClose }: { isOpen: boolean; onClose: () => void },
) => {
  const initialRef = useRef();
  const finalRef = useRef();

  return (
    <>
      <Modal
        // @ts-ignore
        initialFocusRef={initialRef}
        // @ts-ignore
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Strategy Name</FormLabel>
              {/* @ts-ignore */}
              <Input ref={initialRef} placeholder="Debug Strategy" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { CreateStrategyModal };
