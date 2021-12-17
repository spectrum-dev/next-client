import {
  Box,
  Text,
} from '@chakra-ui/react';

const GenericBlock = (
  { onDrag, blockName, blockType }:
  { onDrag: React.DragEventHandler<HTMLDivElement>, blockName: string, blockType: string },
) => (
  <Box width="73%" height="94px" borderRadius="20px" border="none" background="linear-gradient(0deg, #808080 0% 40%, #E6E6E6 40% 100%)" textAlign="center" margin="20px 0px 30px 0px" draggable onDragStart={onDrag}>
    <Text marginTop="17px">
      { blockName }
    </Text>

    <Text marginTop="21px" fontWeight="bold">
      { blockType }
    </Text>
  </Box>
);

export default GenericBlock;
