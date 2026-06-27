/**
 * BRUTALIST CHROME — Widgets Module
 * Initializes all widget interactions and drag-to-reorder.
 */

export const Widgets = {
  init() {
    this._initResizeObserver();
    this._initWidgetCollapse();
  },

  _initResizeObserver() {
    // Re-flow layout on window resize
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        '--vh', `${window.innerHeight * 0.01}px`
      );
    });
    observer.observe(document.body);
  },

  _initWidgetCollapse() {
    // Double-click widget header to collapse
    document.querySelectorAll('.widget-header').forEach(header => {
      header.style.cursor = 'pointer';
      header.addEventListener('dblclick', () => {
        const widget = header.closest('.widget');
        const children = [...widget.children].filter(c => c !== header);
        const collapsed = widget.dataset.collapsed === 'true';
        children.forEach(c => c.style.display = collapsed ? '' : 'none');
        widget.dataset.collapsed = (!collapsed).toString();
      });
    });
  },
};
