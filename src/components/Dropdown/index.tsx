import Dropdown, { ReactDropdownProps } from 'react-dropdown';
import 'react-dropdown/style.css';

import styled from '@emotion/styled';

const StyledDropdownComponent = styled(Dropdown)`
    .Dropdown-control {
        background-color: #2D3748;
        border: none;
        color: white;
        height: 40px;
        border-radius: 5px;
        font-size: 18px;
    }

    .Dropdown-menu {
        background-color: #848485;
        border: none;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
        box-sizing: border-box;
        max-height: 700px;
        position: absolute;
        width: 100%;
        z-index: 1000;
        border-radius: 5px;
        font-size: 18px;
    }
`;

const StyledDropdown = (
  {
    options,
    value,
    onChange,
  }: ReactDropdownProps,
) => (
  <StyledDropdownComponent
    options={options}
    value={value}
    onChange={onChange}
  />
);

export default StyledDropdown;
