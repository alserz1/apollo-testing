import { gql } from '@apollo/client/core';

/**
 * Это вынесено в отдельный файл просто чтобы избавиться от циклических зависимостей
 */
export const RPDocumentFragment = gql`
    fragment GetRPDocumentFragment on EDORPDocument {
        id
        name
        documentType @type(name: "DocumentType") {
            title
        }
    }
`;
