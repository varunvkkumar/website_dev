from flask import Flask, request, jsonify
import random  # Import the random module

app = Flask(__name__)

# Logic to decide on showing a coupon
@app.route('/coupon-decision', methods=['POST'])
def coupon_decision():
    data = request.get_json()
    click_count = data.get('clickCount', 0)
    user_email = data.get('userEmail', 'default@user.com')
    tracking_id = data.get('trackingId', '')

    # Show a coupon if it's a "women-related" link
    if 'women' in tracking_id.lower():  # Make sure the comparison is case-insensitive
        should_show_coupon = True
        print(f'Women-related link detected: {tracking_id}, setting should_show_coupon to True')  # Debug print
    else:
        # Original logic: Show a coupon randomly if click_count is a multiple of 5
        should_show_coupon = random.choice([True, False]) if click_count % 5 == 0 else False
        print(f'Non-women link: {tracking_id}, random decision: {should_show_coupon}')  # Debug print

    print(f'Received tracking ID: {tracking_id}, Decision to show coupon: {should_show_coupon}')  # Debug print

    return jsonify({'shouldShowCoupon': should_show_coupon})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)





