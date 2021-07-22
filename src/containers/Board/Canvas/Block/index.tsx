import {
  memo, useState, useRef, useEffect, useContext,
} from 'react';

import {
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  Stack,
} from '@chakra-ui/react';

import FocusLock from 'react-focus-lock';
import { Handle as RawHandle, Position, useUpdateNodeInternals } from 'react-flow-renderer';

import styled from '@emotion/styled';

// Contexts
import InputContext from 'app/contexts/input';

// Hooks
import useHandles from './useHandles';
import useInputField from './useInputFields';

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

const Block = memo(({ id, data }: { id: string, data: any }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const firstFieldRef = useRef(null);
  // @ts-ignore
  const { inputs: managedInputs } = useContext(InputContext);

  const [renderedInputFields, setRenderedInputFields] = useState([]);

  const {
    blockName, blockType, inputs, validation,
  } = data.metadata;

  const { inputHandle, outputHandle } = useHandles({ validationData: validation });
  const { renderInputFields, additionalInputs } = useInputField({ id });

  useEffect(() => {
    updateNodeInternals(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, inputHandle, outputHandle]);

  useEffect(() => {
    const normalFields = renderInputFields(inputs);
    const additionalFields = renderInputFields(additionalInputs);
    // @ts-ignore
    setRenderedInputFields(normalFields.concat(additionalFields));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, managedInputs?.[id], additionalInputs]);

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
          {
            inputHandle ? (
              <Handle
                type="target"
                position={Position.Left}
                id={`input_${id}`}
                onConnect={() => null}
                isValidConnection={() => true}
              />
            ) : <></>
          }
          <Text color="white" marginTop="20px" fontSize="32px">
            { blockName }
          </Text>

          <Text color="white" marginTop="35px" fontWeight="bold" fontSize="27px">
            { blockType.replace('_', ' ') }
          </Text>
          {
            outputHandle ? (
              <Handle
                type="source"
                position={Position.Right}
                id={`output_${id}`}
                onConnect={() => null}
                isValidConnection={() => true}
              />
            ) : <></>
          }
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5} margin="80px 0px 0px 170px" width="500px" background="#151a23" borderColor="#151a23">
        <FocusLock returnFocus persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          <Stack spacing={4}>
            { renderedInputFields }
          </Stack>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
});

export default Block;
