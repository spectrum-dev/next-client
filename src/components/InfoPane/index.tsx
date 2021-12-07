import { ReactNode } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const InfoPane = ({ title, description, children, rightIcon }: { title: string, description: string, children: ReactNode, rightIcon?: ReactNode }) => (
          <Box margin="4rem 3rem 2rem 3rem">
              <Flex marginBottom="2rem" flexDirection="row">
                  <Box>
                    <Text fontSize="xl" fontWeight="500"> {title} </Text>
                    <Text fontSize="sm" fontWeight="300"> {description} </Text>
                  </Box>

                  <Box marginLeft="auto">
                      {rightIcon}
                  </Box>
              </Flex>
  
              <Box width="100%" minWidth="100%">
                  {children}
              </Box>
          </Box>
);
  
export default InfoPane;