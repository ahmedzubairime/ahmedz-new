const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*, cover_image:media!portfolio_projects_cover_image_id_fkey(bucket, storage_path)')
        .order('sort_order', { ascending: false });
    
    console.log("Error:", error);
    console.log("Data:", JSON.stringify(data, null, 2));
}

run();
