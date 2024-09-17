import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import HeaderCheckbox from './HeaderCheckbox'; // Import the header checkbox component

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

const App: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [selectedRows, setSelectedRows] = useState<{ [key: number]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [allSelected, setAllSelected] = useState<boolean>(false);
    const [rowCount, setRowCount] = useState<number>(1);

    // Fetch data for the current page
    const fetchData = async (page: number) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
            const { data, pagination } = response.data;
            setArtworks(data.map((item: any) => ({
                id: item.id,
                title: item.title,
                place_of_origin: item.place_of_origin,
                artist_display: item.artist_display,
                inscriptions: item.inscriptions,
                date_start: item.date_start,
                date_end: item.date_end,
            })));
            setTotalRecords(pagination.total);
            setCurrentPage(page);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1); // Fetch initial data for the first page
    }, []);

    // Handle row selection
    const onRowSelectChange = (rowId: number, isSelected: boolean) => {
        setSelectedRows((prevSelectedRows) => ({
            ...prevSelectedRows,
            [rowId]: isSelected,
        }));
    };

    // Handle the "select all" checkbox in the table header
    const onSelectAllChange = (isChecked: boolean) => {
        setAllSelected(isChecked);
        const newSelectedRows = { ...selectedRows };
        artworks.forEach((artwork) => {
            newSelectedRows[artwork.id] = isChecked;
        });
        setSelectedRows(newSelectedRows);
    };

    // Function to toggle rows based on user input
    const toggleVisibleRows = () => {
        const newSelectedRows = { ...selectedRows };
        // Toggle the first 'rowCount' number of rows
        artworks.slice(0, rowCount).forEach((artwork) => {
            newSelectedRows[artwork.id] = !selectedRows[artwork.id];
        });
        setSelectedRows(newSelectedRows);
    };

    // Handle page change
    const onPageChange = (event: { first: number; rows: number; page: number }) => {
        fetchData(event.page + 1);
    };

    // Render the checkbox for each row
    const rowCheckboxTemplate = (rowData: Artwork) => (
        <Checkbox
            inputId={`checkbox-${rowData.id}`}
            checked={selectedRows[rowData.id] || false}
            onChange={(e) => onRowSelectChange(rowData.id, e.checked)}
        />
    );

    return (
        <div className="datatable-responsive-demo">
            <h2>Artworks Table</h2>
            <DataTable
                value={artworks}
                paginator
                rows={10}
                totalRecords={totalRecords}
                lazy
                loading={loading}
                onPage={onPageChange}
                first={(currentPage - 1) * 10}
                rowHover
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
            >
                {/* Header Checkbox for Select All */}
                <Column
                    header={<HeaderCheckbox
                        allSelected={allSelected}
                        onSelectAllChange={onSelectAllChange}
                        rowCount={rowCount}
                        setRowCount={setRowCount}
                        toggleVisibleRows={toggleVisibleRows}
                        maxRows={artworks.length}
                    />}
                    body={rowCheckboxTemplate} // Checkbox for each row
                />
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Place of Origin" />
                <Column field="artist_display" header="Artist Display" />
                <Column field="inscriptions" header="Inscriptions" />
                <Column field="date_start" header="Date Start" />
                <Column field="date_end" header="Date End" />
            </DataTable>
        </div>
    );
};

export default App;
