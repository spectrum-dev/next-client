import {
  Box, HStack, IconButton, useColorModeValue as mode, useDisclosure,
} from '@chakra-ui/react';

import { useHistory } from 'react-router';
import { HiCalendar, HiPencilAlt, HiTrash } from 'react-icons/hi';

import { DeleteStrategyModal } from './DeleteStrategy/DeleteStrategyModal';

interface DescriptionProps {
  title: string
  children: React.ReactNode
  creationDate: string
  strategyId: string
  onDelete: Function
}

export const Description = (props: DescriptionProps) => {
  const {
    title, children, creationDate, strategyId, onDelete,
  } = props;

  const {
    isOpen: isDeleteStrategyOpen,
    onOpen: onDeleteStrategyOpen,
    onClose: onDeleteStrategyClose,
  } = useDisclosure();

  const history = useHistory();

  const handleStrategyEdit = () => {
    history.push(`/board/${strategyId}`);
  };

  return (
    <>
      <Box position="relative">
        <Box fontWeight="bold" maxW="xl">
          {title}
        </Box>
        <HStack fontSize="sm" fontWeight="medium" color={mode('gray.500', 'white')} mt="1">
          <Box as={HiCalendar} fontSize="md" color="gray.400" />
          <span>{creationDate}</span>
        </HStack>
        <Box mt="3" maxW="xl" color={mode('gray.600', 'gray.200')}>
          {children}
        </Box>
        <HStack
          position={{ sm: 'absolute' }}
          top={{ sm: '0' }}
          insetEnd={{ sm: '0' }}
          mt={{ base: '4', sm: '0' }}
        >
          <IconButton aria-label="Edit" icon={<HiPencilAlt />} rounded="full" size="sm" onClick={() => handleStrategyEdit()} />
          <IconButton aria-label="Delete" icon={<HiTrash />} rounded="full" size="sm" onClick={() => onDeleteStrategyOpen()} />
        </HStack>
      </Box>
      <DeleteStrategyModal
        isOpen={isDeleteStrategyOpen}
        onClose={onDeleteStrategyClose}
        onDelete={onDelete}
        strategyId={strategyId}
      />
    </>
  );
};
