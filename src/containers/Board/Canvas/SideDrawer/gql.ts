import { gql } from '@apollo/client';

export const QUERY_ALL_METADATA = gql`
    query ALL_METADATA {
        allMetadata
    }
`;