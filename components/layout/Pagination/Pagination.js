import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { NftContext } from "../../../context/NftContext";

const Pagination = () => {
  const {
    showPagination,
    startIndex,
    setStartIndex,
    endIndex,
    setEndIndex,
    currentPageIndex,
    setCurrentPageIndex,
  } = useContext(NftContext);

  const decreasePageSize = () => {
    if (currentPageIndex - 1 >= 0) {
      setStartIndex(startIndex - 8);
      setEndIndex(endIndex - 8);
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const increasePageSize = () => {
    setStartIndex(startIndex + 8);
    setEndIndex(endIndex + 8);
    setCurrentPageIndex(currentPageIndex + 1);
  };

  return (
    <div
      className={`text-white ${
        !showPagination ? "hidden" : "flex"
      } flex items-center justify-center py-6`}
    >
      <button
        className={`bg-zinc-800 w-24 py-2 rounded active:bg-violet-700 ${
          currentPageIndex - 1 == 0 && "pointer-events-none"
        }`}
        onClick={decreasePageSize}
      >
        Previous
      </button>
      <p className="px-5 mx-6 py-2 rounded-lg current_index_number">
        {currentPageIndex <= 0 ? 1 : currentPageIndex}
      </p>
      <button
        className="bg-zinc-800 w-24 py-2 rounded active:bg-violet-700"
        onClick={increasePageSize}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
