interface IRPDocument {
    id: string;
    name: string;
    documentType: {
        title: string;
    };
}

const data = [
    {
        id: 'EDORPDocument0',
        name: `тестовое имя`,
        documentType: {
            title: `тест`,
            type: 'FIRST',
            extraField: 'qwewetrwerwe'
        }
    }
];

function deepClone<T extends object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

function loadById(id: IRPDocument['id']): Promise<IRPDocument> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const item = data.find((elem) => elem.id === id);
            if (!item) {
                reject(new Error(`РПДокумент с id ${id} не существует`));
                return;
            }
            resolve(deepClone(item));
        }, 1000);
    });
}

function mutateById(
    id: IRPDocument['id'],
    newName: IRPDocument['name']
): Promise<IRPDocument> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const item = data.find((elem) => elem.id === id);
            if (!item) {
                reject(new Error(`РПДокумент с id ${id} не существует`));
                return;
            }
            item.name = newName;
            resolve(deepClone(item));
        }, 1000);
    });
}

/**
 * Эта функция, скорее всего, будет создавать свой SbisService и отправлять запрос на БЛ.
 * Пока она просто прокидывает вызовы в заглушки
 * @param endpoint
 * @param methodName
 * @param methodArgs
 */
export function callMethod(
    endpoint: string,
    methodName: string,
    methodArgs: unknown
): Promise<object> {
    if (endpoint !== 'EDO') {
        throw new Error(`Некорректный endpoint ${endpoint}`);
    }
    switch (methodName) {
        case 'РПДокумент':
            return loadById.apply(null, methodArgs as [IRPDocument['id']]);
        case 'СохранитьРПДокумент':
            return mutateById.apply(
                null,
                methodArgs as [IRPDocument['id'], IRPDocument['name']]
            );
        default:
            throw new Error(
                `Некорректный methodName ${methodName} для endpoint ${endpoint}`
            );
    }
}
