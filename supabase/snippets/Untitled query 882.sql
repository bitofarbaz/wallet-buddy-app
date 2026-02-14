-- enable explain
alter role authenticator
set pgrst.db_plan_enabled to 'true';
-- reload the config
notify pgrst, 'reload config';


-- categoryId: a2b2c2d2-2222-4444-b2b2-222222222222
-- userId: f8299f9b-dede-4e3c-9ff9-ce145bfe89c8

DO $$
DECLARE
    user_id uuid := 'f8299f9b-dede-4e3c-9ff9-ce145bfe89c8'; -- REPLACE WITH YOUR ACTUAL UUID
    i int;
BEGIN
    FOR i IN 1..1000 LOOP
        INSERT INTO bills (
            title, 
            amount_total, 
            category_id, 
            created_by_id, 
            split_method, 
            participant_ids, 
            payment_status,
            invoiced_at
        )
        VALUES (
            'Test Bill ' || i,
            (random() * 100)::decimal,
            'a2b2c2d2-2222-4444-b2b2-222222222222', -- REPLACE WITH A VALID CATEGORY UUID
            user_id,
            'equally',
            -- 10% chance to include you in the array, otherwise a random UUID
            CASE WHEN random() < 0.1 THEN ARRAY[user_id] ELSE ARRAY[gen_random_uuid()] END,
            'paid',
            now()
        );
    END LOOP;
END $$;