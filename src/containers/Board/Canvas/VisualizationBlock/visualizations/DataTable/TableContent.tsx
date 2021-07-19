/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
import { useState } from 'react';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  ButtonGroup,
  Flex,
  Text,
  useColorModeValue as mode,
} from '@chakra-ui/react';

export const TableContent = (
  { columns, data }:
  { columns: any, data: any },
) => {
  const [pageNum, setPageNum] = useState(0);

  return (
    <>
      <Table my="8" borderWidth="1px" fontSize="sm">
        <Thead bg={mode('gray.50', 'gray.800')}>
          <Tr>
            {/* @ts-ignore */}
            {columns.map((column, index) => (
              <Th whiteSpace="nowrap" scope="col" key={index} textColor="black" fontSize="21px">
                {column}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {
            // @ts-ignore
            data.slice(10 * pageNum, 10 * pageNum + 9).map((row, index) => (
              <Tr key={index}>
                {/* @ts-ignore */}
                {columns.map((column, index) => (
                  <Td whiteSpace="nowrap" key={index} textColor="white">
                    {row?.[column]}
                  </Td>
                ))}
              </Tr>
            ))
          }
        </Tbody>
      </Table>
      <Flex align="center" justify="space-between">
        <Text color={mode('gray.600', 'gray.400')} fontSize="sm">
          {data.length}
          {' '}
          items
        </Text>
        <ButtonGroup
          variant="outline"
          size="sm"
          textColor="white"
          onClick={() => {
            if (pageNum === 0) {
              setPageNum(0);
            } else {
              setPageNum(pageNum + 1);
            }
          }}
        >
          <Button as="a" rel="prev">
            Previous
          </Button>
          <Button as="a" rel="next" onClick={() => setPageNum(pageNum + 1)}>
            Next
          </Button>
        </ButtonGroup>
      </Flex>
    </>
  );
};
