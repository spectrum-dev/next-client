import { useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';
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

import { URLParams } from '../Canvas/index.types';

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
    <Input value={`${email} (${permission === '2' ? 'Write' : 'Read'})`} disabled />
);

const SharingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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

  console.log(sharedUserData);

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
                <InputRightAddon children={<ReadWrite permissions={permissions} setPermissions={setPermissions}/>} backgroundColor="white" border="none" size="xs"/>
            </InputGroup>
            {
                sharedUserData && sharedUserData.sharedUsers.map((item: SharedUser) => (
                    <SharedUsers email={item.email} permission={item.permissions} />
                ))
            }
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" mr={3} onClick={() => shareStrategy({ variables: { strategyId, email, permissions } })}
            disabled={email === '' || permissions === ''}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SharingModal;
