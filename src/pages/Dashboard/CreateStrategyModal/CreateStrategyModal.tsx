import { useRef, useState } from 'react';

import { useMutation, ApolloError } from '@apollo/client';
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

import { useHistory } from 'react-router';

import { MUTATION_USER_STRATEGY, QUERY_USER_STRATEGIES } from '../gql';

const CreateStrategyModal = (
  { isOpen, onClose }: { isOpen: boolean; onClose: () => void },
) => {
  const initialRef = useRef(null);
  const finalRef = useRef(null);

  const toast = useToast();
  const history = useHistory();

  const [strategyName, setStrategyName] = useState('');

  const onCompleted = (data: any) => {
    history.push(`/board/${data.userStrategy.strategyId}`);
  };

  const onError = ({ graphQLErrors }: ApolloError) => {
    toast({
      title: graphQLErrors?.[0].message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const [createStrategy] = useMutation(MUTATION_USER_STRATEGY, {
    onCompleted,
    onError,
    errorPolicy: 'all',
    refetchQueries: [
      QUERY_USER_STRATEGIES,
    ],
  });

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a strategy</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Strategy Name</FormLabel>
              <Input
                ref={initialRef}
                value={strategyName}
                onChange={(event) => setStrategyName(event.target.value)}
                placeholder="Debug Strategy"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => createStrategy({ variables: { strategyName } })} disabled={strategyName === ''}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export { CreateStrategyModal };
