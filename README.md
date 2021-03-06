# Тестовое задание для ИнфинитиВеб

**Исполнитель**: _Дарья Чешихина_.<br>

---

## Памятка

### 1. Сборка

Собирается с помощью ***gulp 4***.

Включает в себя:

* автопрефиксер;
* browser-sync;
* минимизация css;

Ознакомиться со сборкой в файле **gulpfile.js**


#### 1.1. Команды в консоли в папке проекта для сборки:

##### Установить необходимые зависимости:

```
npm i
```
##### Запустить сборку проекта без запуска локального сервера:

```
npm run build
```

##### Запустить сборку проекта с минифицированными файлами без запуска локального сервера:

```
npm run prod
```
##### Запустить локальный сервер:

```
npm start
```


### 2. CSS

* Стили находятся в директории `/sourse/sass`
* Используется препроцессор Sass
* Стили для БЭМ-блоков находятся и импортируются в `/sourse/sass/style.scss` с помощью **@import**


### 3. HTML

* Находятся в корне директории `/sourse`


### 4. IMAGES

* Находятся в директории `/sourse/img`
* **Картинки меньше 50Кб** на переводятся в base64 в css с помощью **gulp-css-base64**
