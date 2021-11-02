import {
  Box, BoxProps, Heading, LightMode, Stack, Text, useColorModeValue,
} from '@chakra-ui/react';

import { ButtonProps } from '@chakra-ui/button';
import { Button } from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import useAuth from './useLogin';

/**
 * Google Login Button Styling
 */
const GoogleLoginButton = (props: ButtonProps) => (
  <Button
    fontSize="sm"
    fontWeight="bold"
    size="lg"
    leftIcon={<FaGoogle fontSize="18px" />}
    iconSpacing="3"
    colorScheme="red"
    width="full"
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
    <Box minH="100vh" as="section" bgGradient={{ md: 'linear(to-r, red.600, purple.600)' }} py="20">
      <LoginCard maxW="2xl" mx="auto" textAlign="center">
        <Stack maxW="xs" mx="auto" spacing="8">
          {/* TODO: Swap out this top logo with my logo (can be basic) */}
          <Stack spacing="3">
            <Heading as="h1" letterSpacing="tight">
              Log In
            </Heading>
            <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
              Currently open to registered beta users
            </Text>
          </Stack>

          <LightMode>
            <GoogleLoginButton onClick={async () => { await signIn(); }} />
          </LightMode>

          <Box fontSize="sm">
            <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
              Alpha v0.0.1
            </Text>
          </Box>
        </Stack>
        <Text
          mt="16"
          fontSize="xs"
          mx="auto"
          maxW="md"
          color={useColorModeValue('gray.600', 'gray.400')}
        >
          By continuing, you acknowledge that you have read, understood, and agree to our terms and
          condition
        </Text>
      </LoginCard>
    </Box>
  );
};

export default Login;
