-- =============================================
-- PHX-AI Complete Database Schema
-- Supabase PostgreSQL Database Setup
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- 1. CORE TABLES
-- =============================================

-- Chat Sessions Table (Simplified)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_title CHECK (length(title) > 0 AND length(title) <= 200)
);

-- Messages Table (Simplified)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_content CHECK (length(content) > 0 AND length(content) <= 50000),
    CONSTRAINT valid_role CHECK (role IN ('user', 'assistant', 'system'))
);

-- User Profiles Table (Simplified)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Constraints
    CONSTRAINT valid_full_name CHECK (length(full_name) <= 100),
    CONSTRAINT valid_avatar_url CHECK (avatar_url IS NULL OR length(avatar_url) <= 500)
);

-- =============================================
-- 2. INDEXES FOR PERFORMANCE
-- =============================================

-- Chat Sessions Indexes
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_updated ON chat_sessions(user_id, updated_at DESC);

-- Messages Indexes
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_session_created ON messages(session_id, created_at);

-- User Profiles Indexes (Simplified)
-- No additional indexes needed for basic functionality

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Chat Sessions Policies
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;
CREATE POLICY "Users can view their own chat sessions" 
    ON chat_sessions FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own chat sessions" ON chat_sessions;
CREATE POLICY "Users can create their own chat sessions" 
    ON chat_sessions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own chat sessions" ON chat_sessions;
CREATE POLICY "Users can update their own chat sessions" 
    ON chat_sessions FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own chat sessions" ON chat_sessions;
CREATE POLICY "Users can delete their own chat sessions" 
    ON chat_sessions FOR DELETE 
    USING (auth.uid() = user_id);

-- Messages Policies
DROP POLICY IF EXISTS "Users can view messages from their sessions" ON messages;
CREATE POLICY "Users can view messages from their sessions" 
    ON messages FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = messages.session_id 
            AND chat_sessions.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create messages in their sessions" ON messages;
CREATE POLICY "Users can create messages in their sessions" 
    ON messages FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = messages.session_id 
            AND chat_sessions.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete messages from their sessions" ON messages;
CREATE POLICY "Users can delete messages from their sessions" 
    ON messages FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = messages.session_id 
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- User Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" 
    ON user_profiles FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" 
    ON user_profiles FOR UPDATE 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" 
    ON user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- =============================================
-- 4. FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update session timestamp (Simplified)
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE chat_sessions 
        SET updated_at = NOW()
        WHERE id = NEW.session_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE chat_sessions 
        SET updated_at = NOW()
        WHERE id = OLD.session_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to detect and prevent duplicate messages (Simplified)
CREATE OR REPLACE FUNCTION prevent_duplicate_messages()
RETURNS TRIGGER AS $$
DECLARE
    recent_duplicate_count INTEGER;
BEGIN
    -- Check for duplicate content in the last 5 minutes
    SELECT COUNT(*) INTO recent_duplicate_count
    FROM messages 
    WHERE session_id = NEW.session_id 
    AND content = NEW.content
    AND role = NEW.role
    AND created_at > NOW() - INTERVAL '5 minutes';
    
    IF recent_duplicate_count > 0 THEN
        -- Prevent insertion of duplicate
        RAISE WARNING 'Duplicate message detected and prevented: %', NEW.content;
        RETURN NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. TRIGGERS
-- =============================================

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at 
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers for message management (Simplified)
DROP TRIGGER IF EXISTS update_session_timestamp_on_insert ON messages;
CREATE TRIGGER update_session_timestamp_on_insert
    AFTER INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION update_session_timestamp();

DROP TRIGGER IF EXISTS update_session_timestamp_on_delete ON messages;
CREATE TRIGGER update_session_timestamp_on_delete
    AFTER DELETE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_session_timestamp();

-- Trigger for duplicate prevention
DROP TRIGGER IF EXISTS prevent_duplicates ON messages;
CREATE TRIGGER prevent_duplicates
    BEFORE INSERT ON messages
    FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_messages();

-- =============================================
-- 6. UTILITY FUNCTIONS
-- =============================================

-- Function to get user's session statistics
CREATE OR REPLACE FUNCTION get_user_session_stats(user_uuid UUID)
RETURNS TABLE (
    total_sessions BIGINT,
    total_messages BIGINT,
    active_sessions BIGINT,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT cs.id) as total_sessions,
        COUNT(m.id) as total_messages,
        COUNT(DISTINCT CASE WHEN cs.updated_at > NOW() - INTERVAL '7 days' THEN cs.id END) as active_sessions,
        MAX(cs.updated_at) as last_activity
    FROM chat_sessions cs
    LEFT JOIN messages m ON cs.id = m.session_id
    WHERE cs.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old messages (optional)
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Clean up messages older than 30 days (optional)
    DELETE FROM messages 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. SAMPLE DATA (Optional)
-- =============================================

-- Insert sample data for testing (uncomment if needed)
/*
-- Sample user profile
INSERT INTO user_profiles (id, full_name, preferences) 
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Test User',
    '{"theme": "light", "language": "id"}'
) ON CONFLICT (id) DO NOTHING;

-- Sample chat session
INSERT INTO chat_sessions (id, user_id, title) 
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'Sample Chat Session'
) ON CONFLICT (id) DO NOTHING;
*/

-- =============================================
-- 8. VERIFICATION QUERIES
-- =============================================

-- Verify tables exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'chat_sessions') THEN
        RAISE EXCEPTION 'chat_sessions table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        RAISE EXCEPTION 'messages table not created';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
        RAISE EXCEPTION 'user_profiles table not created';
    END IF;
    
    RAISE NOTICE 'All tables created successfully!';
END $$;

-- Verify RLS is enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'chat_sessions' AND rowsecurity = true
    ) THEN
        RAISE EXCEPTION 'RLS not enabled on chat_sessions';
    END IF;
    
    RAISE NOTICE 'RLS enabled successfully!';
END $$;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'PHX-AI Database Schema Setup Complete!';
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Tables created: chat_sessions, messages, user_profiles';
    RAISE NOTICE 'Indexes created: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
    RAISE NOTICE 'Policies created: %', (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public');
    RAISE NOTICE 'Functions created: %', (SELECT COUNT(*) FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'));
    RAISE NOTICE '=============================================';
    RAISE NOTICE 'Database is ready for PHX-AI application!';
    RAISE NOTICE '=============================================';
END $$;
