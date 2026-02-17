"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import "../globals.css";
import { AgGridReact } from "ag-grid-react";
import { isUserAdmin } from "../../actions/isUserAdmin";
import { useUser } from "@auth0/nextjs-auth0/client";

import {
  CellClassParams,
  CellStyleModule,
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  PaginationModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  TextFilterModule,
  EditableCallbackParams,
  NumberEditorModule,
  ModuleRegistry,
  RowSelectionModule,
  ValidationModule,
  TextEditorModule,
  SelectEditorModule,
  IFilterOptionDef,
  ITextFilterParams,
  SortIndicatorComp,
  ColumnApiModule,
  RowApiModule,
  RenderApiModule,
  ScrollApiModule,
  ExternalFilterModule,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-quartz.css";

import { DTPicker } from "./DTPicker";
import { format, toZonedTime } from "date-fns-tz";
import {
  ArrowPathIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  ClientSideRowModelApiModule,
  PaginationModule,
  CustomFilterModule,
  DateFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  TextFilterModule,
  CellStyleModule,
  ValidationModule,
  SelectEditorModule,
  ColumnApiModule,
  RowApiModule,
  RenderApiModule,
  ScrollApiModule,
  ExternalFilterModule,
]);

import Dialog from "./HistoryPageDialog";
import { dropdownValues } from "src/dropdown-values";
import { dropdownMap } from "src/dropdown-mapping";
import { is, ne } from "drizzle-orm";

export default function HistoryPageGrid() {
  const { user, error, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const adminStatus = await isUserAdmin();
        setIsAdmin(adminStatus);
      }
    }
    checkAdmin();
    console.log(isAdmin);
  }, [user]);

  const [data, setData] = useState<any[]>([]);
  const [rowData, setRowData] = useState<any[]>([]);

  const gridApiRef = useRef<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedRows, setEditedRows] = useState<Record<number, any>>({});
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const nameFilterOptions: IFilterOptionDef[] = dropdownValues.name.map(
    (name) => ({
      displayKey: `is_${name}`,
      displayName: `${name}`,
      predicate: (_, cellValue) => cellValue === name,
      numberOfInputs: 0,
    }),
  );

  const nameFilterParams: ITextFilterParams = {
    defaultOption: "equals",
    filterOptions: ["equals", ...nameFilterOptions],
  };

  const unitFilterOptions: IFilterOptionDef[] = dropdownValues.unit.map(
    (unit) => ({
      displayKey: `is_${unit}`,
      displayName: `${unit}`,
      predicate: (_, cellValue) => cellValue === unit,
      numberOfInputs: 0,
    }),
  );

  const unitFilterParams: ITextFilterParams = {
    defaultOption: "equals",
    filterOptions: ["equals", ...unitFilterOptions],
  };

  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "",
    onConfirm: null,
  });

  function isCellEditable(params: EditableCallbackParams | CellClassParams) {
    return isEditing;
  }

  const handleCellValueChanged = (params) => {
    const rowId = params.data.id;

    setEditedRows((prev) => ({
      ...prev,
      [rowId]: { ...params.data, [params.column.getColId()]: params.newValue },
    }));
  };

  const handleCellNameChanged = (params: any) => {
    if (params.colDef.field === "name") {
      const selectedName = params.newValue;
      const correspondingUnit = dropdownMap[selectedName] || "";

      if (params.data.unit !== correspondingUnit) {
        params.node.setDataValue("unit", correspondingUnit);
      }
    }
  };

  const onSelectionChanged = () => {
    const selectedRows = gridApiRef.current?.getSelectedRows();
    setSelectedRows(selectedRows || []);
  };

  const handleDeleteSelectedRows = () => {
    setDialog({
      isOpen: true,
      title: "Confirm Delete",
      message: "Are you sure you want to delete these entries?",
      type: "warning",
      onConfirm: () => deleteSelectedRows(),
    });
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApiRef.current?.getSelectedRows() || [];
    const selectedRowIds = selectedRows.map((row) => row.id);

    if (selectedRowIds.length > 0) {
      const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");

      try {
        await fetch(`/api/deleteData`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedRowIds, date: date }),
        });

        setRowData((prev) =>
          prev.filter((row) => !selectedRowIds.includes(row.id)),
        );

        setDialog({
          isOpen: true,
          title: "Success",
          message: "The selected entries have been deleted.",
          type: "success",
          onConfirm: null,
        });

        fetchData();
      } catch (error) {
        console.error("Error deleting rows: ", error);
        setDialog({
          isOpen: true,
          title: "Error",
          message: "There was an error in deleting the selected entries.",
          type: "error",
          onConfirm: null,
        });
      }
    } else {
      setDialog({
        isOpen: true,
        title: "Error",
        message: "There were no rows selected for deletion.",
        type: "error",
        onConfirm: null,
      });
    }
  };

  const handleCreateRow = async () => {
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");

    const newRow = {
      id: Date.now(), // Temporary ID, will be replaced by DB
      datetime: date,
      name: "",
      unit: "",
      value: 0,
      isNewRow: true,
    };

    setRowData((prev) => {
      return [newRow, ...prev.map((row) => ({ ...row }))];
    });

    setTimeout(() => {
      gridApiRef.current?.refreshClientSideRowModel("sort");

      setTimeout(() => {
        const displayedRowCount =
          gridApiRef.current?.getDisplayedRowCount() || 0;

        for (let i = 0; i < displayedRowCount; i++) {
          const rowNode = gridApiRef.current?.getDisplayedRowAtIndex(i);
          if (rowNode?.data?.isNewRow) {
            gridApiRef.current?.ensureIndexVisible(i, "top");
            gridApiRef.current?.startEditingCell({
              rowIndex: i,
              colKey: "name",
            });
            break;
          }
        }
      }, 50);
    }, 0);
  };

  const saveChanges = async () => {
    try {
      const editedRowList = Object.values(editedRows);
      const unsavedNewRows = editedRowList.filter((row) => row.isNewRow);
      const rowsToUpdate = editedRowList.filter((row) => !row.isNewRow);
      let error = null;

      if (unsavedNewRows.length > 0) {
        for (let i = 0; i < unsavedNewRows.length; i++) {
          const newRow = unsavedNewRows[i];
          const newRowData = { ...newRow };

          const createResponse = await fetch("/api/createData", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRowData),
          });

          if (!createResponse.ok) {
            error = new Error("Failed to create new rows.");
          } else {
            const result = await createResponse.json();

            setRowData((prev) => [{ ...newRow, id: result.id }, ...prev]);
          }
        }
      }

      if (rowsToUpdate.length > 0) {
        const updateResponse = await fetch("/api/updateData", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates: Object.values(rowsToUpdate) }),
        });

        if (!updateResponse.ok) {
          error = new Error("Failed to update rows in database.");
        }
      }

      if (!error) {
        setDialog({
          isOpen: true,
          title: "Success",
          message: "All changes have been saved.",
          type: "success",
          onConfirm: null,
        });
      } else {
        console.error("Error saving changes: ", error);
        setDialog({
          isOpen: true,
          title: "Error",
          message: "There was an error in saving the changes.",
          type: "error",
          onConfirm: null,
        });
      }

      setEditedRows({});
      fetchData();
    } catch (error) {
      console.error("Error saving changes: ", error);
      setDialog({
        isOpen: true,
        title: "Error",
        message: "There was an error in saving the changes.",
        type: "error",
        onConfirm: null,
      });
    }
  };

  async function fetchData() {
    const response = await fetch("/api/data");
    const result = await response.json();
    setData(result);
    setRowData(
      result.map((item) => ({
        ...item,
        datetime: formatInTimeZone(item.datetime, "UTC", "yyyy-MM-dd HH:mm:ss"),
        value: Number(item.value),
      })),
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleGuideClick = () => {
    setDialog({
      isOpen: true,
      title: "How to Use",
      message: "",
      type: "guide",
      onConfirm: null,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[calc(100vh-100px)] bg-light-orange/30">
      {/* Left Panel: Ag Grid */}
      <div className="w-full lg:w-3/4 flex flex-col">
        <div
          className="ag-theme-quartz w-full shadow-lg rounded-xl overflow-hidden border border-light-orange/20 bg-white"
          style={{ height: "70vh" }}
        >
          <AgGridReact
            rowData={rowData}
            rowSelection={"multiple" as any}
            suppressRowClickSelection={true}
            onSelectionChanged={onSelectionChanged}
            columnDefs={useMemo(() => {
              const gridColumns = [
                {
                  headerName: "",
                  checkboxSelection: true,
                  headerCheckboxSelection: true,
                  width: 50,
                  suppressMenu: true,
                  pinned: "left" as const,
                  editable: false,
                  filter: false,
                },
                {
                  field: "datetime",
                  sortable: true,
                  filter: "agDateColumnFilter",
                  minWidth: 220,
                  filterParams: {
                    defaultOption: "inRange",
                    inRangeInclusive: true,
                    comparator: timestampFilter,
                  },
                },
                {
                  field: "name",
                  filterParams: nameFilterParams,
                  onCellValueChanged: handleCellNameChanged,
                  cellEditor: "agSelectCellEditor",
                  cellEditorParams: {
                    values: dropdownValues.name,
                    valueListGap: 10,
                  },
                  editable: (params) => params.data?.isNewRow && isEditing,
                },
                {
                  field: "unit",
                  filterParams: unitFilterParams,
                  editable: (params) => params.data?.isNewRow && isEditing,
                },
                {
                  field: "value",
                  filter: "agNumberColumnFilter",
                  filterParams: {
                    buttons: ["apply", "clear", "reset"],
                    defaultOption: "equals",
                  },
                  editable: (params) => params.data?.isNewRow || isCellEditable,
                  onCellValueChanged: handleCellValueChanged,
                  valueParser: (data) => {
                    const newValue = parseFloat(data.newValue);
                    return isNaN(newValue) ? 0 : newValue;
                  },
                  valueFormatter: (params) => {
                    return params.value != null
                      ? Number(params.value).toString()
                      : "";
                  },
                },
              ];

              return gridColumns;
            }, [isEditing])}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              resizable: true,
              sortable: true,
              filter: true,
              filterParams: {
                buttons: ["apply", "clear", "reset"],
              },
            }}
            domLayout="normal"
            pagination={true}
            paginationPageSize={20}
            paginationPageSizeSelector={[10, 20, 50, 100]}
            onGridReady={(params) => {
              gridApiRef.current = params.api;
              params.api.applyColumnState({
                state: [
                  {
                    colId: "datetime",
                    sort: "desc",
                  },
                ],
              });
            }}
            postSortRows={(params) => {
              const rowNodes = params.nodes;
              let nextInsertPos = 0;

              for (let i = 0; i < rowNodes.length; i++) {
                const isNewRow = rowNodes[i].data.isNewRow;
                if (isNewRow) {
                  rowNodes.splice(nextInsertPos, 0, rowNodes.splice(i, 1)[0]);
                  nextInsertPos++;
                }
              }
            }}
            isExternalFilterPresent={() => true}
            doesExternalFilterPass={(node) => {
              if (node.data?.isNewRow) {
                return true;
              }
              return true;
            }}
            components={{
              agDateInput: DTPicker,
            }}
          />
        </div>
      </div>

      {/* Right Panel: Actions */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-light-orange/20 sticky top-6">
          <div className="bg-teal rounded-xl p-4 mb-6 shadow-md">
            <h2 className="text-xl text-white font-bold text-center">
              Actions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleGuideClick}
              className="flex items-center justify-center w-full bg-medium-teal text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all hover:bg-dark-teal hover:shadow-lg"
            >
              <QuestionMarkCircleIcon className="w-6 h-6 mr-2" />
              How to Use
            </button>

            <button
              onClick={() => gridApiRef.current?.setFilterModel(null)}
              className="w-full bg-light-gray text-gray font-semibold px-4 py-3 rounded-xl shadow-md border border-medium-gray/30 transition-all hover:bg-medium-gray hover:text-white"
            >
              Clear Filters
            </button>

            <button
              onClick={fetchData}
              className="flex items-center justify-center w-full bg-orange text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all hover:bg-dark-orange hover:shadow-lg"
            >
              <ArrowPathIcon className="w-6 h-6 mr-2" />
              Refresh
            </button>

            {isAdmin && (
              <div className="w-full flex flex-col gap-4 mt-4 pt-4 border-t border-gray/20">
                <button
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="w-full bg-neutral-600 text-white font-semibold px-4 py-3 rounded-xl shadow-md transition-all hover:bg-neutral-700"
                >
                  {isEditing ? "Exit Edit Mode" : "Enter Edit Mode"}
                </button>

                {isEditing && (
                  <div className="w-full flex flex-col gap-3 bg-light-teal/20 p-4 rounded-xl border border-teal/20">
                    <div className="text-teal font-bold text-center mb-2 uppercase text-sm tracking-wider">
                      Edit Controls
                    </div>
                    <button
                      onClick={handleCreateRow}
                      className={`w-full bg-white text-dark-orange border border-dark-orange font-bold px-4 py-2 rounded-xl shadow-sm transition-all
                            ${selectedRows.length > 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-dark-orange hover:text-white"
                        }`}
                      disabled={selectedRows.length > 0}
                    >
                      Create New Row
                    </button>

                    <button
                      onClick={handleDeleteSelectedRows}
                      className={`w-full bg-white text-red-500 border border-red-500 font-bold px-4 py-2 rounded-xl shadow-sm transition-all
                            ${selectedRows.length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-500 hover:text-white"
                        }`}
                      disabled={selectedRows.length === 0}
                    >
                      Delete Selected
                    </button>

                    <button
                      onClick={saveChanges}
                      className={`w-full bg-green-500 text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all hover:bg-green-600
                          ${Object.keys(editedRows).length === 0
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                        }`}
                      disabled={Object.keys(editedRows).length === 0}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
        onClose={() => setDialog({ ...dialog, isOpen: false })}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
}

/**
 * Credit: https://javascript.plainenglish.io/how-to-create-a-datetime-filter-in-ag-grid-react-e2e1ba2fc80
 * Timestamp filter function to be passed to comparator
 * in column definition
 * @param { * } filterLocalDate - Date to filter by
 * @param { * } cellValue - Date from table cell
 * @returns 0 | 1 | -1
 */
function timestampFilter(filterLocalDate, cellValue) {
  if (!cellValue) return -1;

  filterLocalDate = new Date(filterLocalDate);
  const filterBy = filterLocalDate.getTime();

  try {
    const filterMe = new Date(cellValue).getTime();

    if (filterBy === filterMe) return 0;
    return filterMe < filterBy ? -1 : 1;
  } catch (error) {
    console.error("Invalid datetime format:", cellValue);
    return -1; // default to -1 for invalid dates
  }
}

function formatInTimeZone(
  datetime: any,
  timeZone: string,
  formatString: string,
) {
  const zonedDate = toZonedTime(datetime, timeZone);
  return format(zonedDate, formatString, { timeZone });
}
