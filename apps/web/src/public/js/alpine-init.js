document.addEventListener("alpine:init", () => {
  window.Alpine.data("searchForm", (initialHasQuery) => ({
    hasQuery: Boolean(initialHasQuery),
    sync(value) {
      this.hasQuery = String(value || "").trim().length > 0;
    }
  }));
});
