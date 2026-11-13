# Правила проекта shop-web

Дата: 2026-11-13
Назначение: единые правила для дальнейшей разработки. Читать перед изменениями кода.

---

## 1. Стек и структура

- Next.js 16 (App Router), React 19, TypeScript, CSS Modules, zod, zustand.
- Данные — через `fetchService` и server actions (`"use server"`), ответы — `ResponseData<T>`.
- Структура маршрута: `src/app/<route>/page.tsx`, `action.ts`, `schema.ts`, `components/<Component>/<Component>.tsx` и `<Component>.module.css`.
- Общие UI — `src/shared/ui`, иконки — `src/shared/svg`, хелперы — `src/shared/helpers`.
- Крупные блоки — `src/views` и `src/widgets`.
- Состояние — `src/stores` (zustand + адаптеры).

## 2. Компоненты и данные

- **Серверный компонент готовит данные и текст, презентационный — только рисует.**
- В презентационные компоненты передаются простые пропсы: строки, массивы, флаги. Не объекты с логикой и не функции выбора вариантов.
- Варианты текста, склонения и вычисления живут в `page.tsx`/`action.ts`, а не внутри компонента.
- Тип пропсов — локальный `type Props` в файле компонента. Не экспортировать типы пропсов без необходимости.
- Не добавлять временные union-типы и «совместимость» вида `string | ""`. Либо строка, либо `undefined`, либо `null`.
- Не дублировать один и тот же текст в разных местах: источник один.
- **Ранний `return` не используется.** Условный рендер — тернарником или `&&` внутри JSX, как в `src/app/profile/page.tsx`: гость → `NotContent`, иначе → контент. Не делать `if (!user) return ...;` перед основным `return`.

### Эталон передачи данных

`src/app/profile/page.tsx`:

```ts
const hasName = userData.data?.name?.length > 0;
const hasPassword = userData.data?.has_password;
const profileNotice =
  !hasName && !hasPassword
    ? "Заполните профиль, укажите имя и установите пароль, чтобы входить без SMS."
    : !hasName && hasPassword
      ? "Укажите имя, так мы будем знать, как к вам обращаться."
      : !hasPassword && hasName
        ? "Установите пароль, пароль позволит входить в аккаунт без ожидания SMS."
        : "";

<ProfileContent
  profileNotice={profileNotice}
  navigateList={navigateList}
  title={`Телефон: ${getPhoneDisplay(phone)}`}
/>
```

`src/app/profile/components/ProfileContent/ProfileContent.tsx`:

```tsx
type Props = {
  navigateList: { label: string; value: string; href: string; params?: { view: string } }[];
  title: string;
  profileNotice: string;
};

export const ProfileContent = (props: Props) => {
  return (
    <ul className={styles.root}>
      {/* ...список навигации... */}
      {props.profileNotice && (
        <li className={styles.profileNotice}>
          <Link href={"/profile/settings"}>
            ⚠️ <span className={styles.profileNoticeText}>{props.profileNotice}</span>
          </Link>
        </li>
      )}
    </ul>
  );
};
```

## 3. Стили

- Только CSS Modules и вложенность. Без inline-стилей.
- Цвета и размеры — из переменных `src/app/styles/globals.css` (`--color-violet`, `--padding-content-block`, `--border-radius-main` и т.д.).
- Не добавлять фоны, рамки, тени и новые цвета, если об этом не просили. Минимализм важнее декора.
- Интерактивные элементы: `:hover`, `:focus-visible`, тач-зоны не меньше 44px там, где это уместно.
- Адаптив — через media queries проекта; проверять 320/768/1024/1440.

### Переиспользуемые UI

- Если одинаковый элемент повторяется на нескольких страницах — выносить в `src/shared/ui/<name>/` (`<Name>.tsx` + `<Name>.module.css`) и удалять дублирующиеся стили со страниц.
- Пропсы — простые: `href`, `text` и т.п.
- Эталон: `src/shared/ui/link-button/LinkButton.tsx` — кнопка-ссылка «Перейти в каталог»/«Настройки профиля». Заменила локальные `buttonLinkWrapper`/`btnText`/`buttonLink` на страницах `services/payment`, `services/faq`, `services/return`, `services/about`, `services/requisites`.

### Эталон стилей уведомления

`src/app/profile/components/ProfileContent/ProfileContent.module.css`:

```css
.profileNotice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: var(--border-radius-main);
  padding-block: 16px 8px;
}

.profileNoticeText {
  color: var(--color-violet);
  font-size: 14px;
}
```

## 4. Тексты

- Весь пользовательский текст — на русском.
- Текст ошибок и уведомлений берём из бекенда, если он есть; fallback — понятная фраза.
- Не добавлять `aria-label`, дублирующий видимый текст ссылки. Если у ссылки есть текст, отдельный `aria-label` не нужен.

## 5. Процесс работы

- Один запрос — один файл. Не менять несколько файлов сразу без разрешения.
- После каждой правки запускать:
  - `npx eslint <file>`
  - `npx tsc --noEmit`
- Не добавлять зависимости без согласования.
- Не оставлять `console.log`.
- Не удалять и не переименовывать чужие файлы без явной просьбы.
- Соблюдать существующий порядок пропсов и стиль форматирования.

## 6. Мои кардинальные ошибки (не повторять)

1. **Бизнес-логика в презентационном компоненте.** Я поместил выбор вариантов уведомления и тексты внутрь `ProfileContent`, тогда как по проекту текст готовит `page.tsx`, а компонент получает готовую строку.
2. **Объектный проп вместо строки.** Ввёл `ProfileNotice` с `hasName`/`hasPassword`, хотя достаточно `profileNotice: string`.
3. **Экспорт типа пропсов.** Экспортировал `ProfileNotice` из компонента, хотя тип пропсов должен быть локальным.
4. **Временный хак `string | ""`.** Добавил совместимость ради компиляции вместо того, чтобы сразу делать правильно.
5. **Дублирование копирайта.** Тексты оказались и в компоненте, и в page.
6. **Переусложнение UI.** Добавил фоновый блок, рамку, отдельную кнопку-ссылку, `:focus-visible` и лишний `aria-label` там, где нужен простой `Link` с текстом и ⚠️.
7. **Попытка менять несколько файлов сразу.** Нарушил правило «один файл за шаг».
8. **Не учёл, как передаёт автор.** Правильный подход — посмотреть на существующий `page.tsx` и повторить его паттерн, а не придумывать новый.
9. **Правка `edit` в обратную сторону.** Несколько раз вызвал `edit`, где `oldString` и `newString` были перепутаны: вместо удаления CSS-классов я их дублировал (в итоге в файле оказывалось 2–4 копии блока). Причина — слишком короткий `oldString` (например, один `.footer {`) и невнимательность к направлению замены. Правило: перед вызовом `edit` проговорить «что удаляю → что оставляю»; если правка повторяется в нескольких файлах — сначала сделать одну, проверить `git diff`, затем копировать проверенный шаблон. При сомнении — перезаписать файл целиком через `write`.

## 7. Журнал правок (2026-11-13)

### `ProfileContent.tsx`

- `profileNotice: string` — обязательный проп.
- Уведомление рендерится только при непустой строке.
- Разметка: `<li className={styles.profileNotice}>` → `<Link href="/profile/settings">` → `⚠️` + `<span className={styles.profileNoticeText}>`.

### `ProfileContent.module.css`

- `.profileNotice` — flex, `gap: 12px`, `padding-block: 16px 8px`, `border-radius: var(--border-radius-main)`.
- `.profileNoticeText` — `color: var(--color-violet)`, `font-size: 14px`.

### `page.tsx`

- `hasName = userData.data?.name?.length > 0`.
- `hasPassword = userData.data?.has_password`.
- `profileNotice` собирается тремя тернарниками; пустая строка — уведомление не показывать.
- `profileNotice` передаётся в `ProfileContent`.

### `src/shared/ui/link-button/LinkButton.tsx` + `LinkButton.module.css` (новый)

- Кнопка-ссылка: `<Link className={styles.buttonLinkWrapper}><Button fullWidth customClass={styles.buttonLink} variant="solid" variantColor="violet"><p className={styles.btnText}>{props.text}</p></Button></Link>`.
- Пропсы: `href: string`, `text: string`.
- Стили скопированы из кнопки страницы «Оплата» (`buttonLinkWrapper`, `btnText`, `buttonLink`).
- Используется: `src/app/profile/page.tsx` (вне `ul`), `src/app/services/{payment,faq,return,about,requisites}/page.tsx`.
- Со страниц удалены локальные классы `buttonLinkWrapper`, `btnText`, `buttonLink` и лишние импорты `Button`/`Link`.

### Осталось сделать

- Убрать `console.log(userData.data)` из `src/app/profile/page.tsx:39`.
- Создать страницу `/profile/settings` (задача 1).
- При желании заменить `name?.length > 0` на проверку с `trim()`, чтобы имя из пробелов не считалось заполненным.

## 8. Чек-лист перед сдачей

- [ ] Текст и варианты вычисляются в `page.tsx`/`action.ts`, а не в презентационном компоненте.
- [ ] В компонент передаются простые пропсы.
- [ ] Нет временных типов-заглушек и union-хаков.
- [ ] Нет раннего `return`; условный рендер — тернарником/`&&` в JSX.
- [ ] Стили минимальны и используют переменные проекта.
- [ ] Нет `console.log`.
- [ ] `npx eslint <file>` и `npx tsc --noEmit` проходят.
- [ ] Изменён только согласованный файл.
