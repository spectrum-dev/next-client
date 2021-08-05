import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { Elements, Node, OnLoadParams } from 'react-flow-renderer';

import fetcher from 'app/fetcher';

import { SetElements } from 'containers/Board/Canvas/index.types';

const GET_BLOCK_METADATA_RESPONSE_500 = "There was an error retrieving the block's metadata. Please try again";

export default function useBlockMetadataOnDrop({ startId }: { startId: number }) {
  const [id, setId] = useState<number>(1);

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
      const blockId = event.dataTransfer.getData('application/reactflow-id');
      const flowBlockType = event.dataTransfer.getData('application/reactflow-flow-block-type');

      if (flowBlockType === 'resultsBlock') {
        return;
      }

      console.log('Continuing Here');

      const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });

      const metadataResponse = await fetcher(`/orchestration/${blockType}/${blockId}/metadata`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (metadataResponse.status === 200) {
        const newNode: Node = {
          id: generateID(),
          type: 'block',
          position,
          data: {
            metadata: metadataResponse?.data,
          },
        };

        setElements((es: Elements) => es.concat(newNode));
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
