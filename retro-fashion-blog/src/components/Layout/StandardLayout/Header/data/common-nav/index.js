import PATHS from "@/constants/paths";

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
    data: [
      {
        name: "Male",
        link: `${PATHS.POSTS}?categories=7GGsEDG6hxJke8vh6PFa`,
        dataI18n: "nav-male"
      },
      {
        name: "Female",
        link:  `${PATHS.POSTS}?categories=JlEtKUSmnLqoTtsDkDMQ`,
        dataI18n: "nav-female"
      }
    ]
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