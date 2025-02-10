import React, { useState } from "react";
import { Pagination } from "antd";

const CustomPagination = ({ totalItems, pageSizeOptions, defaultPageSize, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handleChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    onPageChange(page, size);
  };

  return (
    <div className="flex justify-end items-center mt-4">
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        pageSizeOptions={pageSizeOptions}
        showSizeChanger
        showQuickJumper
        onChange={handleChange}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      />
    </div>
  );
};

export default CustomPagination;
