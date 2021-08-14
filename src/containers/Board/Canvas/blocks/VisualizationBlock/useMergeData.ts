import {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { useToast } from '@chakra-ui/react';

import fetcher from 'app/fetcher';

import BoardContext from 'app/contexts/board';

const POST_MERGE_DATA_500 = 'There was an error running your overlay. Please refresh the page.';

interface State {
  refList: Array<string> | [];
  mergedData: any;
}

export default function useMergeData(
  {
    id,
    base,
    setDataKey,
    setDataKeys,
  }: {
    id: string,
    base: any,
    setDataKey: Function,
    setDataKeys: Function,
  },
) {
  const [state, setState] = useState<State>({ refList: [], mergedData: {} });
  const [transformedData, setTransformedData] = useState(base);

  // @ts-ignore
  const { inputs, outputs } = useContext(BoardContext);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      // List of additional overlays on top of base
      const refList = inputs?.[id].ref;

      // Searches for object key of graph visualization
      const keys = Object.keys(outputs);
      let requestBody = {
        base,
      };
      for (const ref of refList) {
        for (const key of keys) {
          const keyAttributes = key.split('-');
          if (keyAttributes.length === 3 && keyAttributes[2] === refList[0]) {
            requestBody = {
              ...requestBody,
              [ref]: outputs[key],
            };
          }
        }
      }

      // Makes fetch request here
      const mergeResponse = await fetcher.post('/orchestration/overlay', requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (mergeResponse.status === 200) {
        const response: any = mergeResponse.data;

        setTransformedData(response.response);

        setState({
          refList,
          mergedData: response,
        });
      } else {
        throw new Error(POST_MERGE_DATA_500);
      }
    } catch {
      toast({
        title: POST_MERGE_DATA_500,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  useEffect(() => {
    if (!Array.isArray(base)) {
      const tempDataKeys = Object.keys(base);
      setDataKeys(inputs?.[id]?.dataKeys ? inputs?.[id]?.dataKeys : tempDataKeys);

      const loadedDataKey = inputs?.[id]?.dataKey ? inputs?.[id]?.dataKey : tempDataKeys[0];
      setDataKey(loadedDataKey);
      setTransformedData(base[loadedDataKey]);
    }
    // Checks if graph has potential overlays
    if ('ref' in inputs?.[id] && inputs?.[id].ref.length > 0) {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base]);

  return {
    transformedData,
    setTransformedData,
    ...state,
  };
}
