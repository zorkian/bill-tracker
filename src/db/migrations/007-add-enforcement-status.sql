ALTER TABLE bills ADD COLUMN enforcement_status TEXT;

-- Migrate existing lawsuit statuses to the new model
UPDATE bills SET enforcement_status = 'Enjoined', status_simple = 'Signed Into Law' WHERE status_simple = 'Lawsuit Filed, Temporarily Enjoined';
UPDATE bills SET enforcement_status = 'In Effect', status_simple = 'Signed Into Law' WHERE status_simple = 'Lawsuit Filed, Law in Effect';
UPDATE bills SET enforcement_status = 'Ruled Unconstitutional', status_simple = 'Signed Into Law' WHERE status_simple = 'Law Ruled Unconstitutional';
