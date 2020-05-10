export function escapeMarkdown(str: string): string {

	str = str.replace(/`/g, "",);

	return str;
}