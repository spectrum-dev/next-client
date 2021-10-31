import { useState, useContext } from 'react';

import BoardContext from 'app/contexts/board';

import { useQuery } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import { QUERY_ALL_METADATA } from './gql';

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
  allMetadata: BlockMetadata;
}

export default function useBlockMetadataRetriever() {
  const [blockMetadata, setBlockMetadata] = useState<BlockMetadata | undefined>(undefined);
  const toast = useToast();
  
  const { strategyType } = useContext(BoardContext);
  
  const onCompleted = (data: MetadataResponse) => {
    setBlockMetadata(data.allMetadata);
  };

  const onError = () => {
    toast({
      title: GET_ALL_METADATA_RESPONSE_500,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };
  
  useQuery(QUERY_ALL_METADATA, {
    variables: {
      strategyType,
    },
    onCompleted,
    onError,
  });

  return { blockMetadata };
}
