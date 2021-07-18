import {
  Box,
  Text,
} from '@chakra-ui/react';

const GenericBlock = ({ onDrag }: { onDrag: Function }) => (
  <Box width="80%" height="80px" borderRadius="25px" border="1px solid #1a202c;" background="linear-gradient(0deg, #151a23 0% 40%, #1a202c 40% 100%)" textAlign="center" margin="10px 0px 10px 0px" draggable onDragStart={() => { onDrag(); console.log('Drag Start'); }}>
    <Text color="white" marginTop="12px">
      Block Name
    </Text>

    <Text color="white" marginTop="12px" fontWeight="bold">
      Block Type
    </Text>
  </Box>
);

export default GenericBlock;
