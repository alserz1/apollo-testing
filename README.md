# apollo-testing
Интеграция текущей БЛ Wasaby и Apollo GraphQL.

# Установка и запуск
Для запуска нужно выполнить
```
npm run codegen
npm run start
```

Если изменялись graphql типы, то нужно опять прогнать `npm run codegen`

Если сервер умрёт, то нужно зайти сюда: и просто обновить вкладку: https://codesandbox.io/s/mutations-example-app-server-forked-qys9u?file=/index.js

Поиграться со схемой можно здесь: https://qys9u.sse.codesandbox.io/

Для подсветки graphql-кода в Webstorm есть плагин: https://plugins.jetbrains.com/plugin/8097-js-graphql

Но он не очень дружит со схемой, которую скачивает Apollo, его напрягают комментарии. Пока не знаю как это победить, просто чищу комменты руками в `schema.graphql`.

# Как всё будет работать на клиенте
Все контролы описывают свои данные через GraphQL и работают с ними через Apollo. Это даёт несколько плюсов, например:

- Контролы автоматически получат только те данные, которые они просили, независимо от ответа БЛ;
- Автоматическая нормализация и раскладывание данных по типам;
- По умолчанию, все компоненты на странице будут перерисовываться автоматически при изменении их данных. Например, если мы изменили описание задачи в карточке - обновится элемент в списке задач;
- Оптимистичные перерисовки легко настраиваются, и если ответ БЛ не будет отличаться - то после него даже не будет перерисовки;
- Можно писать контролы так, что они возьмут данные из кэша, если они там есть, а если нет - слазают на БЛ сами. Например, User и Nomenclature здесь умеют сами запрашивать данные. Можно подредактировать запрос в Document.tsx, например, выкинуть оттуда упоминания nomenclature После этого нужно обновить страницу и посмотреть в network - там будет не 4 запроса, а больше;

Если контрол пользуется старой БЛ, то он в запрос добавляет директиву `@wasabyBL(type: "EDORPDocument", endpoint: "EDO", method: "РПДокумент")`. Из непонятного тут только type, скорее всего. Это то, что попадёт в служебное поле __typename корневого элемента. Это нужно GraphQL для понимания объект какого типа пришёл, а дальше это используется для нормализации и складывания в кэш.

Все запросы с этой директивой будут перехватываться и отправляться по нужному адресу. Результаты отдаются в Apollo, он нормализует, обновляет кэш и обновляет компоненты.

Вложенные типы тоже можно будет описывать, пока не остановился как именно.
