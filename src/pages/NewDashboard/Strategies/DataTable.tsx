import { useQuery, useMutation, ApolloError } from '@apollo/client';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { RiPencilLine, RiCloseFill } from 'react-icons/ri';

import { MUTATION_DELETE_USER_STRATEGY, QUERY_USER_STRATEGIES } from 'pages/Dashboard/gql';

interface GetStrategyRecordResponse {
  strategyId: string;
  strategyName: string;
  createdAt: string;
}

const DropdownEditMenu = ({ strategyId, onDelete }: { strategyId: string, onDelete: () => void }) => {
  const history = useHistory();

  return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label='Edit Strategy'
                icon={<RiPencilLine />}
                variant='outline'
            />
            <MenuList>
                <MenuItem icon={<RiPencilLine size={14} />} onClick={() => { history.push(`/board/${strategyId}/`);}}>
                    Edit Strategy
                </MenuItem>
                <MenuItem icon={<RiCloseFill size={14}/>} onClick={() => onDelete()}>
                    Delete Strategy
                </MenuItem>
            </MenuList>
        </Menu>
  );
};

const TableRow = ({ name, version, lastModified, active, strategyId, onDelete }:{ name: string, version: string, lastModified: string, active: boolean, strategyId: string, onDelete: () => void }) => {
  const Status = () => (
        <Box width="0.75rem" height="0.75rem" backgroundColor={active ? '#32cd32' : '#ff5a5a' } borderRadius="0.5rem"/>
  );
  return (
        <Tr style={{ backgroundColor: 'white' }}>
            <Td> {name} </Td>
            <Td> {version} </Td>
            <Td> {lastModified} </Td>
            <Td> <Flex flexDirection="column" align="center"> <Status /> </Flex> </Td>
            <Td> <DropdownEditMenu strategyId={strategyId} onDelete={onDelete} /> </Td>
        </Tr>
  );
};

export const DataTable = () => {
  const toast = useToast();

  const onError = ({ graphQLErrors }: ApolloError) => {
    toast({
      title: graphQLErrors?.[0].message,
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const { data } = useQuery<{ userStrategies: GetStrategyRecordResponse[]; }>(QUERY_USER_STRATEGIES, {
    onError,
  });
    
  const [deleteStrategy] = useMutation(MUTATION_DELETE_USER_STRATEGY, {
    errorPolicy: 'all',
    refetchQueries: [
      QUERY_USER_STRATEGIES,
    ],
    onError,
  });

  const renderStrategies = () => data?.userStrategies.map((item) => {
    const createdAtDate = new Date(item.createdAt);
    return (
      <TableRow
        key={item.strategyId}
        name={item.strategyName}
        version="1"
        lastModified={`${createdAtDate.toDateString()} at ${createdAtDate.toTimeString()}`}
        active={false}
        strategyId={item.strategyId}
        onDelete={() => deleteStrategy({ variables: { strategyId: item.strategyId } })}
      />
    );
  });

  return (
    <Table>
        <Thead>
            <Tr>
                <Th>Name</Th>
                <Th>Version</Th>
                <Th>Last Modified</Th>
                <Th>Active</Th>
                <Th style={{ width: '1rem' }} />
            </Tr>
        </Thead>
        <Tbody>
            {renderStrategies()}
        </Tbody>
    </Table>
  );
};
