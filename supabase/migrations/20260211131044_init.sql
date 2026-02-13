CREATE TABLE IF NOT EXISTS profiles (
	id uuid REFERENCES auth.users PRIMARY KEY,
	name varchar(255) NOT NULL,
	email varchar(255),
	created_at timestamp WITH TIME ZONE default now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profile"
	ON profiles FOR SELECT
	TO authenticated
	USING ( true );

CREATE POLICY "Users can create their own profile"
	ON profiles FOR INSERT
	TO authenticated
	WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can edit/update their own profile"
	ON profiles FOR UPDATE
	TO authenticated
	USING ( auth.uid() = id )
	WITH CHECK ( auth.uid() = id );