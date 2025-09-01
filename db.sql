-- An Example of what the Supabase Database Schema should look like along with a few functions

CREATE TABLE cohost_conversations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    chats JSON NOT NULL
);

CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()), -- currently just called "time"
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) -- doesn't exist yet
);

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL,
    subscription_id VARCHAR(255),
    customer_id VARCHAR(255),
    is_complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) -- doesn't exist yet
);


CREATE OR REPLACE FUNCTION get_listing_from_request_id(request_id TEXT, user_id_ UUID)
RETURNS TABLE (
	id UUID,
	user_id UUID,
	data JSONB,
	url TEXT,
	created_at TIMESTAMP
) AS $$
#variable_conflict use_column
BEGIN
	RETURN QUERY SELECT l.id, l.user_id, l."data", l.url, l."created_at"
	FROM listings as l
	WHERE l.data->'requestMetadata'->>'id' = request_id AND l.user_id = user_id_;
END;
$$ LANGUAGE PLPGSQL;

SELECT get_listing_from_request_id('df6e5ce3-2af5-4507-98fd-40f479b74f23', 'b645db74-4585-436e-a1e0-bb2d0c70076d');
