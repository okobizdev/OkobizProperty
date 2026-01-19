import { SearchParams } from "next/dist/server/request/search-params";

export interface ExtractedParams {
  page: number;
  categoryId?: string;
  category?: string;
  location?: string;
  checkinDate?: string;
  checkoutDate?: string;
  bedroomCount?: number;
  bathCount?: number;
  bedCount?: number;
  guestCount?: number;
  status: string;
}

export function extractSearchParams(
  resolvedParams: SearchParams
): ExtractedParams {
  const categoryId = Array.isArray(resolvedParams.category)
    ? resolvedParams.category[0]
    : resolvedParams.category;

  const pageParam = resolvedParams.page;
  const page = parseInt(
    Array.isArray(pageParam) ? pageParam[0] : pageParam || "1",
    10
  );

  return {
    page,
    categoryId,
    category: categoryId !== "all" ? categoryId : undefined,
    location: Array.isArray(resolvedParams.location)
      ? resolvedParams.location[0]
      : resolvedParams.location,
    checkinDate: Array.isArray(resolvedParams.checkinDate)
      ? resolvedParams.checkinDate[0]
      : resolvedParams.checkinDate,
    checkoutDate: Array.isArray(resolvedParams.checkoutDate)
      ? resolvedParams.checkoutDate[0]
      : resolvedParams.checkoutDate,
    bedroomCount: resolvedParams.bedroomCount
      ? Number(resolvedParams.bedroomCount)
      : undefined,
    bathCount: resolvedParams.bathCount
      ? Number(resolvedParams.bathCount)
      : undefined,
    bedCount: resolvedParams.bedCount
      ? Number(resolvedParams.bedCount)
      : undefined,
    guestCount: resolvedParams.guestCount
      ? Number(resolvedParams.guestCount)
      : undefined,
    status: "published",
  };
}
