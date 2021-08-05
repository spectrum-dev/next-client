import {
  Heading, Flex, Tag, Spacer, Box,
} from '@chakra-ui/react';
import { useHistory } from 'react-router';
import { IoIosArrowBack } from 'react-icons/io';

const TopBar = () => {
  const history = useHistory();

  return (
    <Flex w="full" justifyContent="space-evenly">
      <Flex sx={{ 'svg:hover': { fill: 'grey' } }}>
        <IoIosArrowBack
          fontSize={23}
          onClick={() => history.push('/dashboard')}
        />
        <Tag variantColor="red" marginLeft="20px">
          Alpha
        </Tag>
      </Flex>

      <Spacer />

      <Flex>
        <Heading fontSize="18">
          Strategy Name
        </Heading>
      </Flex>

      {/* This is done to center the other text content */}
      <Box width="120px" />

      <Spacer />
    </Flex>
  );
};

export default TopBar;
