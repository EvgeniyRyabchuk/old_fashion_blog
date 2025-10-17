// This acts as your "enum" for common-nav application routes
const PATHS = {
    // Public Routes
    HOME: '/',
    ABOUT: '/about',
    POSTS: '/posts',
    POST: (postId) => `/posts/${postId}`,

    POSTS_BY_TAG: (tagId) => `/posts?tags=${tagId}`,
    // Session Routes
    LOGIN: '/login',
    SIGN_UP: '/sign-up',
    
    // Status Routes
    STATUSES_NOT_AUTHORIZED: '/statuses/not_authorized',
    STATUSES_SERVER_ERROR: '/statuses/server_error',
    STATUSES_MAINTENANCE: '/statuses/maintenance',
    STATUSES_COMING_SOON: '/statuses/coming_soon',
    STATUSES_FORBIDDEN: '/statuses/forbidden',
    STATUSES_NOT_FOUND: '/statuses/not_found',
    
    // common-nav Auth Routes
    SETTING: '/setting',
    
    // User Routes
    FAVORITES: '/favorites',
    
    // Admin Routes
    ADMIN_POSTS: '/admin/posts',

    // Dynamic Routes (use a function for consistency)
    // USER_PROFILE: (userId) => `/users/${userId}`,
};

export default PATHS;