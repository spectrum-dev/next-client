import { ReactNode } from 'react';
import {
  Button, Popover, PopoverTrigger,
  PopoverContent, PopoverBody,
} from '@chakra-ui/react';

const ContextMenu = (
  {
    children, isContextMenuOpen, setIsContextMenuOpen, onEditOpen, onDelete,
  }:
  {
    children: ReactNode,
    isContextMenuOpen: boolean,
    setIsContextMenuOpen: any,
    onEditOpen: any,
    onDelete: any,
  },
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
    <PopoverContent width="320px" marginLeft="180px" marginTop="84px" backgroundColor="#E6E6E6" borderColor="#E6E6E6">
      <PopoverBody fontSize="30px">
        <Button
          onClick={() => onEditOpen()}
          width="100%"
          fontSize={25}
          backgroundColor="#808080"
          color="white"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete()}
          width="100%"
          fontSize={25}
          backgroundColor="#808080"
          color="white"
        >
          Delete
        </Button>
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export default ContextMenu;
