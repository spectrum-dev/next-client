import { useRef } from 'react';
import {
  Center,
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
} from '@chakra-ui/react';

// Utils
import { formatBlockTypeHeader } from 'app/utils';

// UI Components
import GenericBlock from './GenericBlock';

// Hooks
import useBlockMetadataRetriever from './useBlockMetadataRetriever';

const SideDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const btnRef = useRef();
  const { blockMetadata: blockMetadataFromRetriever } = useBlockMetadataRetriever();

  const onDrag = (
    event: React.DragEvent<HTMLDivElement>,
    blockType: string,
    blockId: string,
    blockMetadataEndpoint: string,
  ) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.setData('application/reactflow-id', blockId);
    event.dataTransfer.setData('application/reactflow-metadata-type', blockType);
    event.dataTransfer.setData('application/reactflow-metadata-url', blockMetadataEndpoint);
  };

  const renderBlockList = () => {
    if (!blockMetadataFromRetriever) {
      return [];
    }

    const blockList = [];
    for (const [blockType, blockMetadata] of Object.entries(blockMetadataFromRetriever)) {
      blockList.push(
        <Heading key={blockType} as="h4" size="md" marginTop="20px">
          {formatBlockTypeHeader(blockType)}
        </Heading>,
      );

      for (const [blockId, blockData] of Object.entries(blockMetadata)) {
        blockList.push(
          <Center key={`${blockType}-${blockId}`}>
            <GenericBlock
              key={`${blockType}-${blockId}`}
              blockName={blockData.blockName}
              blockType={formatBlockTypeHeader(blockType)}
              onDrag={async (event) => {
                await onClose();
                await onDrag(event, blockType, blockId, blockData.blockMetadata);
              }}
            />
          </Center>,
        );
      }

      blockList.push(
        <Divider key={`divider-${blockType}`} />,
      );
    }

    return blockList;
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      // @ts-ignore
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent backgroundColor="#212838" margin="70px 20px 30px 0px" borderRadius="20px">
        <DrawerCloseButton textColor="white" />
        <DrawerHeader textColor="white" textAlign="center">Drag a block</DrawerHeader>

        <DrawerBody overflow="scroll" textColor="white" justifyContent="center">
          { renderBlockList() }
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
