export const PAGE_LOADING = '@@common/@page/LOADING';
export const PAGE_LOADED = '@@common/@page/loaded';

export const setPageLoading = (loading) => ({
  type: loading ? PAGE_LOADING : PAGE_LOADED,
});
