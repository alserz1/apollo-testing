import { gql, useMutation } from '@apollo/client';
import {
    UpdateRPDocumentMutation,
    UpdateRPDocumentMutation_updateRPDocument,
    UpdateRPDocumentMutationVariables
} from './__generated__/UpdateRPDocumentMutation';
import { KeyboardEvent, useCallback, useState } from 'react';
import { RPDocumentFragment } from './RPDocumentFragment';

const UPDATE_RPDOCUMENT = gql`
    mutation UpdateRPDocumentMutation($id: ID!, $name: String!) {
        updateRPDocument(id: $id, name: $name) @wasabyBL(type: "EDORPDocument", endpoint: "EDO", method: "СохранитьРПДокумент") {
            ...GetRPDocumentFragment
        }
    }
    ${RPDocumentFragment}
`;

interface IProps {
    rpDocumentId: UpdateRPDocumentMutation_updateRPDocument['id'];
    initialName: UpdateRPDocumentMutation_updateRPDocument['name'];
}

/**
 * Этот контрол обновляет данные через текущую БЛ
 * @param props
 * @constructor
 */
export function UpdateRPDocument(props: IProps) {
    const [currentName, changeName] = useState(props.initialName);
    const [mutateFunction, { loading, called }] = useMutation<
        UpdateRPDocumentMutation,
        UpdateRPDocumentMutationVariables
    >(UPDATE_RPDOCUMENT);
    const onKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                mutateFunction({
                    variables: {
                        id: props.rpDocumentId,
                        name: (e.target as HTMLInputElement).value
                    }
                });
            }
        },
        [mutateFunction, props.rpDocumentId]
    );
    return (
        <div>
            <input
                onKeyDown={onKeyDown}
                onChange={(e) => changeName(e.target.value)}
                value={currentName}
            />
            {loading && called ? 'Обновляем данные в текущей БЛ' : null}
        </div>
    );
}
