import { gql } from '@apollo/client';


export const QUERY_SHARED_USERS = gql`
    query SHARED_USERS($strategyId: ID!) {
        sharedUsers(strategyId: $strategyId) {
            email
            permissions
        }
    }
`;

export const MUTATION_SHARE_STRATEGY = gql`
    mutation SHARE_STRATEGY($strategyId: ID!, $email: String!, $permissions: String!) {
        shareStrategy(strategyId: $strategyId, email: $email, permissions: $permissions) {
            shared
        }
    }
`;