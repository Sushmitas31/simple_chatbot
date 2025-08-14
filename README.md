# AI Chatbot Web Application

A mobile-responsive chatbot web application built with Python Flask and Bootstrap, featuring user authentication, chat history, and integration with Google's Gemini AI model.

## Features

- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Chat History**: Persistent chat sessions with sidebar navigation
- **AI Integration**: Powered by Google's Gemini AI model
- **Modern UI**: Clean, intuitive interface with Bootstrap 5
- **Real-time Chat**: Interactive messaging with AI responses

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, Bootstrap 5
- **Database**: SQLite (with SQLAlchemy ORM)
- **AI Model**: Google Gemini API
- **Authentication**: Flask-Login
- **Icons**: Bootstrap Icons

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd simple_chatbot
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   
   ```bash
   python app.py
   ```

6. **Open your browser** and navigate to `http://localhost:8001`

## Usage

### Getting Started

1. **Register**: Create a new account or log in with existing credentials
2. **Start Chatting**: Click "Start New Chat" or use the sidebar to create conversations
3. **Chat History**: Access previous conversations from the collapsible sidebar
4. **Mobile Support**: The app automatically adapts to mobile devices

### Features Overview

#### Authentication
- Secure user registration and login
- Password hashing with Werkzeug
- Session management with Flask-Login

#### Chat Interface
- Clean, modern chat interface
- Real-time message sending
- AI responses powered by Gemini
- Message timestamps
- Loading indicators

#### Sidebar Navigation
- Collapsible sidebar with chat history
- Hover-to-expand on desktop
- Touch-friendly mobile navigation
- Chat deletion functionality

#### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Optimized for both portrait and landscape modes

## API Endpoints

### Authentication
- `GET/POST /login` - User login
- `GET/POST /register` - User registration
- `GET /logout` - User logout

### Chat Management
- `GET /chat` - Main chat interface
- `GET /chat/<id>` - Specific chat conversation
- `POST /new_chat` - Create new chat
- `DELETE /delete_chat/<id>` - Delete chat

### Messaging
- `POST /send_message` - Send message and get AI response

## Database Schema

### Users Table
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `created_at`

### Chats Table
- `id` (Primary Key)
- `title`
- `created_at`
- `user_id` (Foreign Key)

### Messages Table
- `id` (Primary Key)
- `content`
- `is_user` (Boolean)
- `timestamp`
- `chat_id` (Foreign Key)

## File Structure

```
simple_chatbot/
├── app.py                # Flask application
├── models.py             # Database models
├── routes.py             # Application routes
├── config.py             # Configuration settings
├── ai_service.py         # AI service integration
├── __init__.py           # Package initialization
├── requirements.txt      # Python dependencies
├── README.md             # Project documentation
├── templates/            # HTML templates
│   ├── base.html         # Base template
│   ├── login.html        # Login page
│   ├── register.html     # Registration page
│   └── chat.html         # Chat interface
└── static/               # Static assets
    ├── css/
    │   └── style.css     # Custom styles
    └── js/
        └── main.js       # JavaScript functionality
```
