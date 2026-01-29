export function escapeLikeWildcards(value: string): string {
    return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}
