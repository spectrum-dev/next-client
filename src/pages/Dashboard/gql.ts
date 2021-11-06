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

export const MUTATION_USER_STRATEGY = gql`
    mutation USER_STRATEGY($strategyName: String!) {
        userStrategy(strategyName: $strategyName) {
            strategyId
        }
    }
`;

export const MUTATION_DELETE_USER_STRATEGY = gql`
    mutation DELETE_STRATEGY($strategyId: ID!){
        deleteStrategy(strategyId: $strategyId)
    }
`;