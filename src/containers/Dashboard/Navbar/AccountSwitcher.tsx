import {
  Menu,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import useAuth from 'containers/Authentication/Login/useAuth';

import { AccountSwitcherButton } from './AccountSwitcherButton';

export const AccountSwitcher = () => {
  const { signOut } = useAuth();

  return (
    <Menu>
      <AccountSwitcherButton />
      <MenuList shadow="lg" py="4" color={useColorModeValue('gray.600', 'gray.200')} px="3">
        <Text fontWeight="medium" mb="2">
          placeholder@imbue.dev
        </Text>
        <MenuOptionGroup defaultValue="chakra-ui">
          <MenuItemOption value="chakra-ui" fontWeight="semibold" rounded="md">
            Spectrum Alpha
          </MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuItem rounded="md" onClick={() => signOut()}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};
