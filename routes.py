from flask import render_template, request, jsonify, redirect, url_for, flash
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from models import db, User, Chat, Message
from ai_service import ai_service

def init_routes(app):

    
    @app.route('/')
    def index():
        if current_user.is_authenticated:
            return redirect(url_for('chat'))
        return redirect(url_for('login'))

    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            username = request.form['username']
            password = request.form['password']
            user = User.query.filter_by(username=username).first()
            
            if user and check_password_hash(user.password_hash, password):
                login_user(user)
                return redirect(url_for('chat'))
            else:
                flash('Invalid username or password')
        
        return render_template('login.html')

    @app.route('/register', methods=['GET', 'POST'])
    def register():
        if request.method == 'POST':
            username = request.form['username']
            email = request.form['email']
            password = request.form['password']
            
            if User.query.filter_by(username=username).first():
                flash('Username already exists')
                return render_template('register.html')
            
            if User.query.filter_by(email=email).first():
                flash('Email already exists')
                return render_template('register.html')
            
            user = User(
                username=username,
                email=email,
                password_hash=generate_password_hash(password)
            )
            db.session.add(user)
            db.session.commit()
            
            login_user(user)
            return redirect(url_for('chat'))
        
        return render_template('register.html')

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('login'))

    @app.route('/chat')
    @app.route('/chat/<int:chat_id>')
    @login_required
    def chat(chat_id=None):
        chats = Chat.query.filter_by(user_id=current_user.id).order_by(Chat.created_at.desc()).all()
        current_chat = None
        messages = []
        
        if chat_id:
            current_chat = Chat.query.filter_by(id=chat_id, user_id=current_user.id).first()
            if current_chat:
                messages = Message.query.filter_by(chat_id=current_chat.id).order_by(Message.timestamp.asc()).all()
        
        return render_template('chat.html', chats=chats, current_chat=current_chat, messages=messages)

    @app.route('/new_chat', methods=['POST'])
    @login_required
    def new_chat():
        title = request.json.get('title', 'New Chat')
        chat = Chat(title=title, user_id=current_user.id)
        db.session.add(chat)
        db.session.commit()
        return jsonify({'chat_id': chat.id, 'title': chat.title})

    @app.route('/send_message', methods=['POST'])
    @login_required
    def send_message():
        data = request.json
        chat_id = data.get('chat_id')
        message_content = data.get('message')
        
        if not chat_id or not message_content:
            return jsonify({'error': 'Missing chat_id or message'}), 400
        
        chat = Chat.query.filter_by(id=chat_id, user_id=current_user.id).first()
        if not chat:
            return jsonify({'error': 'Chat not found'}), 404
        
        # Save user message
        user_message = Message(content=message_content, is_user=True, chat_id=chat_id)
        db.session.add(user_message)
        
        try:
            # Get AI response using AI service
            ai_response = ai_service.get_response(message_content)
            
            # Save AI message
            ai_message = Message(content=ai_response, is_user=False, chat_id=chat_id)
            db.session.add(ai_message)
            db.session.commit()
            
            return jsonify({
                'user_message': message_content,
                'ai_response': ai_response,
                'timestamp': datetime.utcnow().isoformat()
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Failed to get AI response'}), 500

    @app.route('/delete_chat/<int:chat_id>', methods=['DELETE'])
    @login_required
    def delete_chat(chat_id):
        chat = Chat.query.filter_by(id=chat_id, user_id=current_user.id).first()
        if chat:
            db.session.delete(chat)
            db.session.commit()
            return jsonify({'success': True})
        return jsonify({'error': 'Chat not found'}), 404
