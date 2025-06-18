import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-800">Đã có lỗi xảy ra</h3>
      <p className="text-gray-500 mt-2 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        Thử lại
      </button>
    </div>
  );
}

export default ErrorState;