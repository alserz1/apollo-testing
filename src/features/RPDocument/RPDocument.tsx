import { memo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { GetRPDocumentQuery, GetRPDocumentQueryVariables } from './__generated__/GetRPDocumentQuery';
import { UpdateRPDocument } from './UpdateRPDocument';
import { RPDocumentFragment } from './RPDocumentFragment';

export const GET_RPDOCUMENT = gql`
    query GetRPDocumentQuery($id: ID!) {
        rpDocument(id: $id) @wasabyBL(type: "EDORPDocument", endpoint: "EDO", method: "РПДокумент") {
            ...GetRPDocumentFragment
        }
    }
    ${RPDocumentFragment}
`;

/**
 * Называется RPDocument, на самом деле, от реального РПДокумента очень далеко.
 * Этот контрол лазает за данными через текущую БЛ.
 */
export const RPDocument = memo(function RPDocument() {
    const { loading, error, data } = useQuery<
        GetRPDocumentQuery,
        GetRPDocumentQueryVariables
    >(GET_RPDOCUMENT, {
        variables: {
            id: 'EDORPDocument0'
        }
    });
    if (loading) {
        return <div>Грузим документ</div>;
    }
    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }
    if (!data || !data.rpDocument) {
        return <div>Не нашли РПДокумент с id: 0</div>;
    }

    return (
        <div>
            Имя: {data.rpDocument.name}
            <div>
                Обновление старой БЛ:{' '}
                <UpdateRPDocument
                    rpDocumentId={data.rpDocument.id}
                    initialName={data.rpDocument.name}
                />
            </div>
        </div>
    );
});
