import random
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    role = data.get('role')
    name = data.get('name')
    mobile = data.get('mobile')
    raw_password = data.get('password')
    shop_name = data.get('shopName')
    shop_address = data.get('shopAddress')

    hashed_password = generate_password_hash(raw_password)
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor) 
    
    try:
        cursor.execute('SELECT * FROM users WHERE mobile = %s;', (mobile,))
        if cursor.fetchone():
            return jsonify({"error": "Mobile number already registered"}), 400

        insert_query = """
            INSERT INTO users (role, name, mobile, password, shop_name, shop_address)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (role, name, mobile, hashed_password, shop_name, shop_address))
        conn.commit()
        return jsonify({"message": "User created successfully!", "token": "dummy-token"}), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": "An error occurred during registration"}), 500
    finally:
        cursor.close()
        conn.close()


@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    mobile = data.get('mobile')
    raw_password = data.get('password')

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute('SELECT * FROM users WHERE mobile = %s;', (mobile,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password'], raw_password):
            return jsonify({
                "message": f"Welcome back, {user['name']}!",
                "token": "dummy-jwt-token",
                "role": user['role']
            }), 200
        else:
            return jsonify({"error": "Invalid mobile number or password"}), 401
    except Exception as e:
        return jsonify({"error": "An error occurred during login"}), 500
    finally:
        cursor.close()
        conn.close()


@auth_bp.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    mobile = data.get('mobile')

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute('SELECT id FROM users WHERE mobile = %s;', (mobile,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "No account found with that mobile number"}), 404

        otp = str(random.randint(100000, 999999))
        expiry = datetime.now() + timedelta(minutes=10)

        cursor.execute(
            'UPDATE users SET reset_otp = %s, otp_expiry = %s WHERE mobile = %s;',
            (otp, expiry, mobile)
        )
        conn.commit()

        print(f"\n{'='*30}\n🔐 OTP for {mobile}: {otp}\n{'='*30}\n")

        return jsonify({"message": "OTP sent successfully"}), 200

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": "Failed to generate OTP"}), 500
    finally:
        cursor.close()
        conn.close()


@auth_bp.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    mobile = data.get('mobile')
    user_otp = data.get('otp')
    new_password = data.get('newPassword')

    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        cursor.execute('SELECT reset_otp, otp_expiry FROM users WHERE mobile = %s;', (mobile,))
        user = cursor.fetchone()

        if not user or not user['reset_otp']:
            return jsonify({"error": "Invalid request"}), 400

        if user['reset_otp'] != user_otp:
            return jsonify({"error": "Invalid OTP"}), 401
            
        if datetime.now() > user['otp_expiry']:
            return jsonify({"error": "OTP has expired. Please request a new one."}), 401

        hashed_password = generate_password_hash(new_password)
        cursor.execute(
            'UPDATE users SET password = %s, reset_otp = NULL, otp_expiry = NULL WHERE mobile = %s;',
            (hashed_password, mobile)
        )
        conn.commit()

        return jsonify({"message": "Password reset successfully! You can now log in."}), 200

    except Exception as e:
        print("Error:", e)
        conn.rollback()
        return jsonify({"error": "Failed to reset password"}), 500
    finally:
        cursor.close()
        conn.close()