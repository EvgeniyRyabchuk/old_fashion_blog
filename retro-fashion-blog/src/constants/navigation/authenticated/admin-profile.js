import PATHS from "@/constants/paths";

export default [
  {
    name: "Messages",
    link: PATHS.ADMIN_MESSAGES,
    dataI18n: "profile-nav-messages"
  },
  {
    name: "Post Editor / Table",
    link: PATHS.ADMIN_POSTS,
    dataI18n: "profile-nav-post-editor"
  },
  {
    name: "Comments",
    link: PATHS.ADMIN_COMMENTS, // Using the same path as settings since there's no specific comments path
    dataI18n: "profile-nav-comments"
  }
]