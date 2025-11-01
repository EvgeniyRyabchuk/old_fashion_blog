import PATHS from "@/constants/paths";
import categories from "./categories";

export default [
  {
    name: "Home",
    link: PATHS.HOME,
    dataI18n: "nav-home"
  },
  {
    name: "All posts",
    link: PATHS.POSTS,
    dataI18n: "nav-common-nav-posts",
    // data: categories
  },
  {
    name: "Contact",
    link: PATHS.ABOUT,
    dataI18n: "nav-contact"
  },
  {
    name: "About",
    link: PATHS.ABOUT,
    dataI18n: "nav-about"
  }

]