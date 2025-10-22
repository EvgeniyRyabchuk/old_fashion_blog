
import './index.scss';
import Breadcrumb from "../../components/Breadcrumb";
import Billboard from "../../components/Billboard";
import LastPosts from "@pages/Home/LastPosts";
import PostHistory from "@pages/Home/PostHistory";
import MostPopularTags from "@pages/Home/MostPopularTags";


const Home = () => {

    return (
        <>
            {/*<Breadcrumb/>*/}

            {/*to prevent padding collapse*/}


            <Billboard/>

            <LastPosts/>

            <MostPopularTags />

            <PostHistory />
        </>
    );
};

export default Home;