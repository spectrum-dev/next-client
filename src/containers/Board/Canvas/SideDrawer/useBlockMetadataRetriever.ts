import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

const GET_ALL_METADATA_RESPONSE_500 = 'Error retrieving block metadata';

interface State {
  isLoading: boolean;
  hasError: boolean;
  blockMetadata: Record<any, any> | undefined;
}

export default function useBlockMetadataRetriever() {
  const [state, setState] = useState<State>({
    isLoading: true,
    hasError: false,
    blockMetadata: undefined,
  });
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      const metadataResponse = await fetcher('/orchestration/metadata', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (metadataResponse.status === 200) {
        setState((element) => ({
          ...element,
          blockMetadata: metadataResponse?.data?.response,
        }));
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

  return state;
}
