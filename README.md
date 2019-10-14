Запуск сервера:
```
cd server && npm install && npm start
серверу можно передать параметры запуска, как аргументы ком. строки:
npm start <PORT> <REPO_URL>
или переменные окружения APP_PORT и REPOSITORY_URL

По умолчанию из конфига берется порт 3000.
В браузере по ссылке http://localhost:3000/ открывается главная страница, где можно запускать сборки
```

Запуск агента:
```
cd agent && npm install && npm start
агенту можно передать параметры запуска, как аргументы командной строки: npm start <PORT> <HOST>
или как переменные окужения APP_PORT и APP_HOST

По умолчанию из конфига берется порт 80.
Если запустить более одного агента, проверяется, свободен ли тот порт, который был высчитан
в порядке приоритетов переданных параметров(аргументы/переменные окружения/конфиг)
и если нет - берется любой свободный порт
```

Сервер хранит данные(сборки, агенты) на своей локальной файловой системе. Для этого используется [lowdb](https://github.com/typicode/lowdb) библиотека. Путь до db-файла логируется при инициализации, см. [db.js] (https://github.com/Astarta0/toy-ci/blob/master/server/src/server/db.js)

Каждый агент работает в директории tmp, и для каждой сборки, поступившей на обработку, создает папку с ее ID, куда клонирует репозиторий и выполняет команду.


### Реализация требований
- Агент должен корректно обрабатывать ситуацию, когда при старте не смог соединиться с сервером.
- Агент должен корректно обрабатывать ситуацию, когда при отправке результатов сборки не смог соединиться с сервером.
> В конфиге агента заданы параметры

> retry_сonnection - столько раз агент будет пытаться установить соединение с сервером

> retry_delay - интервал для попыток соединиться

> Агент попробует соединиться с сервером retry_сonnection-число раз.
> Если соединение так и не установлено, агент завершает свою работу


- Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать между сборками.
> У агента в конфиге задан параметр keepAliveInterval (ms).
> Каждые keepAliveInterval ms агент уведомляет сервер(эндпоинт keep_alive), что он жив.

> Сервер, в свою очередь, каждые keepAliveTimeout ms (из конфига), перебирает список агентов, и удаляет тех,
> которые давно не обновлялись в указанный таймаут интервал.

> Умерший агент удаляется, и если ему была ранее назначена buil-задача, то она уходит опять на обработку
> (назначится либо свободному агенту, либо уйдет в FIFO на ожидание)
>
> Когда агент возвращает результат завершенной задачи, его статус меняется с busy на free,
> и он снова доступен для назначения задач - проверяется FIFO-очередь задач и если есть задачи,
> первая с начала отправляется на обработку.

- Сервер должен корректно обрабатывать ситуацию, когда агент прекратил работать в процессе выполнения сборки
> Если агент умер в процессе выполнения задачи, сервер поймет это при периодической проверке жизнеспособности агентов,
> удалит агента из списка и отправит build-задачу на переработку

- Сервер должен корректно обрабатывать ситуацию, когда агенты не справляются с поступающими заявками.
> Если нет свободных агентов, задание хранится в очереди FIFO
------------------------------------------------
На главной странице отображается список ранее созданных сборок.
Сейчас, для регулярного обновления данных по всем сборкам, на этой странице регулярно запрашиваются данные через setInterval. Вместо polling'a, надо было бы использовать веб-сокеты, чтобы бекенд сам инициировал обновление на клиенте.


По ссылке на каждую сборку мы переходим к подробной информации по ней, и можно скопировать output'ы результата или сборочную команду

![alt text](/docs/mainPage.jpg?raw=true "Optional Title")
![alt text](/docs/BuildPage.jpg?raw=true "Optional Title")



