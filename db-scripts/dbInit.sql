CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS user_table(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL UNIQUE CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    user_password TEXT NOT NULL CHECK (char_length(user_password) >= 8),
    user_birthdate TEXT NOT NULL CHECK (user_birthdate ~ '^\d{2}-\d{2}-\d{4}$'),
    user_zodiac TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()

);

CREATE TABLE IF NOT EXISTS refresh_token_table (
    token_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '2 days'),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_horoscope_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_table(user_id) ON DELETE CASCADE,
  horoscope_date TIMESTAMPTZ DEFAULT now(),
  zodiac_sign  TEXT NOT NULL,
  horoscope TEXT NOT NULL,
  UNIQUE (user_id, horoscope_date),
  created_at TIMESTAMPTZ DEFAULT now() 
)