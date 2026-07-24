import os
import traceback
import cloudinary
import cloudinary.uploader
from flask import Blueprint, request, jsonify
from database import get_db_connection
from dotenv import load_dotenv

load_dotenv()

shop_bp = Blueprint('shop', __name__)

if os.getenv("CLOUDINARY_CLOUD_NAME"):
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )


def row_to_dict(cur, row):
    """Turn a single DB row into a dict using the cursor's column names."""
    if row is None:
        return None
    columns = [desc[0] for desc in cur.description]
    return dict(zip(columns, row))


def rows_to_list(cur, rows):
    columns = [desc[0] for desc in cur.description]
    return [dict(zip(columns, row)) for row in rows]



@shop_bp.route('/api/products', methods=['GET'])
def list_products():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM products ORDER BY created_at DESC;")
        rows = cur.fetchall()
        products = rows_to_list(cur, rows)
        return jsonify({"success": True, "products": products}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT LIST ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/products/public', methods=['GET'])
def list_public_products():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM products WHERE is_active = TRUE ORDER BY created_at DESC;")
        rows = cur.fetchall()
        products = rows_to_list(cur, rows)
        return jsonify({"success": True, "products": products}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT PUBLIC LIST ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM products WHERE id = %s;", (product_id,))
        row = cur.fetchone()
        product = row_to_dict(cur, row)

        if product is None:
            return jsonify({"success": False, "error": "Product not found"}), 404

        return jsonify({"success": True, "product": product}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT VIEW ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/products', methods=['POST'])
def add_product():
    conn = None
    cur = None
    try:
        name = request.form.get('name', '').strip()
        brand = request.form.get('brand', '').strip()

        price_str = request.form.get('price', '0')
        price = float(price_str) if price_str else 0.0

        qty_str = request.form.get('quantity', '0')
        quantity = int(qty_str) if qty_str else 0

        image_file = request.files.get('image')
        image_url = None
        if image_file and image_file.filename != '':
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('secure_url')

        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            INSERT INTO products (name, brand, price, quantity, image_url)
            VALUES (%s, %s, %s, %s, %s) RETURNING id;
        """
        cur.execute(query, (name, brand, price, quantity, image_url))
        new_id = cur.fetchone()[0]

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Product added",
            "id": new_id,
            "image_url": image_url
        }), 201

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT UPLOAD ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    conn = None
    cur = None
    try:
        name = request.form.get('name', '').strip()
        brand = request.form.get('brand', '').strip()

        price_str = request.form.get('price', '0')
        price = float(price_str) if price_str else 0.0

        qty_str = request.form.get('quantity', '0')
        quantity = int(qty_str) if qty_str else 0

        image_file = request.files.get('image')
        new_image_url = None
        if image_file and image_file.filename != '':
            upload_result = cloudinary.uploader.upload(image_file)
            new_image_url = upload_result.get('secure_url')

        conn = get_db_connection()
        cur = conn.cursor()

        if new_image_url:
            query = """
                UPDATE products
                SET name = %s, brand = %s, price = %s, quantity = %s, image_url = %s
                WHERE id = %s
                RETURNING id;
            """
            cur.execute(query, (name, brand, price, quantity, new_image_url, product_id))
        else:
            query = """
                UPDATE products
                SET name = %s, brand = %s, price = %s, quantity = %s
                WHERE id = %s
                RETURNING id;
            """
            cur.execute(query, (name, brand, price, quantity, product_id))

        updated = cur.fetchone()
        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Product not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Product updated",
            "id": updated[0],
            "image_url": new_image_url
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT UPDATE ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM products WHERE id = %s RETURNING id;", (product_id,))
        deleted = cur.fetchone()

        if deleted is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Product not found"}), 404

        conn.commit()
        return jsonify({"success": True, "message": "Product deleted", "id": deleted[0]}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT DELETE ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/products/<int:product_id>/stop-sharing', methods=['PATCH'])
def stop_sharing_product(product_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE products SET is_active = FALSE WHERE id = %s RETURNING id, is_active;",
            (product_id,)
        )
        updated = cur.fetchone()

        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Product not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Product is no longer shared",
            "id": updated[0],
            "is_active": updated[1]
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT STOP-SHARING ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/products/<int:product_id>/resume-sharing', methods=['PATCH'])
def resume_sharing_product(product_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE products SET is_active = TRUE WHERE id = %s RETURNING id, is_active;",
            (product_id,)
        )
        updated = cur.fetchone()

        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Product not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Product is being shared again",
            "id": updated[0],
            "is_active": updated[1]
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 PRODUCT RESUME-SHARING ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()



@shop_bp.route('/api/offers', methods=['GET'])
def list_offers():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM offers ORDER BY created_at DESC;")
        rows = cur.fetchall()
        offers = rows_to_list(cur, rows)
        return jsonify({"success": True, "offers": offers}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER LIST ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/offers/public', methods=['GET'])
def list_public_offers():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM offers WHERE is_active = TRUE ORDER BY created_at DESC;")
        rows = cur.fetchall()
        offers = rows_to_list(cur, rows)
        return jsonify({"success": True, "offers": offers}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER PUBLIC LIST ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/offers/<int:offer_id>', methods=['GET'])
def get_offer(offer_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM offers WHERE id = %s;", (offer_id,))
        row = cur.fetchone()
        offer = row_to_dict(cur, row)

        if offer is None:
            return jsonify({"success": False, "error": "Offer not found"}), 404

        return jsonify({"success": True, "offer": offer}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER VIEW ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/offers', methods=['POST'])
def add_offer():
    conn = None
    cur = None
    try:
        offer_title = request.form.get('offerTitle', '').strip()
        target_product = request.form.get('targetProduct', '').strip()
        valid_until = request.form.get('validUntil', '').strip()

        discount_str = request.form.get('discount', '0')
        discount = float(discount_str) if discount_str else 0.0

        image_file = request.files.get('image')
        image_url = None
        if image_file and image_file.filename != '':
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('secure_url')

        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            INSERT INTO offers (offer_title, target_product, discount, valid_until, image_url)
            VALUES (%s, %s, %s, %s, %s) RETURNING id;
        """
        cur.execute(query, (offer_title, target_product, discount, valid_until, image_url))
        new_id = cur.fetchone()[0]

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Offer created",
            "id": new_id,
            "image_url": image_url
        }), 201

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER UPLOAD ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/offers/<int:offer_id>', methods=['PUT'])
def update_offer(offer_id):
    conn = None
    cur = None
    try:
        offer_title = request.form.get('offerTitle', '').strip()
        target_product = request.form.get('targetProduct', '').strip()
        valid_until = request.form.get('validUntil', '').strip()

        discount_str = request.form.get('discount', '0')
        discount = float(discount_str) if discount_str else 0.0

        image_file = request.files.get('image')
        new_image_url = None
        if image_file and image_file.filename != '':
            upload_result = cloudinary.uploader.upload(image_file)
            new_image_url = upload_result.get('secure_url')

        conn = get_db_connection()
        cur = conn.cursor()

        if new_image_url:
            query = """
                UPDATE offers
                SET offer_title = %s, target_product = %s, discount = %s,
                    valid_until = %s, image_url = %s
                WHERE id = %s
                RETURNING id;
            """
            cur.execute(query, (offer_title, target_product, discount, valid_until, new_image_url, offer_id))
        else:
            query = """
                UPDATE offers
                SET offer_title = %s, target_product = %s, discount = %s, valid_until = %s
                WHERE id = %s
                RETURNING id;
            """
            cur.execute(query, (offer_title, target_product, discount, valid_until, offer_id))

        updated = cur.fetchone()
        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Offer not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Offer updated",
            "id": updated[0],
            "image_url": new_image_url
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER UPDATE ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/offers/<int:offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM offers WHERE id = %s RETURNING id;", (offer_id,))
        deleted = cur.fetchone()

        if deleted is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Offer not found"}), 404

        conn.commit()
        return jsonify({"success": True, "message": "Offer deleted", "id": deleted[0]}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER DELETE ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/offers/<int:offer_id>/stop-sharing', methods=['PATCH'])
def stop_sharing_offer(offer_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE offers SET is_active = FALSE WHERE id = %s RETURNING id, is_active;",
            (offer_id,)
        )
        updated = cur.fetchone()

        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Offer not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Offer is no longer shared",
            "id": updated[0],
            "is_active": updated[1]
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER STOP-SHARING ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/offers/<int:offer_id>/resume-sharing', methods=['PATCH'])
def resume_sharing_offer(offer_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE offers SET is_active = TRUE WHERE id = %s RETURNING id, is_active;",
            (offer_id,)
        )
        updated = cur.fetchone()

        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Offer not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Offer is being shared again",
            "id": updated[0],
            "is_active": updated[1]
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 OFFER RESUME-SHARING ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()



@shop_bp.route('/api/ads', methods=['GET'])
def list_ads():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM ads ORDER BY created_at DESC;")
        rows = cur.fetchall()
        ads = rows_to_list(cur, rows)
        return jsonify({"success": True, "ads": ads}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 AD LIST ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/ads/<int:ad_id>', methods=['GET'])
def get_ad(ad_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM ads WHERE id = %s;", (ad_id,))
        row = cur.fetchone()
        ad = row_to_dict(cur, row)

        if ad is None:
            return jsonify({"success": False, "error": "Ad not found"}), 404

        return jsonify({"success": True, "ad": ad}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 AD VIEW ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/ads', methods=['POST'])
def add_ad():
    conn = None
    cur = None
    try:
        ad_title = request.form.get('adTitle', '').strip()
        placement = request.form.get('placement', '').strip()
        target_url = request.form.get('targetUrl', '').strip()

        image_file = request.files.get('image')
        image_url = None
        if image_file and image_file.filename != '':
            upload_result = cloudinary.uploader.upload(image_file)
            image_url = upload_result.get('secure_url')

        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            INSERT INTO ads (ad_title, placement, target_url, image_url)
            VALUES (%s, %s, %s, %s) RETURNING id;
        """
        cur.execute(query, (ad_title, placement, target_url, image_url))
        new_id = cur.fetchone()[0]

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Ad campaign started",
            "id": new_id,
            "image_url": image_url
        }), 201

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 AD UPLOAD ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/ads/<int:ad_id>', methods=['PUT'])
def update_ad(ad_id):
    conn = None
    cur = None
    try:
        ad_title = request.form.get('adTitle', '').strip()
        placement = request.form.get('placement', '').strip()
        target_url = request.form.get('targetUrl', '').strip()

        image_file = request.files.get('image')
        new_image_url = None
        if image_file and image_file.filename != '':
            upload_result = cloudinary.uploader.upload(image_file)
            new_image_url = upload_result.get('secure_url')

        conn = get_db_connection()
        cur = conn.cursor()

        if new_image_url:
            query = """
                UPDATE ads
                SET ad_title = %s, placement = %s, target_url = %s, image_url = %s
                WHERE id = %s
                RETURNING id;
            """
            cur.execute(query, (ad_title, placement, target_url, new_image_url, ad_id))
        else:
            query = """
                UPDATE ads
                SET ad_title = %s, placement = %s, target_url = %s
                WHERE id = %s
                RETURNING id;
            """
            cur.execute(query, (ad_title, placement, target_url, ad_id))

        updated = cur.fetchone()
        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Ad not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Ad updated",
            "id": updated[0],
            "image_url": new_image_url
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 AD UPDATE ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()


@shop_bp.route('/api/ads/<int:ad_id>', methods=['DELETE'])
def delete_ad(ad_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM ads WHERE id = %s RETURNING id;", (ad_id,))
        deleted = cur.fetchone()

        if deleted is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Ad not found"}), 404

        conn.commit()
        return jsonify({"success": True, "message": "Ad deleted", "id": deleted[0]}), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 AD DELETE ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()

@shop_bp.route('/api/ads/<int:ad_id>/stop-sharing', methods=['PATCH'])
def stop_sharing_ad(ad_id):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE ads SET is_active = FALSE WHERE id = %s RETURNING id, is_active;",
            (ad_id,)
        )
        updated = cur.fetchone()

        if updated is None:
            conn.rollback()
            return jsonify({"success": False, "error": "Ad not found"}), 404

        conn.commit()
        return jsonify({
            "success": True,
            "message": "Ad is no longer shared",
            "id": updated[0],
            "is_active": updated[1]
        }), 200

    except Exception as e:
        print("\n" + "=" * 50)
        print("🔥 AD STOP-SHARING ERROR:")
        print(traceback.format_exc())
        print("=" * 50 + "\n")
        if conn:
            conn.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    finally:
        if cur: cur.close()
        if conn: conn.close()