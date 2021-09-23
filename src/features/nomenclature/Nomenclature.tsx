import { memo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useTypePolicies } from '../../useTypePolicies';
import {
    GetNomenclatureQuery,
    GetNomenclatureQuery_nomenclature,
    GetNomenclatureQueryVariables
} from './__generated__/GetNomenclatureQuery';

export const nomenclatureFragment = gql`
    fragment GetNomenclatureFragment on Nomenclature {
        id
        title
    }
`;

const GET_NOMENCLATURE = gql`
    query GetNomenclatureQuery($id: ID!) {
        nomenclature(id: $id) {
            ...GetNomenclatureFragment
            clientTest @client {
                text
            }
        }
    }
    ${nomenclatureFragment}
`;

export interface IProps {
    nomenclatureId: GetNomenclatureQuery_nomenclature['id'];
}

export const Nomenclature = memo(function Nomenclature(props: IProps) {
    useTypePolicies({
        Query: {
            fields: {
                nomenclature: {
                    read(_, { args, toReference }) {
                        return toReference({
                            __typename: 'Nomenclature',
                            id: (args as GetNomenclatureQuery_nomenclature).id
                        });
                    }
                }
            }
        }
    });
    useTypePolicies({
        Nomenclature: {
            fields: {
                clientTest: {
                    read() {
                        return {
                            ignoredField: '456',
                            text: '123'
                        };
                    }
                }
            }
        }
    });
    const { loading, error, data } = useQuery<
        GetNomenclatureQuery,
        GetNomenclatureQueryVariables
    >(GET_NOMENCLATURE, {
        variables: {
            id: props.nomenclatureId
        }
    });
    if (loading) {
        return <div>Грузим документ</div>;
    }
    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }
    if (!data || !data.nomenclature) {
        return <div>Не нашли номенклатуру с id: {props.nomenclatureId}</div>;
    }
    // @ts-ignore
    return <div>{data.nomenclature.title}, клиентское поле: {data.nomenclature.clientTest.text}</div>;
});
