import { gql } from '@apollo/client';

export const ACCOUNT_WHITELIST_STATUS = gql`
    query ACCOUNT_WHITELIST_STATUS($email: String!) {
        accountWhitelistStatus(email: $email) {
            status
        }
    }
`;