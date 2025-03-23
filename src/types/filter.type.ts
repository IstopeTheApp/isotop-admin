export type FilterUser = {
    is_verified: { name: string, code: boolean }[] | null;
    type: { name: string, code: boolean }[] | null;
    gender: { name: string, code: string }[] | null;
    status: { name: string, code: string }[] | null;
}

export type FilterValue = {
    name: string, code: string | boolean
}[] | [] | null