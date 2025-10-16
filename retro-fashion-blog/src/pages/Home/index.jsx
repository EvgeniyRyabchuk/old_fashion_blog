
import './index.scss';
import Breadcrumb from "../../components/Breadcrumb";
import Billboard from "../../components/Billboard";
import LastPosts from "@pages/Home/LastPosts";
import PostHistory from "@pages/Home/PostHistory";
import MostPopularTags from "@pages/Home/MostPopularTags";

const Invisible = () => (<div style={{visibility: "hidden"}}>dsf</div>)

const Home = () => {

    return (
        <>
            <Breadcrumb/>

            {/*to prevent padding collapse*/}
            <Invisible />

            <Billboard/>

            <LastPosts/>

            <MostPopularTags />

            <PostHistory />
        </>
    );
};

export default Home;