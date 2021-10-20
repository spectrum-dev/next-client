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
import CanvasContext from 'app/contexts/canvas';

/**
 *
 * @param value Numerical Value to be displayed
 * @returns Formatted number up to 3 Decimal Places
 */
function format(value: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return formatter.format(value);
}

interface ResultsBlockProps {
  data: {
    label: string;
  }
}

const ResultBlock = memo((
  { data: { label } }: ResultsBlockProps,
) => {
  const [displayData, setDisplayData] = useState<{
    label: string;
    type: string;
    value: number;
  }>({
    label,
    type: '',
    value: 0,
  });

  const { outputs } = useContext(CanvasContext);

  const findResults = () => {
    if (!('results' in outputs)) {
      return;
    }

    for (const cardData of outputs.results.cards) {
      if (cardData.label === label) {
        setDisplayData({
          label: cardData.label,
          type: cardData.type,
          value: cardData.value,
        });
      }
    }
  };

  useEffect(() => {
    findResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputs]);

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
