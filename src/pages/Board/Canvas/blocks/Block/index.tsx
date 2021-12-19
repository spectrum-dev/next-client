import {
  memo, useState, useEffect, useContext,
} from 'react';

import {
  Box,
  Text,
} from '@chakra-ui/react';

import {
  Handle as RawHandle, Position, useUpdateNodeInternals, NodeProps,
} from 'react-flow-renderer';

import styled from '@emotion/styled';

// Contexts
import CanvasContext from 'app/contexts/canvas';

// Hooks
import useHandles from './useHandles';
import useOnDeleteBlock from './useOnDeleteBlock';

// UI Component
import ContextMenu from './ContextMenu';

const Handle = styled(RawHandle)`
  /* Overrides for .react-flow__handle */
  width: 30px;
  height: 30px;
  border: 3px solid white;
`;

const Block = memo((
  { id, data }: NodeProps,
) => {
  const {
    blockName, blockId, blockType, validation, isMenuVisible,
  } = data.metadata;

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const updateNodeInternals = useUpdateNodeInternals();
  const {
    onSideDrawerOpen,
    setSelectedBlock,
  } = useContext(CanvasContext);
  
  const onOpen = () => {
    setSelectedBlock({ id, blockId, blockType });
    onSideDrawerOpen();
  };

  const { inputHandle, outputHandle } = useHandles({ validationData: validation });
  const { onDeleteBlock } = useOnDeleteBlock({ id });

  useEffect(() => {
    updateNodeInternals(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, inputHandle, outputHandle]);

  useEffect(() => {
    setIsContextMenuOpen(isMenuVisible);
  }, [isMenuVisible]);

  return (
    <>
      <ContextMenu
        isContextMenuOpen={isContextMenuOpen}
        setIsContextMenuOpen={setIsContextMenuOpen}
        onEditOpen={onOpen}
        onDelete={onDeleteBlock}
      >
        <Box
          width="350px"
          height="160px"
          borderRadius="25px"
          border='1px solid #1a202c;'
          background="linear-gradient(0deg, #808080 0% 40%, #E6E6E6 40% 100%)"
          textAlign="center"
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
          <Text marginTop="20px" fontSize="32px">
            { blockName }
          </Text>

          <Text marginTop="35px" fontWeight="bold" fontSize="27px">
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
      </ContextMenu>
    </>
  );
});

export default Block;
