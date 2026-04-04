.PHONY: install backend frontend dev seed test clean

install:
	cd backend && python3 -m venv venv && ./venv/bin/pip install -r requirements.txt
	cd frontend && npm install

backend:
	cd backend && ./venv/bin/python main.py

frontend:
	cd frontend && npm run dev

dev:
	@echo "Starting backend and frontend..."
	cd backend && ./venv/bin/python main.py &
	cd frontend && npm run dev

seed:
	cd backend && ./venv/bin/python seed.py

test:
	cd backend && ./venv/bin/python -m pytest tests/ -v

clean:
	rm -rf backend/venv backend/__pycache__ backend/*.db
	rm -rf frontend/node_modules frontend/dist
