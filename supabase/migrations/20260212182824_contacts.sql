ALTER TABLE profiles
	DROP CONSTRAINT IF EXISTS profiles_id_fkey,
	ALTER COLUMN id SET DEFAULT gen_random_uuid(),
	ADD parent_profile_id uuid REFERENCES profiles(id);

CREATE POLICY "Users can create contacts for people who're not on the platform"
	ON profiles FOR INSERT
	TO authenticated
	WITH CHECK ( auth.uid() = parent_profile_id );

CREATE TABLE IF NOT EXISTS contacts (
	user_id uuid REFERENCES profiles,
	contact_id uuid REFERENCES profiles,
	created_at timestamp WITH TIME ZONE default now(),

	PRIMARY KEY (user_id, contact_id)
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own contacts"
	ON contacts FOR SELECT
	TO authenticated
	USING ( auth.uid() = user_id OR auth.uid() = contact_id );

CREATE POLICY "Users can create contacts"
	ON contacts FOR INSERT
	TO authenticated
	WITH CHECK ( auth.uid() = user_id );