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

const StatCard = (
  { data: { label, value, type }, onClose }: StatCardProps,
) => {
  const onDrag = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.dataTransfer.setData('application/reactflow-flow-block-type', 'resultBlock');
    event.dataTransfer.setData('application/reactflow-data-label', label);
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
      onDragStart={(event) => {
        onDrag(event);
        onClose();
      }}
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
