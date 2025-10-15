import PATHS from "@/constants/paths";

export default [
  {
    name: "Settings",
    link: PATHS.SETTING,
    dataI18n: "nav-home"
  },
  {
    name: "Comments",
    link: PATHS.SETTING, // Using the same path as settings since there's no specific comments path
    dataI18n: "nav-common-nav-posts"
  }
]