import { Flex } from '@chakra-ui/react';

import Canvas from './Canvas';
import TopBar from './TopBar';

const Board = () => (
  <Flex direction="column" height="100vh">
    <Flex align="center" bg="#212B3B" color="white" px="6" minH="12">
      <TopBar />
    </Flex>
    <Canvas />
  </Flex>
);

export default Board;
