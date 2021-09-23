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

export const User = memo(function User(props: IProps) {
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
