import { Contragent, contragentFragment } from './../contragent/Contragent';
import {
    Nomenclature,
    nomenclatureFragment
} from './../nomenclature/Nomenclature';
import { User, userFragment } from './../user/User';
import { UpdateUser } from '../user/UpdateUser';
import { useQuery, gql } from '@apollo/client';
import {
    GetDocument,
    GetDocument_nomenclatureDocument,
    GetDocumentVariables
} from './__generated__/GetDocument';

const GET_DOCUMENT = gql`
    query GetDocument($id: ID!) {
        nomenclatureDocument(id: $id) {
            id
            contragent {
                ...GetContragentFragment
            }
            nomenclatures {
                ...GetNomenclatureFragment
            }
            executors {
                ...GetUserFragment
            }
        }
    }
    ${contragentFragment}
    ${nomenclatureFragment}
    ${userFragment}
`;

/**
 * Грузит данные для себя и всех детей, в детей отдаётся только id (кроме контрагента, он летит полностью,
 * потому что я так захотел).
 * Дети по id получают всё, что им надо. Если всё есть в кэше Apollo - запроса на БЛ не будет.
 * @param props
 * @constructor
 */
export function Document(props: { documentId: string }) {
    const { loading, error, data } = useQuery<
        GetDocument,
        GetDocumentVariables
    >(GET_DOCUMENT, {
        variables: {
            id: props.documentId
        }
    });
    if (loading) {
        return <div>Грузим документ</div>;
    }
    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }
    const doc = (data as GetDocument)
        .nomenclatureDocument as GetDocument_nomenclatureDocument;
    return (
        <>
            <div>
                Исполнители:
                <ol>
                    {doc.executors.map((user, index) => {
                        return (
                            <li key={user.id}>
                                {index === 0 ? (
                                    <UpdateUser
                                        userId={user.id}
                                        initialName={user.name}
                                    />
                                ) : (
                                    <User userId={user.id} />
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
            <div>
                Контрагент: <Contragent contragent={doc.contragent} />
            </div>
            <div>
                Номенклатуры:
                <ol>
                    {doc.nomenclatures.map((nomenclature) => {
                        return (
                            <li key={nomenclature.id}>
                                <Nomenclature
                                    nomenclatureId={nomenclature.id}
                                />
                            </li>
                        );
                    })}
                </ol>
            </div>
        </>
    );
}
