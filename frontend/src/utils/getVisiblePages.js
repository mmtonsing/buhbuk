export function getVisiblePages(pages, user) {
  return pages.filter((page) => {
    if (page.requiresAuth && !user) return false;
    return true;
  });
}
