import { Box, HStack } from '@chakra-ui/react';
import { BsCaretRightFill } from 'react-icons/bs';

interface NavItemProps {
  href?: string
  label: string
  subtle?: boolean
  active?: boolean
  icon: React.ReactElement
  endElement?: React.ReactElement
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLDivElement>,
}

export const NavItem = ({
  active, subtle, icon, children, label, endElement, onClick,
}: NavItemProps) => (
  <HStack
    w="full"
    px="3"
    py="2"
    cursor="pointer"
    userSelect="none"
    rounded="md"
    transition="all 0.2s"
    bg={active ? 'gray.700' : undefined}
    _hover={{ bg: 'gray.700' }}
    _active={{ bg: 'gray.600' }}
    onClick={onClick}
  >
    <Box fontSize="lg" color={active ? 'currentcolor' : 'gray.400'}>
      {icon}
    </Box>
    <Box flex="1" fontWeight="inherit" color={subtle ? 'gray.400' : undefined}>
      {label}
    </Box>
    {endElement && !children && <Box>{endElement}</Box>}
    {children && <Box fontSize="xs" flexShrink={0} as={BsCaretRightFill} />}
  </HStack>
);