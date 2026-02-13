CREATE TABLE categories (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	icon varchar(255) NOT NULL,
	label varchar(255) NOT NULL,
	created_at timestamp WITH TIME ZONE DEFAULT NOW()
);
INSERT INTO categories (id, icon, label) VALUES
	('a1b1c1d1-1111-4444-a1a1-111111111111', '🛒', 'Groceries'),
	('a2b2c2d2-2222-4444-b2b2-222222222222', '🛍️', 'Shopping'),
	('a3b3c3d3-3333-4444-c3c3-333333333333', '🍕', 'Dining Out'),
	('a4b4c4d4-4444-4444-d4d4-444444444444', '🏠', 'Rent & Housing'),
	('a5b5c5d5-5555-4444-e5e5-555555555555', '💡', 'Utilities'),
	('a6b6c6d6-6666-4444-f6f6-666666666666', '🚗', 'Transport'),
	('a7b7c7d7-7777-4444-a7a7-777777777777', '🏥', 'Health'),
	('a8b8c8d8-8888-4444-b8b8-888888888888', '🎬', 'Entertainment'),
	('a9b9c9d9-9999-4444-c9c9-999999999999', '🎁', 'Gifts'),
	('b1a1b1a1-1010-4444-d1d1-101010101010', '✈️', 'Travel'),
	('b2a2b2a2-2020-4444-e2e2-202020202020', '💰', 'Investments'),
	('b3a3b3a3-3030-4444-f3f3-303030303030', '🎲', 'Misc'),
	('b4a4b4a4-4040-4444-a4a4-404040404040', '🛡️', 'Insurance'),
	('b5a5b5a5-5050-4444-b5b5-505050505050', '🏦', 'Loan Repayments');

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see categories"
	ON categories FOR SELECT
	TO authenticated
	USING ( true );

CREATE TYPE payment_status AS ENUM ('unpaid', 'paid');
CREATE TYPE split_type AS ENUM ('equally', 'shares', 'exact_amount');

CREATE TABLE bills (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	title varchar(255) NOT NULL,
	category_id uuid REFERENCES categories(id) NOT NULL,
	payment_status payment_status NOT NULl,
	invoiced_at timestamp WITH TIME ZONE NOT NULL,
	amount_total decimal NOT NULL,
	split_type split_type NOT NULL,
	due_at timestamp WITH TIME ZONE, -- if it's unpaid
	paid_by_id uuid REFERENCES profiles(id), -- if it's paid
	
	created_at timestamp WITH TIME ZONE DEFAULT NOW(),
	created_by_id uuid REFERENCES profiles(id) NOT NULL
);

CREATE TABLE bill_shares (
	bill_id uuid REFERENCES bills(id),
	user_id uuid REFERENCES profiles(id),

	share_value decimal NOT NULL,

	PRIMARY KEY (bill_id, user_id)
);

ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create bills"
	ON bills FOR INSERT
	TO authenticated
	WITH CHECK ( auth.uid() = created_by_id );

CREATE POLICY "Users can view bills they're a part of"
	ON bills FOR SELECT
	TO authenticated
	USING ( 
		auth.uid() = bills.created_by_id OR 
		EXISTS ( 
			SELECT 1 FROM bill_shares WHERE bill_shares.bill_id = bills.id AND bill_shares.user_id = auth.uid() 
		) 
	);

CREATE POLICY "Users can create shares for bills they're a part of"
	ON bill_shares FOR INSERT
	TO authenticated
	WITH CHECK (
		EXISTS ( SELECT 1 FROM bills WHERE bills.created_by_id = auth.uid() ) OR
		EXISTS ( SELECT 1 FROM bill_shares AS bs WHERE bs.bill_id = bill_shares.bill_id AND bs.user_id = auth.uid() )
	);

CREATE POLICY "Users can view shares for bills they're a part of"
	ON bill_shares FOR SELECT
	TO authenticated
	USING (
		EXISTS ( SELECT 1 FROM bills WHERE bills.created_by_id = auth.uid() ) OR
		EXISTS ( SELECT 1 FROM bill_shares AS bs WHERE bs.bill_id = bill_shares.bill_id AND bs.user_id = auth.uid() )
	);