"use client";
import { useGetContentQuery } from '../../../redux/subjectsApi';
import { useGetStudentsQuery } from '../../../redux/studentsApi';
import React, { useState } from 'react';
import { DataTable } from '../../components/data-table';
import { contentColumns } from './_components/contentColumns';
import SidebarFilters from './_components/sidebar-filters';
import { Input } from '../../components/ui/input'; // Assuming this is the correct path

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
  const [appliedFilters, setAppliedFilters] = useState({ name: '', matric: '' });

  if (isLoadingContent || isLoadingStudents) return <div>Loading...</div>;
  if (contentError || studentsError) return <div>Error loading content</div>;

  // Create a map of students for reference
  const studentsMap = (studentsData || []).reduce((acc, student) => {
    acc[student.matric] = student.name;
    return acc;
  }, {});

  // Add serial numbers and student names to content data
  let dataWithSerialNumbers = (contentData || []).map((item, index) => ({
    ...item,
    sn: index + 1,
    studentName: studentsMap[item.matric] || 'Admin',
  }));

  // Apply search filters
  if (appliedFilters.name) {
    dataWithSerialNumbers = dataWithSerialNumbers.filter((item) =>
      item.name.toLowerCase().includes(appliedFilters.name.toLowerCase().trim())
    );
  }
  if (appliedFilters.matric) {
    dataWithSerialNumbers = dataWithSerialNumbers.filter((item) =>
      item.matric.toLowerCase().includes(appliedFilters.matric.toLowerCase().trim())
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
    setAppliedFilters({ name: '', matric: '' });
  };

  return (
    <div className="container mx-auto py-10 ml-8 flex flex-col">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Content Table</h2>
        <div className="flex space-x-4">
       
      
        </div>
      </div>

      <div className="flex">
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
        <Input
            type="text"
            placeholder="Search by name..."
            value={appliedFilters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="h-10 w-[200px] lg:w-[250px] rounded-md border border-gray-300 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <DataTable
            columns={contentColumns}
            data={dataWithSerialNumbers}
            onToggleFilterSidebar={handleToggleFilterSidebar}
          />
        </div>
      </div>
    </div>
  );
}
