import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { allBlogs } from "../store/atoms/user";
import { getAllBlogs } from "../service/apiFetchBlogs";

export const useBlogs = () => {
  const [blogs, setBlogs] = useRecoilState(allBlogs);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  const fetchAllBlogs = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      await getAllBlogs(setBlogs); // Fetch blogs and update Recoil state
    } catch (err) {
      setError(err as any) // Set error if something goes wrong
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []); // Run once on mount

  // Return the blogs, loading, and error states
  return { blogs, loading, error };
};
