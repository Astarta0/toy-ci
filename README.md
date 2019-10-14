Запуск сервера:
`cd server && npm install && npm start`

серверу можно передать параметры запуска, как аргументы ком. строки:
npm start <PORT> <REPO_URL>

или переменные окружения APP_PORT и REPOSITORY_URL


Запуск агента:

`cd agent && npm install && npm start`

агенту можно передать параметры запуска, как аргументы командной строки:
npm start <PORT> <HOST>

или как переменные окужения APP_PORT и APP_HOST


Агент должен корректно обрабатывать ситуацию, когда при старте не смог соединиться с сервером.
Агент должен корректно обрабатывать ситуацию, когда при отправке результатов сборки не смог соединиться с сервером.
> В конфиге агента заданы параметры
> retry_сonnection - столько раз агент будет пытаться установить соединение с сервером
> retry_delay - интервал для попыток соединиться
> Агент попробует соединиться с сервером retry_сonnection-число раз.
> Если соединение так и не установлено, агент завершает свою работу


Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать между сборками.
> У агента в конфиге задан параметр keepAliveInterval (ms)
> Каждые keepAliveInterval ms агент уведомляет сервер(эндпоинт keep_alive), что он жив.
> Сервер, в свою очередь, каждые keepAliveTimeout ms (из конфига), перебирает список агентов, и удаляет тех,
> которые давно не обновлялись в указанный таймаут интервал.
> Умерший агент удаляется, и если ему была ранее назначена buil-задача, то она уходит опять на обработку
> (назначится либо свободному агенту, либо уйдет в FIFO на ожидание)
>
> Когда агент возвращает результат завершенной задачи, его статус меняется с busy на free,
> и он снова доступен для назначения задач - проверяется FIFO-очередь задач и если есть задачи,
> первая с начала отправляется на обработку.

Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать в процессе выполнения сборки
> Если агент умер в процессе выполнения задачи, сервер поймет это при периодической проверке жизнеспособности агентов,
> удалит агента из списка и отправит build-задачу на переработку

Сервер должен корректно обрабатывать ситуацию, когда агенты не справляются с поступающими заявками.
> Если нет свободных агентов, задание хранится в очереди FIFO



