import { gql } from '@apollo/client';

export const QUERY_USER_STRATEGIES = gql`
    query QUERY_USER_STRATEGIES {
        userStrategies {
            strategyId
            strategyName
            createdAt
        }
    }
`;