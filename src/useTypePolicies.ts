import { useApolloClient, InMemoryCache, TypePolicies } from '@apollo/client';

export function useTypePolicies(policies: TypePolicies) {
    const client = useApolloClient();
    (client.cache as InMemoryCache).policies.addTypePolicies(policies);
}
