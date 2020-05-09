export function escapeMarkdown(str: string): string {

	str.replace("`", "");
	str.replace("*", "");
	str.replace("_", "");

	return str;
}