import { useState } from 'react';
import { Box } from '@chakra-ui/react';

import ReactFlow, { ReactFlowProvider, Background } from 'react-flow-renderer';

const Canvas = () => {
  const [elements] = useState([]);

  return (
    <Box minH="100vh" h="100vh" as="section">
      <ReactFlowProvider>
        <ReactFlow
          elements={elements}
          minZoom={0.5}
          maxZoom={0.5}
          defaultZoom={0.5}
          snapToGrid
          snapGrid={[1, 1]}
        >
          <Background
            // @ts-ignore
            variant="lines"
            color="#5c6874"
            gap={80}
            style={{ backgroundColor: '#212B3B' }}
          />
        </ReactFlow>
      </ReactFlowProvider>
    </Box>
  );
};

export default Canvas;
