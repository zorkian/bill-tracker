-- One-time import of bill data (March 2026)
-- Run with: wrangler d1 execute tracker-db --local --file=src/db/import-bills.sql

-- =====================
-- RECENTLY PASSED
-- =====================

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'IN', 'HB 1408',
  'Indiana minor social media restrictions',
  'Signed Into Law',
  'Signed by the governor on 4 March 2026',
  NULL,
  'Does not apply to Dreamwidth (does not meet the definitions)',
  'Requires sites that meet the definitions to identify Indiana residents under 16, track their time spent on the site, obtain parental consent for account creation, and allow parents full access to the user''s account.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'SC', 'HB 3431',
  'South Carolina minor social media restrictions',
  'Signed Into Law',
  'Signed by the governor on 5 February 2026. Netchoice has sued: Netchoice v. Wilson, 3:26-cv-00543, (D.S.C.)',
  NULL,
  'Dreamwidth is covered by the act (we think)',
  'Netchoice has sued: Netchoice v. Wilson, 3:26-cv-00543, (D.S.C.).'
);

-- =====================
-- STILL IN LEGISLATIVE PROCESS
-- =====================

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'AK', 'SB 262',
  'Alaska minor account ban',
  'Introduced',
  'Introduced; highly unlikely to pass',
  '2026-05-21',
  'Does not apply to Dreamwidth in its current form',
  'Requires covered sites to completely prevent anyone under 16 from creating an account and terminate the accounts of all existing under-16 users.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'AZ', 'HB 2991',
  'Arizona age verification and minor restrictions',
  'Passed One Chamber',
  'Passed House and sent to Senate on 5 March 2026; likely to pass',
  '2026-04-25',
  'Probably does not apply to Dreamwidth (definition is conjunctive and DW does not meet all criteria)',
  'Requires covered sites to age-verify all users, terminate accounts of users under 14, require parental consent for 14-15 year olds, and prevent access to material "harmful to minors" for under-18 accounts. "Harmful to minors" definition explicitly calls out "homosexuality" as inherently "sexual conduct".'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'AZ', 'SB 1747',
  'Arizona age verification and minor restrictions (companion)',
  'Introduced',
  'Companion to HB 2991',
  '2026-04-25',
  'Probably does not apply to Dreamwidth (definition is conjunctive and DW does not meet all criteria)',
  'Companion bill to HB 2991. Same provisions: age verification, account termination for under-14, parental consent for 14-15, restrict "harmful to minors" material.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'CA', 'AB 1709',
  'California minimum age for social media',
  'Introduced',
  'Very bare-bones placeholder form; from the usual gang of California tech-law legislators; Newsom backs it',
  '2026-08-31',
  'Not enough information to determine if it would apply to Dreamwidth',
  'Currently just a placeholder stating intent to establish a minimum age requirement to open or maintain a social media account. Still plenty of time in the session for it to develop.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'CT', 'HB 5037',
  'Connecticut AADC-based minor protections',
  'Introduced',
  'Partially adapted from model AADC',
  '2026-05-06',
  'Probably does not apply to Dreamwidth, but not 100% certain due to intersecting clause definitions',
  'Requires "commercially reasonable" age determination for under-18, parental consent for many features, non-dismissable warning screen for 30 seconds covering 75% of screen (repeated every 3 hours for 10 seconds at 25%), default 1-hour daily time limit for under-18, no notifications between 9pm-8am without parental approval.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'GA', 'SB 495',
  'Georgia AADC-based provisions',
  'Introduced',
  'Deeply unlikely to advance before session ends; adapted from model AADC',
  '2026-04-06',
  NULL,
  'Adapted from the model AADC. Short timeline remaining and not under active consideration.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'GA', 'SB 343',
  'Georgia age verification and minor ban',
  'Introduced',
  'Unlikely to advance',
  '2026-04-06',
  NULL,
  'Mandates age verification, bans social media use by users under 14, requires parental consent for users between 14 and 18.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'HI', 'SB 2761',
  'Hawaii minor social media ban',
  'Introduced',
  'Moderately likely to pass',
  '2026-05-07',
  'Would likely apply to Dreamwidth; would cause DW to block under-18 registration from Hawaii',
  'Prohibits all users under 16 from having accounts on any "social media" service, with an extremely broad definition covering any website accepting user-generated content displayed publicly. Does not mandate age verification; self-attested age is sufficient.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'ID', 'HB 542',
  'Idaho AADC-based minor protections',
  'Passed One Chamber',
  'Passed House, sent to Senate; moderately likely to pass; adapted from model AADC',
  '2026-04-10',
  'Does not apply to Dreamwidth in its current form',
  'Requires age estimation (not verification), DOB collection on registration with parental consent for under-16, most restrictive privacy defaults for under-16, parental control over time limits, and account termination on parental request.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'KS', 'SB 499',
  'Kansas AADC-based provisions',
  'Introduced',
  'Almost certainly dead; never had a committee hearing, though committee is exempt from adjournment cutoff',
  '2026-04-10',
  NULL,
  'AADC-based provisions. Legislature adjourned for non-exempt bills on 27 March, but this bill''s committee is exempt. Still, never had a committee hearing.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'KY', 'HB 227',
  'Kentucky minor protections (contradictory provisions)',
  'Introduced',
  'Getting high-priority attention; moderately likely to pass',
  '2026-04-15',
  'Applicability to Dreamwidth depends on how contradictions are resolved',
  'Badly written with contradictory requirements (sometimes under-13, sometimes under-16, sometimes under-18). Best reading: age estimation (not verification), COPPA-style parental consent for under-13, parental account termination for under-18, possibly time limits for 13-18.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'KY', 'HB 633',
  'Kentucky minor protections (less active)',
  'Introduced',
  'Getting much less action than HB 227',
  '2026-04-15',
  NULL,
  'Typical AADC-style provisions. Less active than companion bill HB 227.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'MA', 'S30',
  'Massachusetts algorithmic feed and notification restrictions',
  'Introduced',
  'Outlook hazy; dependent on Governor''s upcoming legislation',
  '2026-07-31',
  'Does not apply to Dreamwidth in its current form',
  'Abridged version of model AADC requiring age verification of all users, banning algorithmic feeds and notifications between midnight and 6AM for users under 18. Companion to H4229.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'MA', 'H4229',
  'Massachusetts algorithmic feed and notification restrictions (companion)',
  'Introduced',
  'Companion to S30; outlook hazy',
  '2026-07-31',
  'Does not apply to Dreamwidth in its current form',
  'Companion bill to S30. Same provisions: age verification, ban algorithmic feeds and midnight-6AM notifications for under-18.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'MI', 'SB 757',
  'Michigan addictive feeds regulation',
  'Introduced',
  'Less likely to pass than SB 758, but may pass both in hopes 757 survives when 758 gets enjoined',
  '2026-12-31',
  'Does not apply to Dreamwidth in its current form',
  'Regulates "addictive feeds" for under-18: sites can only offer an "addictive feed" if they have actual knowledge user is over 18 or verified parental consent. No notifications about addictive feeds between 10pm-6am year-round and 8am-4pm weekdays during school year.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'MI', 'SB 758',
  'Michigan comprehensive AADC-plus provisions',
  'Introduced',
  'Moderately likely to pass',
  '2026-12-31',
  'Would apply to Dreamwidth; would cause DW to block under-18 registration from Michigan',
  'Model AADC gone further: privacy tools/defaults for minors, prohibit adult-minor contact unless connected, hide minor connection lists from adults, no notifications 10pm-6am and 8am-4pm school weekdays, no "dark patterns" (vaguely defined), no personalized feeds for minors, time tracking, parental settings control, mandatory annual third-party audits with public reports. SB 759 companion makes violations an unfair trade practice.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'MO', 'HB 3393',
  'Missouri age verification and minor restrictions',
  'Introduced',
  'Chance of passage unknown',
  '2026-05-30',
  'Possibly applies to Dreamwidth due to undefined "algorithmically curated feed" term; passage would likely cause DW to block all access from Missouri',
  'Requires age verification of all users including logged-out users, prohibits registration for under-16, parental consent for 16-18, full parental access/control over 16-18 accounts, prohibits "addictive and manipulative design features" (undefined) targeting minors.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NE', 'LB 1119',
  'Nebraska AADC-based minor protections',
  'Introduced',
  NULL,
  '2026-04-17',
  'Probably does not apply to Dreamwidth (requires actual knowledge that 2%+ of users are minors)',
  'Based on model AADC. Requires easy account deletion for under-18, no targeted advertising to under-18, no notifications 10pm-6am and 8am-4pm school weekdays. Explicitly does not mandate age verification. Only applies to services with actual knowledge that 2%+ of users are minors.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NE', 'LB 838',
  'Nebraska AADC-based provisions (amended)',
  'Introduced',
  'Amendment with provisions similar to LB 1119 passed 6 March 2026; sneaky end-run amendment likely increases chance of passing',
  '2026-04-17',
  'Probably does not apply to Dreamwidth in its current form',
  'Similar provisions to LB 1119 added via amendment on 6 March 2026, plus privacy tools for minors and parental control requirements. Amendment was attached to unrelated popular legislation to increase passage chances.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NH', 'HB 1650',
  'New Hampshire AADC-based minor protections',
  'Introduced',
  'Chances of passage are low',
  '2026-06-30',
  'Would likely apply to Dreamwidth; would cause DW to block under-18 registration from NH',
  'Adapted from model AADC. Privacy tools with maximum privacy defaults for under-18, including not showing minors'' posts to adults or allowing adult interaction with minors'' posts. Duty of care to prevent "emotional distress, compulsive use, or discrimination" (defined by AG regulations). No notifications midnight-6am for under-18.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NJ', 'AB 4015',
  'New Jersey comprehensive AADC provisions',
  'Introduced',
  'Most likely to pass of all NJ bills',
  '2028-01-11',
  'Would probably apply to Dreamwidth (requires "actual knowledge" that 98% of users are adults, meaning OpenID accounts would count as minors); passage would cause DW to block all NJ access',
  'Based on model AADC. Privacy tools/defaults for minors, prohibit adult-minor contact unless connected, hide minor connections from adults, no notifications 10pm-6am and 8am-4pm school weekdays, no "dark patterns" (vaguely defined), time tracking for minors, mandatory annual third-party audits with public reports. Companion to SB 3413.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NJ', 'SB 3413',
  'New Jersey comprehensive AADC provisions (companion)',
  'Introduced',
  'Companion to AB 4015',
  '2028-01-11',
  'Same applicability as AB 4015',
  'Companion bill to AB 4015. Same provisions.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NJ', 'AB 4013',
  'New Jersey problematic behavior monitoring',
  'Introduced',
  'Slightly less likely to pass than AB 4015/SB 3413',
  '2028-01-11',
  'Would apply to Dreamwidth; passage would cause DW to block all NJ access',
  'Requires time-tracking and proactive monitoring of ALL users for "problematic behaviors" (3+ hours/day, accessing within 10 minutes of waking, 10+ posts/day). State-mandated warnings: 25% screen on first login (10 sec), non-dismissable 75% screen after 3 hours (90 sec, repeating hourly). Must inform users of "problematic behavior" with state-approved resources. State-mandated disclaimer under every ad. Companion to SB 3412.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NJ', 'SB 3412',
  'New Jersey problematic behavior monitoring (companion)',
  'Introduced',
  'Companion to AB 4013',
  '2028-01-11',
  'Same applicability as AB 4013',
  'Companion bill to AB 4013. Same provisions.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'NJ', 'AB 2739',
  'New Jersey eating disorder prevention',
  'Introduced',
  'Least likely to pass of NJ bills; passed last session but governor pocket-vetoed (governor has changed)',
  '2028-01-11',
  'Does not apply to Dreamwidth in its current form',
  'Prevents covered sites from using designs/algorithms that could cause child users to develop eating disorders including promoting diet products. Requires quarterly internal and annual external audits. Nearly invalidates itself by precluding liability for content the site didn''t post. No data anonymization provisions for third-party audits. No scientific consensus exists on what causes eating disorders in children.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'OK', 'SB 1871',
  'Oklahoma comprehensive social media restrictions',
  'Introduced',
  'Extremely unlikely to pass',
  '2026-05-30',
  'Would likely apply to Dreamwidth, but extremely unlikely to pass',
  'Requires disabling logged-out viewing, freezing all Oklahoma accounts, mandatory age verification via state ID, usual privacy settings/defaults for under-18, disable "engagement prolonging" features for under-18, disable accounts at parental request, parental access to settings, minors cannot change privacy settings without parental consent.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'PA', 'HB 1430',
  'Pennsylvania comprehensive minor protections',
  'Introduced',
  'Languishing in committee for nearly a year; probably dead',
  '2026-11-30',
  NULL,
  'Comprehensive bill covering many social media moral panic theories. Has been languishing in committee with no sign of movement. Still technically active.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'RI', 'SB 2406',
  'Rhode Island data protection and duty of care',
  'Introduced',
  'Not likely to pass',
  '2026-06-30',
  'Would likely apply to Dreamwidth; would cause DW to block under-18 registration from RI',
  'Requires data protection impact assessments provided to AG on demand, privacy tools with maximum privacy defaults for under-18. Creates duty of care for preventing certain harms to under-18. Explicitly does not mandate age verification but includes self-attested and imputed age data.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'SC', 'HB 4591',
  'South Carolina HB 3431 revision (in progress)',
  'Introduced',
  'Legislature still making floor amendments as of 6 March 2026',
  '2026-05-07',
  NULL,
  'Duplicates much of already-enacted HB 3431 with some different provisions. Legislature still amending. May be an attempt to pass something new and repeal the one they''re being sued over.'
);

INSERT OR IGNORE INTO bills (state, bill_number, title, status_simple, status_detail, session_end_date, social_media_definition, notes)
VALUES (
  'SC', 'HB 5209',
  'South Carolina HB 3431 revision (alternate)',
  'Introduced',
  'Probably dead',
  '2026-05-07',
  NULL,
  'Duplicates much of already-enacted HB 3431 with some different provisions. Probably dead.'
);

-- =====================
-- CATEGORY ASSIGNMENTS
-- =====================
-- Categories are assigned by bill_id, so we use subqueries to look up IDs

-- Indiana HB 1408
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='IN' AND b.bill_number='HB 1408' AND c.slug='parental-consent-account-creation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='IN' AND b.bill_number='HB 1408' AND c.slug='parental-access-account-activity';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='IN' AND b.bill_number='HB 1408' AND c.slug='time-tracking-usage-limits';

-- South Carolina HB 3431
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='SC' AND b.bill_number='HB 3431' AND c.slug='age-verification';

-- Alaska SB 262
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AK' AND b.bill_number='SB 262' AND c.slug='minimum-age-ban';

-- Arizona HB 2991
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AZ' AND b.bill_number='HB 2991' AND c.slug='age-verification';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AZ' AND b.bill_number='HB 2991' AND c.slug='minimum-age-ban';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AZ' AND b.bill_number='HB 2991' AND c.slug='parental-consent-account-creation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AZ' AND b.bill_number='HB 2991' AND c.slug='content-specific-restrictions';

-- Arizona SB 1747
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AZ' AND b.bill_number='SB 1747' AND c.slug='age-verification';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AZ' AND b.bill_number='SB 1747' AND c.slug='minimum-age-ban';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='AZ' AND b.bill_number='SB 1747' AND c.slug='parental-consent-account-creation';

-- California AB 1709
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CA' AND b.bill_number='AB 1709' AND c.slug='minimum-age-ban';

-- Connecticut HB 5037
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CT' AND b.bill_number='HB 5037' AND c.slug='age-estimation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CT' AND b.bill_number='HB 5037' AND c.slug='parental-consent-account-creation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CT' AND b.bill_number='HB 5037' AND c.slug='parental-access-account-activity';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CT' AND b.bill_number='HB 5037' AND c.slug='parental-control-settings';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CT' AND b.bill_number='HB 5037' AND c.slug='notification-time-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CT' AND b.bill_number='HB 5037' AND c.slug='time-tracking-usage-limits';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='CT' AND b.bill_number='HB 5037' AND c.slug='state-mandated-warning-displays';

-- Georgia SB 495
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='GA' AND b.bill_number='SB 495' AND c.slug='data-protection-impact-assessments';

-- Georgia SB 343
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='GA' AND b.bill_number='SB 343' AND c.slug='age-verification';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='GA' AND b.bill_number='SB 343' AND c.slug='minimum-age-ban';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='GA' AND b.bill_number='SB 343' AND c.slug='parental-consent-account-creation';

-- Hawaii SB 2761
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='HI' AND b.bill_number='SB 2761' AND c.slug='minimum-age-ban';

-- Idaho HB 542
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='ID' AND b.bill_number='HB 542' AND c.slug='age-estimation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='ID' AND b.bill_number='HB 542' AND c.slug='parental-consent-account-creation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='ID' AND b.bill_number='HB 542' AND c.slug='default-restrictive-privacy-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='ID' AND b.bill_number='HB 542' AND c.slug='parental-control-settings';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='ID' AND b.bill_number='HB 542' AND c.slug='account-termination-parental-request';

-- Kansas SB 499
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='KS' AND b.bill_number='SB 499' AND c.slug='data-protection-impact-assessments';

-- Kentucky HB 227
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='KY' AND b.bill_number='HB 227' AND c.slug='age-estimation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='KY' AND b.bill_number='HB 227' AND c.slug='parental-consent-account-creation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='KY' AND b.bill_number='HB 227' AND c.slug='account-termination-parental-request';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='KY' AND b.bill_number='HB 227' AND c.slug='time-tracking-usage-limits';

-- Kentucky HB 633
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='KY' AND b.bill_number='HB 633' AND c.slug='data-protection-impact-assessments';

-- Massachusetts S30
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MA' AND b.bill_number='S30' AND c.slug='age-verification';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MA' AND b.bill_number='S30' AND c.slug='restrict-algorithmic-personalized-feeds';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MA' AND b.bill_number='S30' AND c.slug='notification-time-restrictions';

-- Massachusetts H4229
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MA' AND b.bill_number='H4229' AND c.slug='age-verification';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MA' AND b.bill_number='H4229' AND c.slug='restrict-algorithmic-personalized-feeds';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MA' AND b.bill_number='H4229' AND c.slug='notification-time-restrictions';

-- Michigan SB 757
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 757' AND c.slug='restrict-algorithmic-personalized-feeds';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 757' AND c.slug='notification-time-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 757' AND c.slug='parental-consent-account-creation';

-- Michigan SB 758
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='default-restrictive-privacy-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='block-adult-minor-contact';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='notification-time-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='school-hours-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='prohibit-dark-patterns';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='restrict-algorithmic-personalized-feeds';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='time-tracking-usage-limits';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='parental-control-settings';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MI' AND b.bill_number='SB 758' AND c.slug='mandatory-third-party-audits';

-- Missouri HB 3393
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MO' AND b.bill_number='HB 3393' AND c.slug='age-verification';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MO' AND b.bill_number='HB 3393' AND c.slug='minimum-age-ban';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MO' AND b.bill_number='HB 3393' AND c.slug='parental-consent-account-creation';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MO' AND b.bill_number='HB 3393' AND c.slug='parental-access-account-activity';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MO' AND b.bill_number='HB 3393' AND c.slug='parental-control-settings';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='MO' AND b.bill_number='HB 3393' AND c.slug='prohibit-addictive-design-features';

-- Nebraska LB 1119
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 1119' AND c.slug='easy-account-deletion-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 1119' AND c.slug='restrict-targeted-advertising-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 1119' AND c.slug='notification-time-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 1119' AND c.slug='school-hours-restrictions';

-- Nebraska LB 838
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 838' AND c.slug='easy-account-deletion-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 838' AND c.slug='restrict-targeted-advertising-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 838' AND c.slug='notification-time-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NE' AND b.bill_number='LB 838' AND c.slug='parental-control-settings';

-- New Hampshire HB 1650
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NH' AND b.bill_number='HB 1650' AND c.slug='default-restrictive-privacy-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NH' AND b.bill_number='HB 1650' AND c.slug='block-adult-minor-contact';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NH' AND b.bill_number='HB 1650' AND c.slug='duty-of-care-provisions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NH' AND b.bill_number='HB 1650' AND c.slug='notification-time-restrictions';

-- New Jersey AB 4015
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4015' AND c.slug='default-restrictive-privacy-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4015' AND c.slug='block-adult-minor-contact';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4015' AND c.slug='notification-time-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4015' AND c.slug='school-hours-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4015' AND c.slug='prohibit-dark-patterns';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4015' AND c.slug='time-tracking-usage-limits';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4015' AND c.slug='mandatory-third-party-audits';

-- New Jersey SB 3413
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='SB 3413' AND c.slug='default-restrictive-privacy-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='SB 3413' AND c.slug='block-adult-minor-contact';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='SB 3413' AND c.slug='notification-time-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='SB 3413' AND c.slug='mandatory-third-party-audits';

-- New Jersey AB 4013
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4013' AND c.slug='time-tracking-usage-limits';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4013' AND c.slug='state-mandated-warning-displays';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 4013' AND c.slug='prohibit-addictive-design-features';

-- New Jersey SB 3412
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='SB 3412' AND c.slug='time-tracking-usage-limits';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='SB 3412' AND c.slug='state-mandated-warning-displays';

-- New Jersey AB 2739
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 2739' AND c.slug='content-specific-restrictions';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='NJ' AND b.bill_number='AB 2739' AND c.slug='mandatory-third-party-audits';

-- Oklahoma SB 1871
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='OK' AND b.bill_number='SB 1871' AND c.slug='age-verification';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='OK' AND b.bill_number='SB 1871' AND c.slug='disable-logged-out-viewing';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='OK' AND b.bill_number='SB 1871' AND c.slug='default-restrictive-privacy-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='OK' AND b.bill_number='SB 1871' AND c.slug='parental-control-settings';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='OK' AND b.bill_number='SB 1871' AND c.slug='account-termination-parental-request';

-- Pennsylvania HB 1430
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='PA' AND b.bill_number='HB 1430' AND c.slug='data-protection-impact-assessments';

-- Rhode Island SB 2406
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='RI' AND b.bill_number='SB 2406' AND c.slug='data-protection-impact-assessments';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='RI' AND b.bill_number='SB 2406' AND c.slug='default-restrictive-privacy-minors';
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='RI' AND b.bill_number='SB 2406' AND c.slug='duty-of-care-provisions';

-- South Carolina HB 4591
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='SC' AND b.bill_number='HB 4591' AND c.slug='age-verification';

-- South Carolina HB 5209
INSERT OR IGNORE INTO bill_categories (bill_id, category_id) SELECT b.id, c.id FROM bills b, categories c WHERE b.state='SC' AND b.bill_number='HB 5209' AND c.slug='age-verification';
