export const environment = {
  production: false,
  baseUrl: 'https://lavenderblush-reindeer-325183.hostingersite.com/api',
  mediaUrl:
    'https://lavenderblush-reindeer-325183.hostingersite.com/api/media/',
  /**
   * Blogs module — `baseUrl` already ends with `/api`.
   * Categories (Postman): POST/GET `categories`, POST `categories/:id` update, DELETE `categories/:id`,
   * POST `categories/actions/bulk-delete` { ids }, GET `categories/actions/export`.
   * FormData keys: name_en, name_ar, image, type (slug e.g. earth, air).
   */
  blogs: {
    useDummyData: true,
    /** When false, categories use the API; when omitted, follows `useDummyData`. */
    useDummyCategories: false,
    categoriesApiPath: 'categories',
    postsApiPath: 'blog-posts',
  },
};
