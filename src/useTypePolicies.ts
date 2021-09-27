import { useApolloClient, InMemoryCache, TypePolicies } from '@apollo/client';

/**
 * В основном, используется для того, чтобы показать где лежат данные для определённого типа.
 * По умолчанию данные кэшируются по запросу. Но иногда бывает, что у нас данные для одного запроса, прилетели в другом.
 * Например, список запросил данные для всех элементов, а конкретные элементы хотят только свои данные.
 * Нет смысла два раза бегать на БЛ, можно просто перенаправить кэш.
 * Подробнее:
 * https://www.apollographql.com/docs/react/caching/advanced-topics/#cache-redirects
 *
 * Также можно использовать для всякой магии, типа вычисляемых полей/преобразования типов.
 *
 * Сюда передаются объекты вида:
 * названиеТипа {
 *     fields: {
 *         названиеПоля: {
 *             read(cachedValue, options) => newValue,
 *             merge(cachedValue, newValue, options) => newValue
 *         }
 *     }
 * }
 * @param policies
 */
export function useTypePolicies(policies: TypePolicies) {
    const client = useApolloClient();
    (client.cache as InMemoryCache).policies.addTypePolicies(policies);
}
