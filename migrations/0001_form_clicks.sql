-- Totals of clicks on the official-form buttons (Form 6 and Form 8).
CREATE TABLE form_clicks (
  form TEXT PRIMARY KEY,
  total INTEGER NOT NULL DEFAULT 0
);
INSERT INTO form_clicks (form, total) VALUES ('form6', 0), ('form8', 0);

-- One row per visitor, form and day, so repeat clicks are not counted twice.
-- `id` is a salted SHA-256 hash; raw IP addresses are never stored.
-- Rows older than yesterday are deleted on each write.
CREATE TABLE seen_today (
  id TEXT PRIMARY KEY,
  day TEXT NOT NULL
);
CREATE INDEX seen_today_day ON seen_today (day);
