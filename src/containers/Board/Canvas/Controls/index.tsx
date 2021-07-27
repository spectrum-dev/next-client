import { Box, IconButton, Tooltip } from '@chakra-ui/react';

import { RiSaveFill } from 'react-icons/ri';
import { BsPlayFill } from 'react-icons/bs';
import { FaRobot } from 'react-icons/fa';

const Controls = (
  {
    onViewBlocks,
    onSaveStrategy,
    hasStartedStrategy,
    isStrategyValid,
    onRunStrategy,
  }:
  {
    onViewBlocks: () => void;
    onSaveStrategy: Function;
    hasStartedStrategy: boolean;
    isStrategyValid: boolean;
    onRunStrategy: Function;
  },
) => (
  <Box zIndex={10} position="absolute" top="90%" right="45%" background="#1a202c" borderRadius="30px" padding="0px 10px 0px 10px" justify="center">
    <IconButton aria-label="Save strategy" icon={<RiSaveFill color="white" size={20} />} background="#1a202c" onClick={() => onSaveStrategy()} />
    <Tooltip
      hasArrow
      label={
      hasStartedStrategy
        ? 'Please resolve any errors you have before running the strategy'
        : 'Drag blocks from the sidebar to assemble your strategy'
      }
      bg="#1a202c"
      color="white"
      isOpen={!isStrategyValid}
      textAlign="center"
    >
      <IconButton aria-label="Run strategy" icon={<BsPlayFill color="white" size={20} />} background="#1a202c" disabled={!isStrategyValid} onClick={() => onRunStrategy()} />
    </Tooltip>
    <IconButton aria-label="View blocks" icon={<FaRobot color="white" size={20} />} background="#1a202c" onClick={() => onViewBlocks()} />
  </Box>
);

export default Controls;
