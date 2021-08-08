/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  memo, useState, useEffect, useContext,
} from 'react';

import {
  Box,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import {
  Handle as RawHandle, Position, useUpdateNodeInternals, NodeProps,
} from 'react-flow-renderer';

import styled from '@emotion/styled';

// Contexts
import BoardContext from 'app/contexts/board';

// Hooks
import useHandles from './useHandles';
import useInputField from './useInputFields';

// UI Component
import SettingsDrawer from './SettingsDrawer';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Handle = styled(RawHandle)`
  /* Overrides for .react-flow__handle */
  width: 30px;
  height: 30px;
  border: 3px solid white;
`;

const Block = memo((
  { id, data }: NodeProps,
) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const { onOpen, onClose, isOpen } = useDisclosure();

  // @ts-ignore
  const { inputs: managedInputs } = useContext(BoardContext);

  const [renderedInputFields, setRenderedInputFields] = useState<Array<React.ReactNode>>([]);

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
    <>
      <Box
        width="350px"
        height="160px"
        borderRadius="25px"
        border={isOpen ? '3px solid #ed8936;' : '1px solid #1a202c;'}
        background="linear-gradient(0deg, #151a23 0% 40%, #1a202c 40% 100%)"
        textAlign="center"
        onClick={(e) => {
          onOpen();
        }}
      >
        {
          inputHandle ? (
            <Handle
              type="target"
              position={Position.Left}
              id={`input_${id}`}
              onConnect={() => null}
              isValidConnection={() => true}
              style={{ backgroundColor: '#ed8936', left: '-12px', marginTop: '-2px' }}
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
              style={{ backgroundColor: '#ed8936', right: '-12px', marginTop: '-2px' }}
            />
          ) : <></>
        }
      </Box>
      <SettingsDrawer
        isOpen={isOpen}
        onClose={onClose}
        renderedInputFields={renderedInputFields}
      />
    </>
  );
});

export default Block;
