import {
  Heading, Flex, Tag, Spacer, Button,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';

import useGetStrategyInformation from './useGetStrategyInformation';

const TopBar = ({ onShareOpen }: { onShareOpen: any }) => {
  const history = useHistory();

  const { strategyInformation } = useGetStrategyInformation();

  return (
    <Flex w="full" justifyContent="space-evenly">
      <Flex sx={{ 'svg:hover': { fill: 'grey' } }}>
        <IoIosArrowBack
          fontSize={23}
          onClick={() => history.push('/dashboard')}
        />
        <Tag marginLeft="20px">
          Alpha
        </Tag>
      </Flex>

      <Spacer />

      <Flex>
        <Heading fontSize="18">
          {strategyInformation && strategyInformation.strategy_name}
        </Heading>
      </Flex>

      <Spacer />

      <Flex>
        <Button size="xs" backgroundColor="#2D3748" color="white" onClick={() => onShareOpen()}>
          Share
        </Button>
      </Flex>
    </Flex>
  );
};

export default TopBar;
