// import { useRentCategories } from "@/hooks/useRentCategories";
import { useCategories } from "@/hooks/useCategories";
export const useMenuList = () => {
  // const { rentCategories } = useRentCategories();
  const { categories } = useCategories();


  return [

    {
      id: "01",
      title: "About Us",
      link: "/about",
    },
    {
      id: "02",
      title: "Properties",
      link: "#",
      dropdownItems: [
        {
          key: "buy",
          label: "Buy/sell",
          href: "/properties?listingType=sell",
          // style: {
          //   backgroundColor: "#FF6B35",
          //   color: "#fff",
          // },
          children: categories?.map((cat) => ({
            key: cat._id,
            label: cat.name,
            href: `/properties?listingType=sell&category=${cat._id}`,
            image: cat.image,
          })) || [],
        },
        {
          key: "rent",
          label: "Rent",
          href: "/properties?listingType=rent",
          // style: {
          //   backgroundColor: "#FF6B35",
          //   color: "#fff",
          // },
          children: categories?.map((cat) => ({
            key: cat._id,
            label: cat.name,
            href: `/properties?listingType=rent&category=${cat._id}`,
            image: cat.image,
          })) || [],
        },

      ]

    },
    {
      id: "03",
      title: "Home & Car Loan",
      link: "/emi-calculator"
    },
    {
      id: "4",
      title: "NRB Service",
      link: "/nrb-services"
    },
    {
      id: "05",
      title: "Blog",
      link: "/blog",
    },


    {
      id: "06",
      title: "Contact",
      link: "/contact",
    },


  ];
};
