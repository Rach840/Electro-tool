"use client";

import { useState } from "react";
import { Input } from "./input";

export const InputImage = (props: {
  onChange: (url: string) => string;
  productId: string;
}) => {
  const [showError, setShowError] = useState(false);

  return (
    <>
      <Input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.item(0);
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) return setShowError(true);
          else setShowError(false);
          const res = await fetch(`/api/upload-product-image/${props.productId}`, {
            method: "post",
            headers: {
              "Content-Type": file.type,
            },
            body: Buffer.from(await file.arrayBuffer()),
          });
          console.log(res)
          if (res.status != 200) return;

          const obj = await res.json();
          if (!obj.url) return;

          props.onChange(obj.url);
        }}
      />

      <span
        style={{
          color: "red",
          display: showError ? "block" : "none",
        }}
      >
        Размер файла больше допустимого
      </span>
    </>
  );
};
