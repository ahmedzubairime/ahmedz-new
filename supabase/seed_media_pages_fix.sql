-- Fix Sidebar Navigation for Media Library using correct table names

-- The group 'dashboard.content-management' already exists in page_groups.
-- We just need to ensure the pages are mapped to this group, and permissions are granted.

-- 1. Insert Media Pages
INSERT INTO pages (id, group_id, section_id, parent_id, name_ar, name_en, path, icon, sort_order) VALUES
('dashboard.media', 'dashboard.content-management', 'dashboard', NULL, 'نظرة عامة الوسائط', 'Media Overview', '/dashboard/media', 'grid', 50),
('dashboard.media-images', 'dashboard.content-management', 'dashboard', 'dashboard.media', 'الصور', 'Images', '/dashboard/media/images', 'image', 10),
('dashboard.media-videos', 'dashboard.content-management', 'dashboard', 'dashboard.media', 'الفيديوهات', 'Videos', '/dashboard/media/videos', 'video', 20),
('dashboard.media-documents', 'dashboard.content-management', 'dashboard', 'dashboard.media', 'المستندات', 'Documents', '/dashboard/media/documents', 'file-text', 30),
('dashboard.media-folders', 'dashboard.content-management', 'dashboard', 'dashboard.media', 'مجلدات الوسائط', 'Folders', '/dashboard/media/folders', 'folder', 40)
ON CONFLICT (id) DO UPDATE SET 
    group_id = EXCLUDED.group_id,
    parent_id = EXCLUDED.parent_id,
    name_ar = EXCLUDED.name_ar,
    name_en = EXCLUDED.name_en,
    path = EXCLUDED.path,
    icon = EXCLUDED.icon;

-- 2. Grant Permissions to roles for these pages
INSERT INTO role_page_permissions (role_id, page_id, can_create, can_read, can_update, can_delete)
SELECT 
    r.id, 
    p.id, 
    true, true, true, true
FROM roles r
CROSS JOIN pages p
WHERE r.id IN ('super-admin', 'admin', 'content-editor')
AND p.id IN ('dashboard.media', 'dashboard.media-images', 'dashboard.media-videos', 'dashboard.media-documents', 'dashboard.media-folders')
ON CONFLICT (role_id, page_id) DO UPDATE SET
    can_create = true,
    can_read = true,
    can_update = true,
    can_delete = true;
