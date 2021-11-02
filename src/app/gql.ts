import { gql } from '@apollo/client';

/* Authentication Queries */
export const ACCOUNT_WHITELIST_STATUS = gql`
    query ACCOUNT_WHITELIST_STATUS($email: String!) {
        accountWhitelistStatus(email: $email) {
            status
        }
    }
`;