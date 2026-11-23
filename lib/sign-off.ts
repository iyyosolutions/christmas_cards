export function signOff(name: string | null | undefined) {
  const trimmed = name?.trim() ?? "";
  if (!trimmed || trimmed.toLowerCase() === "with love") return "Made with love";
  return trimmed;
}
