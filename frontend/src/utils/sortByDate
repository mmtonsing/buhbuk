export function sortByDateCreated(arr, order = "desc") {
  if (!Array.isArray(arr)) return [];

  const sorted = [...arr].sort((a, b) => {
    const dateA = new Date(a.dateCreated);
    const dateB = new Date(b.dateCreated);
    return order === "asc" ? dateA - dateB : dateB - dateA;
  });

  return sorted;
}
