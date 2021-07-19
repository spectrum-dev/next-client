import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const GET_BLOCK_METADATA_RESPONSE_500 = "There was an error retrieving the block's metadata. Please try again";

interface State {
  isLoading: boolean;
  hasError: boolean;
  onDrop: Function | undefined;
}

export default function useBlockMetadataOnDrop({ startId }: { startId: number }) {
  const [id, setId] = useState<number>(1);
  const [state] = useState<State>({
    isLoading: true,
    hasError: false,
    onDrop: undefined,
  });

  const toast = useToast();

  useEffect(() => {
    if (startId) {
      setId(startId + 1);
    }
  }, [startId]);

  const generateID = () => {
    setId(id + 1);
    return id.toString();
  };

  const onDrop = async (event: any, reactFlowInstance: any, setElements: any) => {
    try {
      // Extracts data from headers
      const blockType = event.dataTransfer.getData('application/reactflow');
      const blockId = event.dataTransfer.getData('application/reactflow-id');

      const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });

      const metadataResponse = await fetcher(`/orchestration/${blockType}/${blockId}/metadata`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (metadataResponse.status === 200) {
        const newNode: any = {
          id: generateID(),
          type: 'block',
          position,
          data: {
            metadata: metadataResponse?.data,
          },
        };

        setElements((es: any) => es.concat(newNode));
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

  return {
    ...state,
    onDrop,
  };
}
