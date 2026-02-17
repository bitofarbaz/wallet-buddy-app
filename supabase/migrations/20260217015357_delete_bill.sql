CREATE POLICY "Users can delete bill shares"
	ON bill_shares FOR DELETE
	TO authenticated
	USING (
		EXISTS (
			SELECT 1 FROM bills
				WHERE bills.id = bill_id AND
				bills.participant_ids @> ARRAY[auth.uid()]
		)
	);

CREATE POLICY "Users can delete bills"
	ON bills FOR DELETE
	TO authenticated
	USING (
		participant_ids @> ARRAY[auth.uid()]
	);