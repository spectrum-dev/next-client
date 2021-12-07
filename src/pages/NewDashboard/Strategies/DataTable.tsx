import {
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
} from '@chakra-ui/react';

import { RiPencilLine, RiCloseFill } from 'react-icons/ri';

const DropdownEditMenu = () => (
    <Menu>
        <MenuButton
            as={IconButton}
            aria-label='Edit Strategy'
            icon={<RiPencilLine />}
            variant='outline'
        />
        <MenuList>
            <MenuItem icon={<RiPencilLine size={14} />} command='⌘E'>
                Edit Strategy
            </MenuItem>
            <MenuItem icon={<RiCloseFill size={14}/>} command='⌘D'>
                Delete Strategy
            </MenuItem>
        </MenuList>
    </Menu>
);

const TableRow = ({ name, version, lastModified, active }:{ name: string, version: string, lastModified: string, active: boolean }) => (
    <Tr style={{ backgroundColor: 'white' }}>
        <Td> {name} </Td>
        <Td> {version} </Td>
        <Td> {lastModified} </Td>
        <Td> {active ? 'TRUE' : 'FALSE'} </Td>
        <Td> <DropdownEditMenu /> </Td>
    </Tr>
);

export const DataTable = () => (
    <Table>
        <Thead>
            <Tr >
                <Th>Name</Th>
                <Th>Version</Th>
                <Th>Last Modified</Th>
                <Th>Active</Th>
                <Th style={{ width: '1rem' }}/>
            </Tr>
        </Thead>
        <Tbody>
            <TableRow name="Test" version="1" lastModified="2020-01-01" active={false} />
        </Tbody>
    </Table>
);
