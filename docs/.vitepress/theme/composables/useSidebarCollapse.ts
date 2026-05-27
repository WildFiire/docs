export function useSidebarCollapse() {
  function toggleCollapse() {
    const isCollapsed = document.documentElement.classList.contains('sidebar-collapsed')
    if (isCollapsed) {
      document.documentElement.classList.remove('sidebar-collapsed')
      localStorage.setItem('wf-sidebar-collapsed', 'false')
    } else {
      document.documentElement.classList.add('sidebar-collapsed')
      localStorage.setItem('wf-sidebar-collapsed', 'true')
    }
  }

  function isCollapsed(): boolean {
    return document.documentElement.classList.contains('sidebar-collapsed')
  }

  return { toggleCollapse, isCollapsed }
}
