# Как выложить проект на GitHub (rodina-moskva)

Репозиторий уже создан: **https://github.com/nawas5/rodina-moskva** (приватный).

---

## Шаг 1. Установить Git (если ещё не установлен)

1. Скачай Git: **https://git-scm.com/download/win**
2. Установи с настройками по умолчанию.
3. Проверка: открой **новый** PowerShell или CMD и введи:
   ```text
   git --version
   ```
   Должна появиться версия (например `git version 2.43.0`).

---

## Шаг 2. Открыть терминал в папке проекта

- В Cursor: меню **Terminal → New Terminal** (или `` Ctrl+` ``).
- Либо открой PowerShell/CMD и перейди в папку:
  ```text
  cd c:\Projects\rodina_moskva
  ```

---

## Шаг 3. Инициализировать репозиторий

Выполни по очереди:

```text
git init
```

Появится сообщение вроде: `Initialized empty Git repository in c:/Projects/rodina_moskva/.git/`.

---

## Шаг 4. Добавить файлы в индекс

```text
git add .
```

Эта команда добавляет все файлы из папки (кроме тех, что перечислены в `.gitignore`). В репозиторий попадут: `rodina-moskva.html`, `main.js`, `style.css`, `RUN.md`, `State.md`, `.gitignore`, `GITHUB.md`.

---

## Шаг 5. Сделать первый коммит

```text
git commit -m "Первый коммит: сайт Rodina Moskva"
```

Если Git попросит указать имя и email (первый запуск):

```text
git config --global user.name "Твоё Имя"
git config --global user.email "твой@email.com"
```

После этого снова выполни команду `git commit` из шага 5.

---

## Шаг 6. Подключить удалённый репозиторий

```text
git remote add origin https://github.com/nawas5/rodina-moskva.git
```

Проверка:

```text
git remote -v
```

Должно быть:
- `origin  https://github.com/nawas5/rodina-moskva.git (fetch)`
- `origin  https://github.com/nawas5/rodina-moskva.git (push)`

---

## Шаг 7. Переименовать ветку в main (если нужно)

На GitHub по умолчанию основная ветка называется `main`. Проверь текущее имя:

```text
git branch
```

Если видишь `* master`, переименуй:

```text
git branch -M main
```

Если уже `main` — этот шаг можно пропустить.

---

## Шаг 8. Отправить код на GitHub

```text
git push -u origin main
```

- Git может открыть браузер или окно для **входа в GitHub** (логин/пароль или токен).
- Если репозиторий приватный и просит авторизацию, используй:
  - **Personal Access Token** вместо пароля: GitHub → Settings → Developer settings → Personal access tokens → Generate new token. Права: минимум `repo`. Подставь токен в поле пароля при `git push`.
- После успешной отправки код появится на странице https://github.com/nawas5/rodina-moskva.

---

## Дальнейшая работа

- Вносишь изменения в файлы → затем:
  ```text
  git add .
  git commit -m "Краткое описание изменений"
  git push
  ```
- Чтобы подтянуть изменения с GitHub (если правишь с другого места):
  ```text
  git pull
  ```

---

## Бэкенд (server) в этом репозитории?

Сейчас бэкенд лежит отдельно в `c:\Projects\server`. Варианты:

1. **Оставить как есть** — в репозитории только фронтенд; в `RUN.md` уже написано, что бэкенд запускается из `c:\Projects\server`.
2. **Добавить server в этот же репозиторий** — скопировать папку `c:\Projects\server` в `c:\Projects\rodina_moskva\server`, добавить в `server` файл `.gitignore` с содержимым `node_modules/` и `rodina.db`, затем выполнить в корне проекта:
   ```text
   git add server
   git commit -m "Добавлен бэкенд API"
   git push
   ```
   После этого в `RUN.md` можно заменить путь на `cd server` (вместо `cd c:\Projects\server`).
