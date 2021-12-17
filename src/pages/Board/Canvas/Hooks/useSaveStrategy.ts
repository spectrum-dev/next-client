import { useMutation, ApolloError } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';


import {
  URLParams, Inputs, Outputs, Elements,
} from '../index.types';

import { MUTATION_SAVE_STRATEGY } from '../gql';

const STRATEGY_SAVE_SUCCESS = 'Your strategy has been saved successfully';

export default function useSaveStrategy(
  { inputs, outputs, elements }:
  { inputs: Inputs, outputs: Outputs, elements: Elements },
) {
  const toast = useToast();

  const { strategyId } = useParams<URLParams>();

  const onCompleted = () => {
    toast({
      title: STRATEGY_SAVE_SUCCESS,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const onError = ({ graphQLErrors }: ApolloError) => {
    toast({
      title: graphQLErrors?.[0].message,
      status: 'error',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const [saveStrategy] = useMutation(MUTATION_SAVE_STRATEGY, {
    variables: {
      strategyId,
      commitId: null,
      metadata: elements,
      inputs,
      outputs,
    },
    onCompleted,
    onError,
  });

  return { saveStrategy };
}
