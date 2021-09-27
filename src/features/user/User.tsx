import { memo } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
    GetUserQuery,
    GetUserQuery_user,
    GetUserQueryVariables
} from './__generated__/GetUserQuery';
import { useTypePolicies } from '../../useTypePolicies';

export const userFragment = gql`
    fragment GetUserFragment on User {
        id
        name
    }
`;

export const GET_USERS_BY_NAME = gql`
    query GetUsersByName($filter: UserFilter!) {
        users(filter: $filter) {
            ...GetUserFragment
        }
    }
    ${userFragment}
`;

const GET_USER = gql`
    query GetUserQuery($id: ID!) {
        user(id: $id) {
            ...GetUserFragment
        }
    }
    ${userFragment}
`;

export interface IProps {
    userId: GetUserQuery_user['id'];
}

/**
 * Если данные есть в кэше - берёт из кэша. Если хоть одного поля там не окажется - пойдёт на БЛ за всеми.
 * Взятие из кэша работает за счёт typePolicies, см. комменты к определению хука useTypePolicies.
 */
export const User = memo(function User(props: IProps) {
    /**
     * По сути здесь написано следующее:
     * если в запросе к типу Query (корневой запрос) участвует поле user, сгенерируй и верни ссылку в кэш
     * на элемент типа User с переданным id.
     *
     * Apollo получит эту ссылку, поищет у себя такой объект, и если он есть - вернёт этот объект.
     */
    useTypePolicies({
        Query: {
            fields: {
                user: {
                    read(_, { args, toReference }) {
                        return toReference({
                            __typename: 'User',
                            id: (args as GetUserQuery_user).id
                        });
                    }
                }
            }
        }
    });
    const { loading, error, data } = useQuery<
        GetUserQuery,
        GetUserQueryVariables
    >(GET_USER, {
        variables: {
            id: props.userId
        }
    });
    if (loading) {
        return <div>Грузим документ</div>;
    }
    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }
    if (!data || !data.user) {
        return <div>Не нашли пользователя с id: {props.userId}</div>;
    }
    return <div>{data.user.name}</div>;
});
