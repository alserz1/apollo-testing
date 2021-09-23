import { KeyboardEvent, useCallback } from 'react';
import { useLazyQuery, DocumentNode } from "@apollo/client";

interface IProps {
    query: DocumentNode;
    filterFieldName: string;
    dataLoadCallback: (data: unknown) => void;
}

export function Search(props: IProps) {
    const [loadData] = useLazyQuery(props.query, {
        onCompleted: props.dataLoadCallback,
        onError: props.dataLoadCallback
    });
    const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            loadData({
                variables: {
                    filter: {
                        [props.filterFieldName]: (e.target as HTMLInputElement).value
                    }
                }
            });
        }
    }, [loadData, props.filterFieldName]);
    return <input onKeyDown={onKeyDown} />
}
