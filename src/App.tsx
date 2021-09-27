import { Document } from './features/document/Document';
import { useQuery, gql } from '@apollo/client';
import { GetDocumentsIDs } from './__generated__/GetDocumentsIDs';
import { Search } from './Search/Search';
import { GET_USERS_BY_NAME } from './features/user/User';
import { RPDocument } from './features/RPDocument/RPDocument';

const GET_DOCUMENT_IDS = gql`
    query GetDocumentsIDs {
        nomenclatureDocuments {
            id
        }
    }
`;

/**
 * Тут ничего интересного - получаем список из id документов и кормим его детям.
 * Дети сами подгрузят всё что надо.
 * @constructor
 */
export default function App() {
    const { loading, error, data } = useQuery<GetDocumentsIDs>(
        GET_DOCUMENT_IDS
    );
    if (loading) {
        return <div>Грузим документы</div>;
    }
    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }
    const documents = (data as GetDocumentsIDs).nomenclatureDocuments.map(
        (doc) => doc.id
    );
    return (
        <div>
            <div>
                <h3>"Текущая" БЛ</h3>
                <RPDocument />
            </div>
            <h3>GraphQL БЛ</h3>
            <ul>
                {documents.map((docId: string) => {
                    return (
                        <li key={docId}>
                            <Document documentId={docId} />
                        </li>
                    );
                })}
            </ul>
            <h3>Поиск по пользователям (пока работает только в консоль)</h3>
            <div>
                <Search
                    query={GET_USERS_BY_NAME}
                    filterFieldName={'name'}
                    dataLoadCallback={(data) => {
                        console.log(data);
                    }}
                />
            </div>
        </div>
    );
}
