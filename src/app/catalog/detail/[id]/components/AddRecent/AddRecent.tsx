"use client";
import { useEffect } from "react";
import { recentAdapter } from "@/stores/recent/adapter";

type Props = {
  product_id: number;
};

export const AddRecent = (props: Props) => {
  useEffect(() => {
    recentAdapter.add(props.product_id);
  }, [props.product_id]);
  return null;
};
