import { useState } from 'react'; 
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

const ReadWrite = (
  { addPermissions, setAddPermissions }:
  { addPermissions: any, setAddPermissions: any },
) => (
    <Select placeholder="Select option" value={addPermissions} onChange={(e) => setAddPermissions(e.target.value)}>
        <option value="read">Read</option>
        <option value="write">Write</option>
    </Select>
);

const SharedUsers = ({ email, permission }: { email: string, permission: string }) => (
    <Input value={`${email} (${permission})`} disabled />
);

const SharingModal = ({ isOpen, onClose }: { isOpen: any, onClose: any }) => {
  const [addPeople, setAddPeople] = useState('');
  const [addPermissions, setAddPermissions] = useState('');
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sharing Preferences</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <InputGroup size="sm" marginBottom="1rem">
                <Input placeholder="Add people" value={addPeople} onChange={(e) => setAddPeople(e.target.value)}/>
                <InputRightAddon children={<ReadWrite addPermissions={addPermissions} setAddPermissions={setAddPermissions}/>} backgroundColor="white" border="none" size="xs"/>
            </InputGroup>
            <SharedUsers email="rahul@imbue.dev" permission="Read" />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" mr={3} onClick={() => console.log('Clicked Send')} disabled={addPeople === ''}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SharingModal;
