import { useEffect, useState } from 'react';

import { Box, useToast } from '@chakra-ui/react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import {
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
} from '@chakra-ui/react';

import { QUERY_SHARED_USERS, MUTATION_SHARE_STRATEGY } from './gql';

import { URLParams } from '../../index.types';

type SharedUser = { email: string; permissions: string; };

const ReadWrite = (
  { permissions, setPermissions }:
  { permissions: string, setPermissions: React.Dispatch<React.SetStateAction<string>> },
) => (
    <Select placeholder="Select option" value={permissions} onChange={(e) => setPermissions(e.target.value)}>
        {/* <option value="1">Read</option> */}
        <option value="2">Write</option>
    </Select>
);

const SharedUsers = ({ email, permission }: { email: string, permission: string }) => (
    <Input value={`${email} (${permission === '2' ? 'Write' : 'Read'})`} disabled marginBottom="1rem" />
);

const Sharing = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState('');
  
  const toast = useToast();

  const { strategyId } = useParams<URLParams>();

  const { data: sharedUserData } = useQuery(QUERY_SHARED_USERS, { variables: { strategyId } });
  const [shareStrategy, { data: shareStrategyData, error }] = useMutation(MUTATION_SHARE_STRATEGY, {
    errorPolicy: 'all',
    refetchQueries: [
      QUERY_SHARED_USERS,
    ],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (shareStrategyData?.shareStrategy?.shared) {
      toast({
        title: `Strategy was shared with ${email}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareStrategyData]);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sharing Preferences</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <InputGroup size="sm" marginBottom="1rem">
                <Input placeholder="Add people" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <InputRightAddon children={<ReadWrite permissions={permissions} setPermissions={setPermissions}/>} border="none" backgroundColor="white" size="xs"/>
            </InputGroup>
            {
                sharedUserData && sharedUserData.sharedUsers.map((item: SharedUser) => (
                    <Box key={item.email}>
                      <SharedUsers email={item.email} permission={item.permissions} />
                    </Box>
                ))
            }
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={() => shareStrategy({ variables: { strategyId, email, permissions } })}
            disabled={email === '' || permissions === ''}>
            Add
          </Button>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Sharing;
