import {
  Box, Heading, LightMode, Stack, Text, useColorModeValue,
} from '@chakra-ui/react';

import { Card } from './Card';
import { GoogleLoginButton } from './GoogleLoginButton';
import { Logo } from './Logo';

import useAuth from './useAuth';

const Login = () => {
  const { signIn } = useAuth();

  return (
    <Box minH="100vh" as="section" bgGradient={{ md: 'linear(to-r, red.600, purple.600)' }} py="20">
      <Card maxW="2xl" mx="auto" textAlign="center">
        <Stack maxW="xs" mx="auto" spacing="8">
          {/* TODO: Swap out this top logo with my logo (can be basic) */}
          <Logo />
          <Stack spacing="3">
            <Heading as="h1" letterSpacing="tight">
              Log In
            </Heading>
            <Text fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
              Currently open to registered beta users
            </Text>
          </Stack>

          <LightMode>
            <GoogleLoginButton onClick={() => signIn()} />
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
      </Card>
    </Box>
  );
};

export default Login;
