-- Adds cart_json column for structured website cart data on quote requests.
SET NAMES utf8mb4;

ALTER TABLE quote_requests
  ADD COLUMN cart_json TEXT NULL;
