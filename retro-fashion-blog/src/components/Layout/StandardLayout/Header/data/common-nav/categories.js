import PATHS from "@/constants/paths";

import maleImg from '@assets/images/categories/male.png';
import femaleImg from '@assets/images/categories/female.png';
import classicImg from '@assets/images/categories/classic.png';
import newsImg from '@assets/images/categories/news.png';

export default [
    {
        id: 1,
        name: "Male",
        link: `${PATHS.POSTS}?categories=7GGsEDG6hxJke8vh6PFa`,
        dataI18n: "nav-male",
        imgUrl: maleImg
    },
    {
        id: 2,
        name: "Female",
        link:  `${PATHS.POSTS}?categories=JlEtKUSmnLqoTtsDkDMQ`,
        dataI18n: "nav-female",
        imgUrl: femaleImg
    },
    {
        id: 3,
        name: "Classic",
        link:  `${PATHS.POSTS}?categories=JlEtKUSmnLqoTtsDkDMQ`,
        dataI18n: "nav-classic",
        imgUrl: classicImg
    },
    {
        id: 4,
        name: "News",
        link:  `${PATHS.POSTS}?categories=JlEtKUSmnLqoTtsDkDMQ`,
        dataI18n: "nav-news",
        imgUrl: newsImg
    }
]