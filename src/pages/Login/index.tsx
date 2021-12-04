import {
  Box, BoxProps, Text, useColorModeValue,
} from '@chakra-ui/react';

import { ButtonProps } from '@chakra-ui/button';
import { Button } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';


import { ReactComponent as Logo } from './logo.svg';
import useAuth from './useLogin';

/**
 * Google Login Button Styling
 */
const GoogleLoginButton = (props: ButtonProps) => (
  <Button
    marginTop="1.5rem"
    fontSize="sm"
    fontWeight="bold"
    size="lg"
    leftIcon={<FaGoogle fontSize="18px" />}
    iconSpacing="3"
    colorScheme="red"
    width="20rem"
    {...props}
  >
    Continue with Google
  </Button>
);


/**
 * Login Card
 */
export const LoginCard = (props: BoxProps) => (
  <Box bg={useColorModeValue('white', 'gray.800')} rounded={{ md: '2xl' }} p="8" {...props} />
);

const Login = () => {
  const { signIn } = useAuth();

  return (
    <Box height="100vh" overflow="hidden" position="relative" bg="#323232">
      <Box align="center" marginTop="12%">
        <Logo style={{ width: '16rem', height: '6rem' }}/>

        <Text color="white" fontSize="2xl" marginTop="1rem" fontWeight="500"> Log in </Text>
        <GoogleLoginButton onClick={async () => { await signIn(); }}/>
      </Box>
    </Box>
  );
};

export default Login;
