import BannerSlider from "@/components/banner/Banner";
import ChooseSection from "@/components/choose/ChooseSection";
import PropertyLocationList from "@/components/PropertyLocationList";
import SearchContainer from "@/components/search/searchContainer/SearchContainer";
import { getAllBanners } from "@/services/banners";
import { getAllChoose } from "@/services/choose";
import Testimonial from "@/components/testimonial/Testimonial"
import { fetchBlogsService } from "@/components/blog/fetchblog";
import { BlogSection } from "@/components/blog/BlogSection";
import SisterConcernPage from "./sister-concern/page";


const HomePage = async () => {
  const [
    { data: banners },
    { data: chooses },
    { blogs },

  ] = await Promise.all([
    getAllBanners(),
    getAllChoose(),
    fetchBlogsService(1, 4),
  ]);

  return (
    <div>

      <div className="relative ">
        <BannerSlider banners={banners} />

        <div className="max-w-7xl md:w-5xl w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-4">
          <SearchContainer />
        </div>
      </div>

      <div className=" mt-10 md:mt-20 ">
        <div>
          <PropertyLocationList />
        </div>
        <ChooseSection chooses={chooses} />
      </div>

      <div>
        <Testimonial />
      </div>
      <div className="py-4">
        <BlogSection blogs={blogs} />
      </div>
      <div >
        <SisterConcernPage />
      </div>




    </div>
  );
};

export default HomePage;
