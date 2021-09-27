/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, ReactNode } from 'react';
import {
  Button, Popover, PopoverTrigger,
  PopoverContent, PopoverBody,
} from '@chakra-ui/react';

const ContextMenu = (
  {
    children, isContextMenuOpen, setIsContextMenuOpen, onEditOpen,
  }:
  { children: ReactNode, isContextMenuOpen: boolean, setIsContextMenuOpen: any, onEditOpen: any },
) => (
  <Popover
    returnFocusOnClose={false}
    isOpen={isContextMenuOpen}
    onClose={() => setIsContextMenuOpen(false)}
    placement="bottom"
    closeOnBlur={false}
  >
    <PopoverTrigger>
      {children}
    </PopoverTrigger>
    <PopoverContent width="320px" marginLeft="180px" marginTop="84px">
      <PopoverBody fontSize="30px">
        <Button
          onClick={() => onEditOpen()}
          width="100%"
          fontSize={25}
        >
          Edit
        </Button>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export default ContextMenu;
