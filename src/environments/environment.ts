export const environment = {
  production: false,
  baseUrl: 'https://lavenderblush-reindeer-325183.hostingersite.com/api',
  mediaUrl:
    'https://lavenderblush-reindeer-325183.hostingersite.com/api/media/',
  /**
   * Blogs module: flip `useDummyData` to false and set paths to match your backend.
   * Endpoints are resolved as `${baseUrl}/${categoriesApiPath}` etc.
   */
  blogs: {
    useDummyData: true,
    categoriesApiPath: 'blog-categories',
    postsApiPath: 'blog-posts',
  },
};
