import { DocumentNode, visit, StringValueNode, BREAK } from 'graphql';

/**
 * Ищет имя корневого селектора в запросе, чтобы использовать его в возвращаемых данных.
 * @param query
 */
export function findRootSelectorName(query: DocumentNode): string {
    let result = '';
    visit(query, {
        enter: {
            OperationDefinition(operationDefinition) {
                visit(operationDefinition, {
                    SelectionSet(selectionSet) {
                        visit(selectionSet, {
                            Field(field) {
                                result = field.name.value;
                                return BREAK;
                            }
                        });
                        if (result) {
                            return BREAK;
                        }
                    }
                });
                if (result) {
                    return BREAK;
                }
            }
        }
    });
    return result;
}

/**
 * Ищет и парсит директиву @wasabyBL
 * @param query
 */
export function findWasabyBLDirectives(query: DocumentNode): Array<{
    name: string;
    value: string;
}> {
    const args: Array<{
        name: string;
        value: string;
    }> = [];
    visit(query, {
        enter: {
            Directive(directive) {
                if (directive.name.value === 'wasabyBL') {
                    visit(directive, {
                       enter: {
                           Argument(argument) {
                               args.push({
                                   name: argument.name.value,
                                   value: (argument.value as StringValueNode).value
                               });
                           }
                       }
                    });
                }
                if (args.length === 3) {
                    return BREAK;
                }
            }
        }
    });
    return args;
}

/**
 * Эта штука позволит писать типы у вложенных полей через директиву @type.
 * Но я не уверен что буду её реализовывать, скорее я буду думать в сторону typePatcher'ов из apollo-link-rest
 * TODO: совсем не дописано
 * @param query
 */
export function findTypeDirectives(query: DocumentNode): Array<{
    path: string[];
    value: string
}> {
    const result: Array<{
        path: string[];
        value: string
    }> = [];
    visit(query, {
        Directive(directive) {
            if (directive.name.value === 'type') {
                visit(directive, {
                    Argument(argument) {
                        console.log(argument);
                    }
                })
            }
        }
    });
    return result;
}
