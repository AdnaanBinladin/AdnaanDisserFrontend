-- Sample data for testing

-- Insert admin user
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@foodshare.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u', 'System Administrator', 'admin');

-- Insert sample donor
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('donor@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u', 'John Doe', '+1234567890', 'donor');

-- Insert sample NGO user
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('ngo@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.Gm.F5u', 'Jane Smith', '+1234567891', 'ngo');

-- Insert sample organization
INSERT INTO organizations (user_id, name, description, address, city, state, zip_code, verification_status)
SELECT 
    id,
    'Community Food Bank',
    'Helping families in need with food assistance',
    '123 Main Street',
    'New York',
    'NY',
    '10001',
    'approved'
FROM users WHERE email = 'ngo@example.com';

-- Insert sample food donations
INSERT INTO food_donations (donor_id, title, description, category, quantity, unit, expiry_date, pickup_address, pickup_city, pickup_state, pickup_zip, urgency)
SELECT 
    id,
    'Fresh Apples',
    'Organic apples from local farm',
    'fruits',
    50,
    'lbs',
    CURRENT_DATE + INTERVAL '3 days',
    '456 Farm Road',
    'New York',
    'NY',
    '10002',
    'medium'
FROM users WHERE email = 'donor@example.com';

INSERT INTO food_donations (donor_id, title, description, category, quantity, unit, expiry_date, pickup_address, pickup_city, pickup_state, pickup_zip, urgency)
SELECT 
    id,
    'Bread Loaves',
    'Fresh bread from bakery',
    'grains',
    20,
    'loaves',
    CURRENT_DATE + INTERVAL '1 day',
    '789 Bakery Street',
    'New York',
    'NY',
    '10003',
    'high'
FROM users WHERE email = 'donor@example.com';
