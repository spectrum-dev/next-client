import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const GET_ALL_METADATA_RESPONSE_500 = 'Error retrieving block metadata';

interface BlockMetadata {
  [blockKey: string]: {
    [id: string]: {
      blockName: string;
      blockMetadata: string;
    }
  }
}
interface MetadataResponse {
  response: BlockMetadata;
}

export default function useBlockMetadataRetriever() {
  const [blockMetadata, setBlockMetadata] = useState<BlockMetadata | undefined>(undefined);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const metadataResponse = await fetcher('/orchestration/metadata', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (metadataResponse.status === 200) {
        const response: MetadataResponse = metadataResponse.data;
        setBlockMetadata(response.response);
      } else {
        throw new Error(GET_ALL_METADATA_RESPONSE_500);
      }
    } catch (e) {
      toast({
        title: GET_ALL_METADATA_RESPONSE_500,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { blockMetadata };
}
