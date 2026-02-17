begin;

CREATE TABLE IF NOT EXISTS transfers (
	id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
	from_user_id uuid REFERENCES profiles(id) NOT NULL,
	to_user_id uuid REFERENCES profiles(id) NOT NULL,
	amount_total decimal NOT NULL,
	transferred_at timestamp WITH TIME ZONE NOT NULL,

	created_at timestamp WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transfers they're a part of"
	ON transfers FOR SELECT
	TO authenticated
	USING (
		auth.uid() = from_user_id OR
		auth.uid() = to_user_id
	);

CREATE POLICY "Users can create transfers"
	ON transfers FOR INSERT
	TO authenticated
	WITH CHECK (
		auth.uid() = from_user_id OR
		auth.uid() = to_user_id
	);

commit;