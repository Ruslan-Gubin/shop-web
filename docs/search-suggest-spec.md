# Search Suggest API — Спецификация для бекенда

## 1. Назначение

Система поисковых подсказок (search suggest / autocomplete) для строки поиска в шапке магазина. Работает по принципу Wildberries/Ozon: сохраняет поисковые запросы пользователей и показывает топ популярных запросов при вводе.

---

## 2. Модель данных (сущность `Search`)

Таблица `search` в PostgreSQL:

@PrimaryGeneratedColumn({ type: "int", name: "id" })
id: number;

```sql
CREATE TABLE search (
  id          BIGSERIAL       PRIMARY KEY,
  text        VARCHAR(255)    NOT NULL,
  result_count INTEGER        NOT NULL DEFAULT 0,
  views       INTEGER         NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_search_queries_text UNIQUE (text),
  CONSTRAINT ck_search_queries_text_length
    CHECK (char_length(text) >= 3 AND char_length(text) <= 255)
);

CREATE INDEX idx_search_queries_text_prefix
  ON search_queries (text varchar_pattern_ops);

CREATE INDEX idx_search_queries_views_updated
  ON search_queries (views DESC, updated_at DESC);
```

### Поля

| Поле | Тип | Описание |
| ---- | --- | -------- |

@PrimaryGeneratedColumn({ type: "int", name: "id" })
id: number;
| `text` | VARCHAR(255) | Текст поискового запроса (уникальный, нормализованный) |
| `result_count` | INTEGER | Количество товаров, найденных по этому запросу на момент последнего поиска |
| `views` | INTEGER | Счётчик — сколько раз искали этот запрос |
| `created_at` | TIMESTAMPTZ | Дата первого поиска |
| `updated_at` | TIMESTAMPTZ | Дата последнего поиска (обновляется при каждом новом поиске) |

### Индексы

- **`idx_search_queries_text_prefix`** — ускорение `LIKE 'блокнот%'` (prefix search)
- **`idx_search_queries_views_updated`** — сортировка для топа запросов

---

## 3. API Endpoints

### 3.1. `GET /search?text={text}` — Получение подсказок

**Параметры запроса:**

| Параметр | Тип     | Обязательный | Описание                                             |
| -------- | ------- | ------------ | ---------------------------------------------------- |
| `text`   | string  | да           | Введённый пользователем текст (минимум 1 символ)     |
| `limit`  | integer | нет          | Количество результатов (по умолчанию 7, максимум 10) |

**Логика:**

- Найти все записи в `search_queries`, где `text` начинается с `q` (ILIKE / startsWith)
- Если поисковой строке было введено слово "блокнот" - клиенту не должно вернуться сущность в которой текст "блокнот"
- Отфильтровать запросы, где `result_count = 0` (ничего не нашлось — не показывать)
- Отсортировать по: `views DESC, updated_at DESC`
- Ограничить `limit` записей
- Исключить из результата сам `q` (если он есть в БД)

**Ответ (200):**

```json
{
 responseData(search_queries[], "success", [], "....");
}
```

**Пустой ответ (200):**

````json
{
 responseData([], "success", [], "....");
}

### 3.2. `POST /search/update?text={text}&result_count=20` — повышаем количество просмотров и устанавливаем количество результата если есть такая трока запроса в бд или создаем новую

**Параметры запроса:**

body

| Параметр | Тип     | Обязательный | Описание                                             |
| -------- | ------- | ------------ | ---------------------------------------------------- |
| `text`      | string  | да           | Введённый пользователем текст (минимум 1 символ)     |
| `result_count`      | number  | да           | Количество найденных товаров по этому запросу     |

**Логика:**

- В базе данных ищет такую строку текстом увеличивают ему количество просмотров на один и устанавливает количество найденных товаров  по этой строке
- Если в базе данных такой строке запроса нет тогда создает новую сущность с Дефолтными значениями

**Ответ (200):**

```json
{
 responseData(search_queries, "success", [], "....");
}
````

### 3.2. `GET /search/popular` — Топ популярных запросов

**Параметры запроса:**

| Параметр | Тип     | Обязательный | Описание                                             |
| -------- | ------- | ------------ | ---------------------------------------------------- |
| `limit`  | integer | нет          | Количество результатов (по умолчанию 5, максимум 20) |

**Логика:**

- Выбрать все записи из `search_queries`
- Отфильтровать где `result_count > 0`
- Отсортировать по: `views DESC, updated_at DESC`
- Ограничить `limit` записей

**Ответ (200):**

{
responseData(search_queries[], "success", [], "....");
}

надо вывести на клиенте

```json
{
  "popular": [
    "тетрадь 36 листов",
    "блокнот а5",
    "ручка шариковая",
    "карандаш чернографитный",
    "ежедневник 2025"
  ]
}
```

## 4. Фильтрация мусорных запросов

Чтобы в БД не накопилось миллион мусорных запросов за неделю, добавить следующие фильтры.

### 4.1. Стоп-символы и паттерны

Не сохранять запросы, соответствующие любому из условий:

```typescript
const GARBAGE_PATTERNS: RegExp[] = [
  /^(.?)\1{4,}$/, // ааааа, ббббб, 55555 (повторение одного символа 5+ раз)
  /^[йцукенгшщзхъфывапролджэячсмитьбю]{10,}$/i, // бессмысленный набор букв (10+ символов подряд с клавиатуры)
  /^[a-z]{10,}$/i, // латинские буквы 10+ подряд без смысла
  /^[0-9]{5,}$/, // только цифры 5+ подряд
  /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{3,}$/, // только спецсимволы 3+
  /(http|https|www\.)/i, // URL
  /[<>]/, // HTML-теги
];
```

### 4.5. Дополнительно — автоочистка (background job)

Ежедневный CRON (запуск в 03:00):

```sql
-- Удалить запросы с views = 1 и updated_at < NOW() - INTERVAL '30 days'
DELETE FROM search_queries
WHERE views = 1
  AND updated_at < NOW() - INTERVAL '30 days';
```

```sql
-- Удалить запросы с result_count = 0 и updated_at < NOW() - INTERVAL '7 days'
DELETE FROM search_queries
WHERE result_count = 0
  AND updated_at < NOW() - INTERVAL '7 days';
```

---

## 5. Сортировка

Общая формула сортировки для всех эндпоинтов:

```
ORDER BY views DESC, updated_at DESC
```

Пояснение:

- Сначала идут самые популярные запросы (больше всего поисков)
- При равном `views` — свежие запросы выше (чтобы трендовые запросы быстро поднимались)

---

## 7. Пример использования (фронтенд → бекенд)

```
1. Пользователь вводит "блок"
2. Frontend: GET /search?text=блок&limit=7
3. Backend: SELECT text FROM search_queries
            WHERE text ILIKE 'блок%' AND result_count > 0
            ORDER BY views DESC, updated_at DESC LIMIT 7;
4. Response: ["блокнот а5", "блокнот в клетку", "блокнот 96 листов", ...] сущности search[]
   (пустой массив, если ничего не нашли)
5. Пользователь выбирает "блокнот а5" (или нажимает Enter)
6. Frontend: POST /search/update { text: "блокнот а5", result_count: 24 }
7. Backend: INSERT ON CONFLICT (text) DO UPDATE SET views = views + 1, ...
```

---

## 8. Защита и валидация

| Аспект          | Решение                               |
| --------------- | ------------------------------------- |
| Длинные запросы | Обрезать до 255 символов + CHECK в БД |
| Пустые/короткие | Не сохранять < 3 символов             |
