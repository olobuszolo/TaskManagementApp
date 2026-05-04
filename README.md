# ZTI

Prosta instrukcja uruchomienia aplikacji w Dockerze oraz uruchamiania testow.

## Wymagania

- Docker
- Docker Compose

## Budowanie obrazow Dockera

W katalogu glownym projektu uruchom:

```bash
docker compose build
```

Komenda zbuduje obrazy dla uslug `backend` i `frontend` zdefiniowanych w `docker-compose.yml`.

## Uruchomienie aplikacji

Po zbudowaniu obrazow uruchom aplikacje:

```bash
docker compose up
```

Aplikacja bedzie dostepna pod adresami:

- frontend: `http://localhost:3000`
- backend: `http://localhost:8000`
- baza danych PostgreSQL: `localhost:5432`

Aby uruchomic aplikacje w tle:

```bash
docker compose up -d
```

Aby zatrzymac kontenery:

```bash
docker compose down
```

## Testy

Testy backendu Django uruchom w kontenerze backendu:

```bash
docker compose run --rm backend python manage.py test
```

Frontend nie ma osobnego skryptu testowego w `package.json`. Mozna sprawdzic kod linterem:

```bash
docker compose run --rm frontend npm run lint
```

## Przydatne komendy

Podglad logow:

```bash
docker compose logs -f
```

Przebudowanie i ponowne uruchomienie aplikacji:

```bash
docker compose up --build
```
