INSERT OR IGNORE INTO categories (name, slug, sort_order) VALUES
  ('Age Verification (Gov''t ID)', 'age-verification', 1),
  ('Age Estimation (non-ID)', 'age-estimation', 2),
  ('Minimum Age Ban', 'minimum-age-ban', 3),
  ('Parental Consent for Account Creation', 'parental-consent-account-creation', 4),
  ('Parental Access to Account/Activity', 'parental-access-account-activity', 5),
  ('Parental Control over Settings', 'parental-control-settings', 6),
  ('Account Termination on Parental Request', 'account-termination-parental-request', 7),
  ('Default Restrictive Privacy for Minors', 'default-restrictive-privacy-minors', 8),
  ('Block Adult-Minor Contact', 'block-adult-minor-contact', 9),
  ('Notification Time Restrictions', 'notification-time-restrictions', 10),
  ('School-Hours Restrictions', 'school-hours-restrictions', 11),
  ('Restrict Algorithmic/Personalized Feeds', 'restrict-algorithmic-personalized-feeds', 12),
  ('Time Tracking / Usage Limits', 'time-tracking-usage-limits', 13),
  ('State-Mandated Warning Displays', 'state-mandated-warning-displays', 14),
  ('Prohibit "Dark Patterns"', 'prohibit-dark-patterns', 15),
  ('Prohibit "Addictive Design Features"', 'prohibit-addictive-design-features', 16),
  ('Restrict Targeted Advertising to Minors', 'restrict-targeted-advertising-minors', 17),
  ('Easy Account Deletion for Minors', 'easy-account-deletion-minors', 18),
  ('Data Protection Impact Assessments', 'data-protection-impact-assessments', 19),
  ('Mandatory Third-Party Audits', 'mandatory-third-party-audits', 20),
  ('Duty of Care Provisions', 'duty-of-care-provisions', 21),
  ('Content-Specific Restrictions', 'content-specific-restrictions', 22),
  ('Disable Logged-Out Viewing', 'disable-logged-out-viewing', 23);

INSERT OR IGNORE INTO users (username, password_hash, role) VALUES
  ('admin', '$2b$10$wZ22x7OrecQi.wMFfwax0.8n97Wrg7CB/VgF6CZctqggRDNpJ.qkG', 'admin');
