/* eslint-disable @typescript-eslint/no-unused-vars */
import { memo } from 'react';

import {
  Box,
} from '@chakra-ui/react';
import styled from '@emotion/styled';

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

export default memo(({ id, data: rawData }: { id: string, data: any }) => (
  <Box width="1100px" height="700px" borderRadius="25px" border="1px solid #1a202c" background="#1a202c" textAlign="center">
    <Handle
      type="target"
      position={Position.Left}
      id={`input_${id}`}
      onConnect={() => null}
      isValidConnection={() => true}
    />
  </Box>
));
