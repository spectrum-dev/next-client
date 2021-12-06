import { ReactNode } from 'react';
import { Box, Text } from '@chakra-ui/react';

const InfoPane = ({ title, description, children }: { title: string, description: string, children: ReactNode }) => {
  return (
          <Box margin="4rem 3rem 2rem 3rem">
              <Box marginBottom="2rem">
                  <Text fontSize="xl" fontWeight="500"> {title} </Text>
                  <Text fontSize="sm" fontWeight="300"> {description} </Text>
              </Box>
  
              <Box width="100%" minWidth="100%">
                  {children}
              </Box>
          </Box>
  );
};
  
export default InfoPane;