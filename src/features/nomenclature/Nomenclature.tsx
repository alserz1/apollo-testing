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
        }
    }
    ${nomenclatureFragment}
`;

export interface IProps {
    nomenclatureId: GetNomenclatureQuery_nomenclature['id'];
}

/**
 * Если данные есть в кэше - берёт из кэша. Если хоть одного поля там не окажется - пойдёт на БЛ за всеми.
 * Взятие из кэша работает за счёт typePolicies, см. комменты к определению хука useTypePolicies.
 */
export const Nomenclature = memo(function Nomenclature(props: IProps) {
    /**
     * По сути здесь написано следующее:
     * если в запросе к типу Query (корневой запрос) участвует поле nomenclature, сгенерируй и верни ссылку в кэш
     * на элемент типа Nomenclature с переданным id.
     *
     * Apollo получит эту ссылку, поищет у себя такой объект, и если он есть - вернёт этот объект.
     */
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
    return <div>{data.nomenclature.title}</div>;
});
