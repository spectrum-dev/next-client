/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/destructuring-assignment */
import {
  Box, Flex, Stack, Text, Center, useColorModeValue as mode,
} from '@chakra-ui/react';
import { Indicator } from './Indicator';

export interface StatCardProps {
  data: {
    label: string
    value: number
    type: string
  }
}

function format(value: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return formatter.format(value);
}

const StatCard = (props: StatCardProps) => {
  const {
    label, value, type,
  } = props.data;

  return (
    <Flex
      direction="column"
      align="center"
      p="6"
      bg="gray.700"
      rounded="8px"
      shadow="base"
      color="gray.400"
      textAlign="center"
    >
      <Box>
        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
          {label}
        </Text>
        <Center>
          <Text
            marginTop="10px"
            as="span"
            color="white"
            fontSize="4xl"
            fontWeight="bold"
            lineHeight="1"
          >
            { type === 'PERCENTAGE' ? `${format(value * 100)} %` : format(value) }
          </Text>
        </Center>
      </Box>
    </Flex>
  );
};

export default StatCard;
