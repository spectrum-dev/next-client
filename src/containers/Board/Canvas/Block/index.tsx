/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo, useRef } from 'react';

import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import FocusLock from 'react-focus-lock';
import { Handle as RawHandle, Position } from 'react-flow-renderer';

import styled from '@emotion/styled';

import InputForm from './InputForm';

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

const Block = memo(({ id, data }: { id: string, data: any }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);

  return (
    <Popover
      isOpen={isOpen}
      initialFocusRef={firstFieldRef}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Box width="350px" height="160px" borderRadius="25px" border={isOpen ? '3px solid #ed8936;' : '1px solid #1a202c;'} background="linear-gradient(0deg, #151a23 0% 40%, #1a202c 40% 100%)" textAlign="center">
          <Handle
            type="target"
            position={Position.Left}
            id={id}
          />
          <Text color="white" marginTop="20px" fontSize="32px">
            Block Name
          </Text>

          <Text color="white" marginTop="28px" fontWeight="bold" fontSize="35px">
            Block Type
          </Text>
          <Handle
            type="source"
            position={Position.Right}
            id={id}
          />
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5} margin="80px 0px 0px 170px" width="500px">
        <FocusLock returnFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          {/* @ts-ignore */}
          <InputForm firstFieldRef={firstFieldRef} onCancel={onClose} />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
});

export default Block;
