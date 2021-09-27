import { ApolloLink } from '@apollo/client';
import { Observable } from '@apollo/client/utilities/observables/Observable';
import { callMethod } from '../features/RPDocument/data/RPDocumentData';
import { findRootSelectorName, findWasabyBLDirectives } from './GraphQLWalker';

/**
 * Здесь происходит вся магия по интеграции. Ищем нашу директиву, если нашли - разбираем аргументы,
 * прокидываем в метод БЛ. Результат метода немножко украшается для Apollo (добавляется __typename) и оборачивается в data.
 * Рядом с data ещё может быть error.
 * Если директиву не нашли - запрос без изменений улетит на graphql-сервер.
 */
export const WasabyBLLink = new ApolloLink((request, forward) => {
    const typeDirectives = findWasabyBLDirectives(request.query);
    if (typeDirectives.length) {
        // пока пачка ts-ignore, потом можно будет поменять типизацию findWasabyBLDirectives и возвращать не массив
        // @ts-ignore
        const typeName = typeDirectives.find(
            (directive) => directive.name === 'type'
        ).value;
        // @ts-ignore
        const endpoint = typeDirectives.find(
            (directive) => directive.name === 'endpoint'
        ).value;
        // @ts-ignore
        const method = typeDirectives.find(
            (directive) => directive.name === 'method'
        ).value;
        const rootSelectorName = findRootSelectorName(request.query);
        return new Observable((observer) => {
            // TODO: аргументы должны приниматься объектами, а не массивами
            const methodArgs =
                method === 'РПДокумент'
                    ? [request.variables.id]
                    : [request.variables.id, request.variables.name];
            callMethod(endpoint, method, methodArgs).then((data) => {
                const result = {
                    data: {
                        [rootSelectorName]: {
                            __typename: typeName,
                            ...data
                        }
                    }
                };
                observer.next(result);
                observer.complete();
            });
        });
    }
    return forward(request).map((data) => {
        return data;
    });
});
