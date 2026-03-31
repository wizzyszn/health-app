import { useSearchParams } from "react-router-dom";
import type { URLSearchParamsInit } from "react-router-dom";

const useUrlSearchParams = (params?: URLSearchParamsInit) => {
  const [searchParams, setSearchParams] = useSearchParams(params);

  const setParams = (param: URLSearchParamsInit) => {
    if (!param || param === "") return;
    setSearchParams(param);
  };

  const updateParam = (key: string, value: string) => {
    if (!key || key === "") return;
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const deleteParam = (key: string) => {
    if (!key || key === "" || !searchParams.has(key)) return;
    searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const checkParam = (key: string): boolean => {
    return searchParams.has(key);
  };

  const getParam = (key: string): string | null => {
    if (!key || key === "") return null;
    return searchParams.get(key);
  };

  const getAllParams = (): Record<string, string> => {
    return Object.fromEntries(searchParams.entries());
  };

  const clearParams = () => {
    setSearchParams({});
  };

  return {
    searchParams,
    setSearchParams,
    setParams,
    updateParam,
    deleteParam,
    checkParam,
    getParam,
    getAllParams,
    clearParams,
  };
};

export default useUrlSearchParams;
