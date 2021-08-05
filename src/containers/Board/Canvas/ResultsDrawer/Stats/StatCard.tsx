/* eslint-disable react/destructuring-assignment */
import {
  Box, Flex, Text, Center,
} from '@chakra-ui/react';

export interface StatCardProps {
  data: {
    label: string
    value: number
    type: string
  },
  onClose: () => void
}

function format(value: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return formatter.format(value);
}

const StatCard = (props: StatCardProps) => {
  const { onClose } = props;
  const {
    label, value, type,
  } = props.data;

  const onDrag = (
    event: any,
  ) => {
    event.dataTransfer.setData('application/reactflow-flow-block-type', 'resultsBlock');
    event.dataTransfer.setData('application/reactflow-data-label', label);
    event.dataTransfer.setData('application/reactflow-data-value', value);
    event.dataTransfer.setData('application/reactflow-data-type', type);

    onClose();
  };

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
      draggable
      // @ts-ignore
      onDragStart={onDrag}
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
