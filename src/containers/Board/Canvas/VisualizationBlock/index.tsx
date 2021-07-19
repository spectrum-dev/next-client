/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo } from 'react';

import {
  Box,
  Heading,
  Flex,
  Spacer,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { BsGear } from 'react-icons/bs';

import { Handle as RawHandle, Position } from 'react-flow-renderer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Handle = styled(RawHandle)`
  /* Overrides for .react-flow__handle */
  width: 25px;
  height: 25px;
  border: 2px solid white;
  background: '#ed8936';
  
  /* Overrides for .react-flow__handle-left */
  .react-flow__handle .react-flow__handle-left {
    left: -12px;
  }
  .react-flow__handle .react-flow__handle-right {
    right: -12px;
  }
`;

export default memo(({ id, data: rawData }: { id: string, data: any }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box width="1100px" height="700px" borderRadius="25px" border="1px solid #1a202c" background="#1a202c" textAlign="center" insetBlockEnd="TEST">
        <Flex margin="10px 0px 0px 0px">
          <Spacer />
          <Heading textColor="white" size="xl" textAlign="center">
            Block Title
          </Heading>
          <Spacer />
          <IconButton aria-label="Edit" icon={<BsGear />} rounded="full" size="lg" fontSize="40px" textColor="white" background="#1a202c" onClick={onOpen} />
        </Flex>
        <Handle
          type="target"
          position={Position.Left}
          id={`input_${id}`}
          onConnect={() => null}
          isValidConnection={() => true}
        />
        <Box>
          Graph Goes Here
          {/* TODO: Visualization Content Goes Here */}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#1a202c" textColor="white">
          <ModalHeader textAlign="center"> Configure - Visualization Block </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <h1> Test </h1>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
});
