import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import { OnLoadParams } from 'react-flow-renderer';

import { SetElements, FormNode } from 'pages/Board/Canvas/index.types';

import { QUERY_GET_BLOCK_METADATA } from './gql';

const GET_BLOCK_METADATA_RESPONSE_500 = "There was an error retrieving the block's metadata. Please try again";

export default function useBlockMetadataOnDrop({ startId }: { startId: number }) {
  const [id, setId] = useState<number>(1);

  const client = useApolloClient();
  const toast = useToast();
  
  useEffect(() => {
    if (startId) {
      setId(startId + 1);
    }
  }, [startId]);

  const generateID = (): string => {
    setId(id + 1);
    return id.toString();
  };

  const onDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    reactFlowInstance: OnLoadParams | undefined,
    setElements: SetElements,
  ) => {
    try {
      if (!reactFlowInstance) {
        return;
      }

      // Extracts data from headers
      const blockType = event.dataTransfer.getData('application/reactflow');
      const blockId = parseInt(event.dataTransfer.getData('application/reactflow-id'));
      const flowBlockType = event.dataTransfer.getData('application/reactflow-flow-block-type');

      if (flowBlockType === 'resultBlock' || flowBlockType === 'resultGraphBlock' || flowBlockType === 'resultTableBlock') {
        return;
      }

      const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });

      const { data: { blockMetadata }, error } = await client.query({ query: QUERY_GET_BLOCK_METADATA, variables: { blockType, blockId } });
      
      if (error) {
        throw new Error(GET_BLOCK_METADATA_RESPONSE_500);
      }

      if (blockMetadata) {
        const newNode: FormNode = {
          id: generateID(),
          type: 'block',
          position,
          data: {
            metadata: {
              ...blockMetadata,
              isMenuVisible: true,
            },
          },
        };

        setElements((es) => es.concat(newNode));
      } else {
        throw new Error(GET_BLOCK_METADATA_RESPONSE_500);
      }
    } catch (e) {
      toast({
        title: GET_BLOCK_METADATA_RESPONSE_500,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return { onDrop };
}
