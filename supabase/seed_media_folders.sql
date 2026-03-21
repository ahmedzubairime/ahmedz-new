-- =====================================================
-- Media Folders Seed Data
-- Creates a comprehensive folder hierarchy for the 
-- entire app across all 3 storage buckets
-- =====================================================

-- Helper: Use a CTE-based approach for parent-child insertions
-- We use fixed UUIDs so we can reference parents

-- ==================== IMAGES BUCKET ====================

-- Root folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a0000000-0000-0000-0000-000000000001', NULL, 'accounts', now()),
('a0000000-0000-0000-0000-000000000002', NULL, 'posts', now()),
('a0000000-0000-0000-0000-000000000003', NULL, 'products', now()),
('a0000000-0000-0000-0000-000000000004', NULL, 'categories', now()),
('a0000000-0000-0000-0000-000000000005', NULL, 'services', now()),
('a0000000-0000-0000-0000-000000000006', NULL, 'homepage', now()),
('a0000000-0000-0000-0000-000000000007', NULL, 'about', now()),
('a0000000-0000-0000-0000-000000000008', NULL, 'contact', now()),
('a0000000-0000-0000-0000-000000000009', NULL, 'projects', now()),
('a0000000-0000-0000-0000-00000000000a', NULL, 'pages', now()),
('a0000000-0000-0000-0000-00000000000b', NULL, 'brands', now()),
('a0000000-0000-0000-0000-00000000000c', NULL, 'general', now()),
('a0000000-0000-0000-0000-00000000000d', NULL, 'offers', now()),
('a0000000-0000-0000-0000-00000000000e', NULL, 'orders', now());

-- accounts/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'avatars', now());

-- posts/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a2000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'covers', now()),
('a2000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'content', now()),
('a2000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'newsletter', now());

-- products/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a3000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'gallery', now()),
('a3000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'thumbnails', now()),
('a3000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'variants', now()),
('a3000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'reviews', now());

-- services/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a5000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'icons', now()),
('a5000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'covers', now());

-- homepage/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a6000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006', 'hero', now()),
('a6000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000006', 'features', now()),
('a6000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', 'testimonials', now()),
('a6000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000006', 'partners', now()),
('a6000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', 'carousel', now());

-- about/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a7000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', 'team', now()),
('a7000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000007', 'company', now()),
('a7000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000007', 'mission-vision', now());

-- contact/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a8000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000008', 'branches', now()),
('a8000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000008', 'social-media', now());

-- projects/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('a9000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009', 'covers', now()),
('a9000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000009', 'tasks', now()),
('a9000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000009', 'members', now()),
('a9000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000009', 'branches', now());

-- brands/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('ab000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-00000000000b', 'logos', now()),
('ab000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-00000000000b', 'identity', now()),
('ab000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-00000000000b', 'favicons', now());

-- offers/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('ad000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-00000000000d', 'banners', now()),
('ad000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-00000000000d', 'campaigns', now());

-- orders/ sub-folders
INSERT INTO media_folders (id, parent_id, name, created_at) VALUES
('ae000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-00000000000e', 'receipts', now());

-- ==========================================
-- Add bucket_type column to media_folders 
-- so each folder knows which bucket it belongs to
-- ==========================================

-- We'll track this via an UPDATE after insert
-- Default assumption: most folders are for images

-- Mark video-specific folders: none needed at root level
-- since videos uses the same folder names but different bucket
-- The media table already has a `bucket` column

-- Total: 14 root folders + ~30 sub-folders = ~44 folders
