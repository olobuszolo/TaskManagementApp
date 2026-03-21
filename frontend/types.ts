export type event = {
    id: number;
    title: string;
    description: string | null;
    scheduled_for: string;
    creator_id: number;
    category_id: number | null;
    status: string;
    group_id: number | null;
}