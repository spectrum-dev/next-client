/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  memo,
} from 'react';

import {
  Box,
  Text,
  Center,
} from '@chakra-ui/react';

function format(value: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return formatter.format(value);
}

const ResultBlock = memo((
  props: any,
) => {
  const {
    id, data,
  } = props;
  const { label, type, value } = data;

  return (
    <>
      <Box
        direction="column"
        align="center"
        p="6"
        bg="gray.700"
        rounded="8px"
        shadow="base"
        color="gray.400"
        textAlign="center"
      >
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
    </>
  );
});

export default ResultBlock;
