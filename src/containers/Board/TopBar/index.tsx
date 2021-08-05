import {
  Center, Text, Flex, Square,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';

const TopBar = () => {
  const history = useHistory();

  return (
    <Flex justify="space-between" align="center" textAlign="center" w="full">
      <Square
        sx={{ 'svg:hover': { fill: 'grey' } }}
      >
        <IoIosArrowBack
          fontSize={23}
          onClick={() => history.push('/dashboard')}
        />
      </Square>

      <Center>
        <Text textAlign="center">
          Strategy Name
        </Text>
      </Center>
    </Flex>
  );
};

export default TopBar;
