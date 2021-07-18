import { useRef, useState } from 'react';

import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter,
} from '@chakra-ui/react';

import useCreateStrategy from './useCreateStrategy';

const CreateStrategyModal = (
  { isOpen, onClose }: { isOpen: boolean; onClose: () => void },
) => {
  const initialRef = useRef();
  const finalRef = useRef();

  const [strategyName, setStrategyName] = useState('');

  const { onCreate } = useCreateStrategy({ strategyName });

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
              <Input
                // @ts-ignore
                ref={initialRef}
                value={strategyName}
                onChange={(event) => setStrategyName(event.target.value)}
                placeholder="Debug Strategy"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => onCreate()} disabled={strategyName === ''}>
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
