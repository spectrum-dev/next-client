import { useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalCloseButton, Text, ModalOverlay, ModalHeader, Box, Flex, Button } from '@chakra-ui/react';

// Utils
import { formatBlockTypeHeader } from 'app/utils';

import GenericBlock from './GenericBlock';
import useBlockMetadataRetriever from 'containers/Board/Canvas/SideDrawer/useBlockMetadataRetriever';
import { ReactNode } from 'react';

const BlockInformation = ({ blockName, children }: { blockName: string, children: ReactNode }) => (
    <Box>
        <Flex borderRadius="12px" width="18rem" height="12rem" backgroundColor="#F3F4F8" alignItems="center" justifyContent="center">
            {children}
        </Flex>
        <Text marginTop="0.5rem" fontWeight={550} fontSize="md"> {blockName} </Text>
    </Box>
);

const BlockSelection = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [selectedBlockType, setSelectedBlockType] = useState<string>();
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
    event.dataTransfer.setData('application/reactflow-flow-block-type', 'baseBlock');
  };

  const renderBlockSideBar = () => {
    const blockName = [];

    if (!blockMetadataFromRetriever) {
      return [];
    }

    for (const [blockType] of Object.entries(blockMetadataFromRetriever)) {
      blockName.push(
            <Box width="100%">
                <Button
                    borderRadius="1rem"
                    color={selectedBlockType === blockType ? 'white' : ''}
                    backgroundColor={selectedBlockType === blockType ? 'black' : ''}
                    _hover={{ backgroundColor: selectedBlockType === blockType ? '' : '#F3F4F8' }}
                    onClick={() => setSelectedBlockType(blockType)}
                >
                    {formatBlockTypeHeader(blockType)}
                </Button>
            </Box>,
      );
    }

    return blockName;
  };

  const renderBlockList = () => {
    if (!blockMetadataFromRetriever) {
      return [];
    }

    const blockList = [];
    for (const [blockType, blockMetadata] of Object.entries(blockMetadataFromRetriever)) {
      for (const [blockId, blockData] of Object.entries(blockMetadata)) {
        if (selectedBlockType === blockType) {
          blockList.push(
                <BlockInformation blockName={blockData.blockName}>
                    <GenericBlock
                        key={`${blockType}-${blockId}`}
                        blockName={blockData.blockName}
                        blockType={formatBlockTypeHeader(blockType)}
                        onDrag={(event) => {
                          onClose();
                          onDrag(event, blockType, blockId, blockData.blockMetadata);
                        }}
                    />
                </BlockInformation>,
          );
        }
      }
    }

    return blockList;
  };

  return (
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader />
                <ModalCloseButton />
                <ModalBody marginBottom="1rem">
                    <Flex flexDirection="row">
                        <Box minWidth="20rem">
                            <Text fontSize="lg" fontWeight={700}>
                                Block Navigation
                            </Text>

                            <Flex flexDirection="column" marginTop="1rem" rowGap="1rem"> 
                                {renderBlockSideBar()}
                            </Flex>
                        </Box>
                        <Box>
                            <Text fontSize="2xl"> {selectedBlockType ? formatBlockTypeHeader(selectedBlockType) : 'Select a block'} </Text>
                            <Text fontSize="md"> Select from a list of available blocks below </Text>

                            <Flex flexDirection="row" marginTop="1rem" rowGap="2rem" columnGap="2rem" flexWrap="wrap">
                                {renderBlockList()}
                            </Flex>
                        </Box>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
  );
};

export default BlockSelection;