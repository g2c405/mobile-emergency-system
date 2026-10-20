export default function formatDescription(
    description: string | null | undefined
): string {
    const trimmed = description?.trim() ?? "";

    if (!trimmed) {
        return "No description provided.";
    }

    return trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
}