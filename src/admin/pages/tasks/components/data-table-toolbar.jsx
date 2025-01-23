import { Cross2Icon } from '@radix-ui/react-icons';
import { Button } from '../../../components/custom/button';
import { Input } from '../../../components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { priorities, statuses } from '../data/data';
import { DataTableFacetedFilter } from './data-table-faceted-filter';

export function DataTableToolbar({ table }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    console.log('Search input value:', searchValue);

    // Check if columns exist before setting filter value
    if (table.getColumn('name')) {
      table.getColumn('name')?.setFilterValue(searchValue);
      console.log('Name column filter set:', searchValue);
    } else {
      console.error("Column 'name' not found.");
    }

    if (table.getColumn('matric')) {
      table.getColumn('matric')?.setFilterValue(searchValue);
      console.log('Matric column filter set:', searchValue);
    } else {
      console.error("Column 'matric' not found.");
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
     
       
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              console.log('Filters reset');
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
