"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- ORDER STATUSES ---
export async function getOrderStatuses() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_order_statuses")
        .select("*")
        .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
}

export async function saveOrderStatus(payload: any, id?: string) {
    const supabase = await createClient();
    const table = supabase.from("store_order_statuses");

    if (id) {
        const { error } = await table.update(payload).eq("id", id);
        if (error) throw new Error(error.message);
    } else {
        const { error } = await table.insert(payload);
        if (error) throw new Error(error.message);
    }
    revalidatePath("/dashboard/orders/statuses");
    revalidatePath("/dashboard/orders");
}

export async function deleteOrderStatus(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_order_statuses").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/orders/statuses");
}

// --- ORDERS ---
export async function getOrders() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_orders")
        .select("*, status:store_order_statuses!status_id(name_ar, name_en, color, icon)")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function getOrderById(id: string) {
    const supabase = await createClient();
    const [orderRes, itemsRes] = await Promise.all([
        supabase.from("store_orders").select("*, status:store_order_statuses!status_id(*)").eq("id", id).single(),
        supabase.from("store_order_items").select("*").eq("order_id", id)
    ]);
    if (orderRes.error) throw new Error(orderRes.error.message);
    if (itemsRes.error) throw new Error(itemsRes.error.message);
    return { ...orderRes.data, items: itemsRes.data };
}

export async function updateOrderStatus(orderId: string, statusId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_orders").update({ status_id: statusId, updated_at: new Date().toISOString() }).eq("id", orderId);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/orders/tracking");
}

export async function updateOrderTracking(orderId: string, tracking_number: string, tracking_url: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("store_orders").update({ tracking_number, tracking_url, updated_at: new Date().toISOString() }).eq("id", orderId);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/orders/tracking");
}

// --- RETURNS ---
export async function getReturns() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("store_order_returns")
        .select("*, order:store_orders!order_id(order_number, customer_name, grand_total)")
        .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
}

export async function updateReturnStatus(id: string, status: string, admin_notes?: string, refund_amount?: number) {
    const supabase = await createClient();
    const payload: any = { status, updated_at: new Date().toISOString() };
    if (admin_notes) payload.admin_notes = admin_notes;
    if (refund_amount !== undefined) payload.refund_amount = refund_amount;

    const { error } = await supabase.from("store_order_returns").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/orders/returns");
}
