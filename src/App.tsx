import { Document } from "./features/document/Document";
import { useQuery, gql } from "@apollo/client";
import { GetDocumentsIDs } from './__generated__/GetDocumentsIDs';
import { Search } from './Search/Search';
import { GET_USERS_BY_NAME } from './features/user/User';

const GET_DOCUMENT_IDS = gql`
  query GetDocumentsIDs {
    nomenclatureDocuments {
      id
    }
  }
`;

export default function App() {
  const { loading, error, data } = useQuery<GetDocumentsIDs>(GET_DOCUMENT_IDS);
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
          <label>Поиск по документам: </label><Search query={GET_USERS_BY_NAME} filterFieldName={'name'} dataLoadCallback={(data) => {
            console.log(data);
        }}/>
        </div>
        <ul>
          {documents.map((docId: string) => {
            return (
                <li key={docId}>
                  <Document documentId={docId} />
                </li>
            );
          })}
        </ul>
      </div>
  );
}
