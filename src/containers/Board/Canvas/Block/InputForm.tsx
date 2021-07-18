/* eslint-disable react/prop-types */
import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/react';
import React from 'react';

// 1. Create a text input component
const TextInput = React.forwardRef((props, ref) => (
  <FormControl>
    {/* @ts-ignore */}
    <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
    {/* @ts-ignore */}
    <Input ref={ref} id={props.id} {...props} />
  </FormControl>
));

// 2. Create the form
const InputForm = (
  { firstFieldRef, onCancel }:
  { firstFieldRef: HTMLDivElement, onCancel: () => void },
) => (
  <Stack spacing={4}>
    <TextInput
      // @ts-ignore
      label="First name"
      id="first-name"
      // @ts-ignore
      ref={firstFieldRef}
      defaultValue="John"
    />
    {/* @ts-ignore */}
    <TextInput label="Last name" id="last-name" defaultValue="Smith" />
    <ButtonGroup d="flex" justifyContent="flex-end">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button isDisabled colorScheme="teal">
        Save
      </Button>
    </ButtonGroup>
  </Stack>
);

export default InputForm;
