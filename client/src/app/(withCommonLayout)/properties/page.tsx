"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getProperties, PropertiesResponse } from "@/services/properties";
import ShowProperties from "@/components/properties/showProperties";
import ShowSubcategories from "@/components/properties/showSubcategories";
import Filterings from "@/components/properties/filterings";
import Pagination from "@/components/common/Pagination";

const Page = () => {
  const searchParams = useSearchParams();
  const [data, setData] = useState<PropertiesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const params: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Set current page from URL or default to 1
    const pageParam = searchParams.get("page");
    const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
    setCurrentPage(parsedPage);

    // Set limit per page - default to 12 if not specified
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 9;

    // Ensure page and limit are always set in params
    params.page = parsedPage;
    params.limit = limit;

    setIsLoading(true);
    getProperties(params)
      .then((response) => {
        setData(response);
        // Use totalPages directly from API response if available, otherwise calculate
        setTotalPages(
          response.totalPages || Math.ceil(response.total / response.limit) || 1
        );
      })
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  return (
    <>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px;
          max-width: 1600px;
          margin: 0 auto;
          min-height: 100vh;
        }

        .navbar-container {
          margin: 0 -8px;
        }

        .content-wrapper {
          display: flex;
          gap: 24px;
          flex-direction: column;
        }

        .filters-container {
          width: 100%;
        }

        .properties-container {
          flex: 1;
          width: 100%;
        }

        /* Desktop styles */
        @media (min-width: 769px) {
          .content-wrapper {
            flex-direction: row;
          }

          .filters-container {
            flex: 0 0 25%;
            max-width: 320px;
            min-width: 280px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07);
            padding: 24px 18px;
            min-height: 400px;
          }

          .properties-container {
            flex: 1;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 4px 24px 0 rgba(0,0,0,0.07);
            padding: 24px 18px;
          }
        }

        /* Tablet styles */
        @media (min-width: 481px) and (max-width: 768px) {
          .content-wrapper {
            flex-direction: row;
          }

          .filters-container {
            flex: 0 0 30%;
            max-width: 280px;
            min-width: 240px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
            padding: 16px 10px;
            min-height: 300px;
          }

          .properties-container {
            flex: 1;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
            padding: 16px 10px;
          }

          .container {
            padding: 12px;
            gap: 12px;
          }
        }

        /* Mobile styles */
        @media (max-width: 480px) {
          .container {
            padding: 4px;
            gap: 6px;
          }

          .content-wrapper {
            gap: 8px;
          }

          .filters-container {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 1px 6px 0 rgba(0,0,0,0.07);
            padding: 10px 6px;
            margin-bottom: 8px;
            min-height: unset;
          }

          .properties-container {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 1px 6px 0 rgba(0,0,0,0.07);
            padding: 10px 6px;
          }
        }
      `}</style>

      <div className="container">
        {/* Subcategory Navbar */}
        <div className="navbar-container">
          <ShowSubcategories />
        </div>

        <div className="content-wrapper">
          {/* Filters */}
          <div className="filters-container sticky top-20">
            <Filterings />
          </div>

          {/* Properties */}
          <div className="properties-container">
            <ShowProperties
              properties={data?.properties || []}
              isLoading={isLoading}
            />
            {!isLoading && data && (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
