from flask import Flask, request, jsonify

app = Flask(__name__)

# Dummy logic to decide if a coupon should be shown
@app.route('/coupon-decision', methods=['POST'])
def coupon_decision():
    data = request.get_json()
    click_count = data.get('clickCount', 0)
    tracking_id = data.get('trackingId', '')
    user_email = data.get('userEmail', 'default@user.com')

    print(f'Received request: clickCount={click_count}, trackingId={tracking_id}, userEmail={user_email}')  # Debug log

    # Show coupon if trackingId contains 'women'
    should_show_coupon = 'women' in tracking_id
    print(f'Decision to show coupon: {should_show_coupon}')  # Debug log

    return jsonify({'shouldShowCoupon': should_show_coupon})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)






