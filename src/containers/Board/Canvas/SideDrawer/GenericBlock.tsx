import {
  Box,
  Text,
} from '@chakra-ui/react';

const GenericBlock = (
  { onDrag, blockName, blockType }:
  { onDrag: React.DragEventHandler<HTMLDivElement>, blockName: string, blockType: string },
) => (
  <Box width="73%" height="90px" borderRadius="20px" border="1px solid #1a202c;" background="linear-gradient(0deg, #151a23 0% 40%, #1a202c 40% 100%)" textAlign="center" margin="20px 0px 30px 0px" draggable onDragStart={onDrag}>
    <Text color="white" marginTop="12px">
      { blockName }
    </Text>

    <Text color="white" marginTop="21px" fontWeight="bold">
      { blockType }
    </Text>
  </Box>
);

export default GenericBlock;
