import { useEffect, useState } from "react";
import { getSubcategories } from "@/app/apis/subcategories.api";
import { Subcategory } from "@/types/subcategories";

export function useSubcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSubcategories()
      .then((data) => {
        setSubcategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { subcategories, loading, error };
}
