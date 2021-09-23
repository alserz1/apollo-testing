import { useCallback, useState, KeyboardEvent } from 'react';
import { gql, useMutation } from '@apollo/client';
import { userFragment } from './User';
import {
    UpdateUserMutation_updateUser,
    UpdateUserMutation,
    UpdateUserMutationVariables
} from './__generated__/UpdateUserMutation';

const UPDATE_USER = gql`
    mutation UpdateUserMutation($id: ID!, $name: String!) {
        updateUser(id: $id, name: $name) {
            ...GetUserFragment
        }
    }
    ${userFragment}
`;

interface IProps {
    userId: UpdateUserMutation_updateUser['id'];
    initialName: UpdateUserMutation_updateUser['name'];
}

export function UpdateUser(props: IProps) {
    const [currentName, changeName] = useState(props.initialName);
    const [mutateFunction] = useMutation<
        UpdateUserMutation,
        UpdateUserMutationVariables
    >(UPDATE_USER);
    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                mutateFunction({
                    variables: {
                        id: props.userId,
                        name: (e.target as HTMLInputElement).value
                    },
                    optimisticResponse: {
                        updateUser: {
                            __typename: 'User',
                            id: props.userId,
                            name: (e.target as HTMLInputElement).value
                        }
                    }
                });
            }
        },
        [mutateFunction, props.userId]
    );
    return (
        <input
            onKeyDown={onKeyDown}
            onChange={(e) => changeName(e.target.value)}
            value={currentName}
        />
    );
}
