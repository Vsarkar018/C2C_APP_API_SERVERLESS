start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	db-migrate up
migrate-down:
	db-migrate donw

.PHONEY: start_db stop_db