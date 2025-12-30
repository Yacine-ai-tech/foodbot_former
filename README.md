# FoodBot Former

A full-stack application for food ordering or recommendations, featuring a Python backend and a React frontend.

## Description

This project includes a foodbot with a backend API and a frontend interface for interacting with food-related services.

## Project Structure

- `main.py`: Main Python script for the backend.
- `foodbot.sql`: Database schema.
- `foodbot/`: Backend code directory.
- `foodbot-frontend/`: React frontend application.
- `venv/`: Python virtual environment.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Yacine-ai-tech/foodbot_former.git
   cd foodbot_former
   ```

2. Set up the backend:
   - Create a virtual environment:
     ```
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Set up the database (assuming SQLite or similar from foodbot.sql).

3. Set up the frontend:
   - Navigate to the frontend directory:
     ```
     cd foodbot-frontend
     ```
   - Install dependencies:
     ```
     npm install
     ```

## Usage

1. Run the backend:
   ```
   python main.py
   ```

2. Run the frontend:
   ```
   cd foodbot-frontend
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Contributing

Feel free to fork and submit pull requests.

## License

MIT License