import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import styled from '@emotion/styled';

import style from './index.module.css';

const StyledDropdownComponent = styled(Dropdown)`
    .Dropdown-control {
        background-color: #2D3748;
        border: none;
        color: white;
        height: 40px;
        border-radius: 5px;
        font-family: "Gotham Bold";
        font-size: 18px;
    }

    /* .Dropdown-menu {
        background-color: #848485;
        border: none;
        color: white;
        height: 40px;
        border-radius: 5px;
        font-family: "Gotham Bold";
        font-size: 18px;
    } */
    .Dropdown-menu {
        background-color: #848485;
        border: none;
        box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
        box-sizing: border-box;
        margin-top: -1px;
        max-height: 200px;
        overflow-y: auto;
        position: absolute;
        top: 100%;
        width: 100%;
        z-index: 1000;
        border-radius: 5px;
        font-family: "Gotham Bold";
        font-size: 18px;
    }
`;

const StyledDropdown = (
  {
    options,
    value,
    onChange,
  }: {
    options: any;
    value: any;
    onChange: any
  },
) => (
  <>
    <div className={style.dropdown}>
      <StyledDropdownComponent
        options={options}
        value={value}
        onChange={onChange}
      />
    </div>
  </>
);

export default StyledDropdown;
