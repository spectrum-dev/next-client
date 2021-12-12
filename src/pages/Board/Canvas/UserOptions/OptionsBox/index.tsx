import { Flex, FlexProps } from '@chakra-ui/react';

const OptionsBox = (props: FlexProps) => (
    <Flex
        alignItems="center"
        borderRadius="5px"
        backgroundColor="#FDFDFD"
        flexDirection="row"
        justifyContent="center"
        position="absolute"
        zIndex={10}
        {...props}
    />
);

export { OptionsBox };