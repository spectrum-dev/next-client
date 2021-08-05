/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  memo,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  Box,
  Text,
  Center,
} from '@chakra-ui/react';

// Contexts
import InputContext from 'app/contexts/input';

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
  const { label } = props.data;
  const [displayData, setDisplayData] = useState<{
    label: string; type: string; value: number;
  }>({ label, type: '', value: 0 });

  // @ts-ignore
  const { outputs } = useContext(InputContext);

  const findResults = () => {
    if (!outputs?.results?.cards) {
      return;
    }

    for (const data of outputs?.results?.cards) {
      if (data.label === label) {
        setDisplayData({
          label: data.label,
          type: data.type,
          value: data.value,
        });
      }
    }
  };

  useEffect(() => {
    findResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputs?.results?.cards]);

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
        width="450px"
        height="170px"
      >
        <Text fontSize="2xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
          {displayData.label}
        </Text>
        <Center>
          <Text
            marginTop="10px"
            as="span"
            color="white"
            fontSize="6xl"
            fontWeight="bold"
            lineHeight="1"
          >
            { displayData.type === 'PERCENTAGE'
              ? `${format(displayData.value * 100)} %` : format(displayData.value) }
          </Text>
        </Center>
      </Box>
    </>
  );
});

export default ResultBlock;
