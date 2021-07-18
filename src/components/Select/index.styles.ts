import styled from '@emotion/styled';

import Select from 'react-select';

const StyledSelect = styled(Select)`
    line-height: 30px;
    font-family: "Gotham Bold";
    font-size: 18px;

    .react-select-container {
        color: black;
    }

    .react-select__control {
        background: '#2d3748';
        border: none;
    }

    .react-select__placeholder {
        color: black;
    }

    .react-select__single-value {
        color: black;
    }
`;

// eslint-disable-next-line import/prefer-default-export
export { StyledSelect };
