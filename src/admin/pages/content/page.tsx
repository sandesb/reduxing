"use client";
import { useGetContentQuery } from '../../../redux/subjectsApi';
import { useGetStudentsQuery } from '../../../redux/studentsApi';
import React, { useState } from 'react';
import { DataTable } from '../../components/data-table';
import { contentColumns } from './_components/contentColumns';
import SidebarFilters from './_components/sidebar-filters';
export type Content = {
  content_id: string;
  name: string;
  matric: string;
};

// ContentTable Component
export default function ContentTable({ subject_id, matric }) {
  const { data: contentData, error: contentError, isLoading: isLoadingContent } = useGetContentQuery({ subject_id, matric });
  const { data: studentsData, isLoading: isLoadingStudents, error: studentsError } = useGetStudentsQuery();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ name: '', studentName: '' });

  if (isLoadingContent || isLoadingStudents) return <div>Loading...</div>;
  if (contentError || studentsError) return <div>Error loading content</div>;

  const studentsMap = (studentsData || []).reduce((acc, student) => {
    acc[student.matric] = student.name;
    return acc;
  }, {});

  let dataWithSerialNumbers = (contentData || []).map((item, index) => ({
    ...item,
    sn: index + 1,
    studentName: studentsMap[item.matric] || 'Admin',
  }));

  // Apply filters to data
  if (appliedFilters.name) {
    dataWithSerialNumbers = dataWithSerialNumbers.filter((item) =>
      item.name.toLowerCase().includes(appliedFilters.name.toLowerCase().trim())
    );
  }
  if (appliedFilters.studentName) {
    dataWithSerialNumbers = dataWithSerialNumbers.filter((item) =>
      item.studentName.toLowerCase().includes(appliedFilters.studentName.toLowerCase().trim())
    );
  }

  const handleToggleFilterSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleFilterChange = (filterType, value) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  const handleResetFilters = () => {
    setAppliedFilters({ name: '', studentName: '' });
  };

  return (
    <div className="container mx-auto py-10 flex">
      {/* Sidebar Filters */}
      {isSidebarVisible && (
        <div className="w-1/4 p-4 bg-gray-100">
          <SidebarFilters
            filterOptions={{
              name: [...new Set(dataWithSerialNumbers.map((item) => item.name))],
              studentName: [...new Set(dataWithSerialNumbers.map((item) => item.studentName))],
            }}
            appliedFilters={appliedFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>
      )}

      {/* DataTable Section */}
      <div className={`flex-1 ${isSidebarVisible ? 'ml-4' : ''}`}>
        <DataTable
          columns={contentColumns}
          data={dataWithSerialNumbers} // Handle undefined data if still loading
          onToggleFilterSidebar={handleToggleFilterSidebar}
        />
      </div>
    </div>
  );
}
