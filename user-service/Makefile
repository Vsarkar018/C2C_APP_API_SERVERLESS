start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	node node_modules/db-migrate/bin/db-migrate up
migrate-down:
	node node_modules/db-migrate/bin/db-migrate donw

create_migration:
	$ node node_modules/db-migrate/bin/db-migrate create $(n) --sql-file
server:
	yarn run dev

.PHONEY: start_db stop_db server migrate migrate-down create_migration