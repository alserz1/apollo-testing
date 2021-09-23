import { useApolloClient, InMemoryCache, TypePolicies } from '@apollo/client';

/**
 * чтобы брать из кэша, нужны данные
 * как данные придут, можно записать их через writeQuery в кэш, но перед этим их надо как-то преобразовать
 *
 * обратное преобразование всё ещё хз как. Да и прямое преобразование не сильно проще, дешевле новый бэкенд поднять
 */

export function useTypePolicies(policies: TypePolicies) {
    const client = useApolloClient();
    (client.cache as InMemoryCache).policies.addTypePolicies(policies);
}
