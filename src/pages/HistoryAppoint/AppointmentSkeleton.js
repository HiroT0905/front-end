import React from 'react';

const SkeletonElement = ({ className }) => <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;

function AppointmentSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-5 md:p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <SkeletonElement className="h-6 w-48" />
          <SkeletonElement className="h-4 w-32" />
        </div>
        <SkeletonElement className="h-6 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-3">
          <SkeletonElement className="w-10 h-10 rounded-full" />
          <SkeletonElement className="h-4 flex-1" />
        </div>
        <div className="flex items-center space-x-3">
          <SkeletonElement className="w-10 h-10 rounded-full" />
          <SkeletonElement className="h-4 flex-1" />
        </div>
        <div className="flex items-center space-x-3">
          <SkeletonElement className="w-10 h-10 rounded-full" />
          <SkeletonElement className="h-4 flex-1" />
        </div>
        <div className="flex items-center space-x-3">
          <SkeletonElement className="w-10 h-10 rounded-full" />
          <SkeletonElement className="h-4 flex-1" />
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <SkeletonElement className="h-9 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export default AppointmentSkeleton;