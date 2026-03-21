-- Seed the Sidebar Menus for Media Library

-- 1. Create Media Group
INSERT INTO core_groups (id, name_ar, name_en, icon, sort_order) VALUES
('g_media_lib', 'مكتبة الوسائط', 'Media Library', 'image', 30)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Media Root Page
INSERT INTO core_pages (id, group_id, name_ar, name_en, path, icon, sort_order) VALUES
('p_media_root', 'g_media_lib', 'نظرة عامة', 'Overview', '/dashboard/media', 'grid', 10),
('p_media_images', 'g_media_lib', 'الصور', 'Images', '/dashboard/media/images', 'image', 20),
('p_media_videos', 'g_media_lib', 'الفيديوهات', 'Videos', '/dashboard/media/videos', 'video', 30),
('p_media_docs', 'g_media_lib', 'المستندات', 'Documents', '/dashboard/media/documents', 'file-text', 40),
('p_media_folders', 'g_media_lib', 'مجلدات الوسائط', 'Folders', '/dashboard/media/folders', 'folder', 50)
ON CONFLICT (id) DO NOTHING;

-- 3. Grant Permissions to roles (super-admin, admin, content-editor)
INSERT INTO role_permissions (role_id, page_id, can_create, can_read, can_update, can_delete)
SELECT 
    r.id, 
    p.id, 
    true, true, true, true
FROM roles r
CROSS JOIN core_pages p
WHERE r.id IN ('super-admin', 'admin', 'content-editor')
AND p.id IN ('p_media_root', 'p_media_images', 'p_media_videos', 'p_media_docs', 'p_media_folders')
ON CONFLICT (role_id, page_id) DO UPDATE SET
    can_create = true,
    can_read = true,
    can_update = true,
    can_delete = true;
