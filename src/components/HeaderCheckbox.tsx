import React, { useRef } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';

interface HeaderCheckboxProps {
    allSelected: boolean;
    onSelectAllChange: (isChecked: boolean) => void;
    rowCount: number;
    setRowCount: React.Dispatch<React.SetStateAction<number>>;
    toggleVisibleRows: () => void;
    maxRows: number; // Max rows to limit input for toggle
}

const HeaderCheckbox: React.FC<HeaderCheckboxProps> = ({ 
    allSelected, 
    onSelectAllChange, 
    rowCount, 
    setRowCount, 
    toggleVisibleRows, 
    maxRows 
}) => {
    const overlayPanelRef = useRef<OverlayPanel>(null);

    return (
        <div className="flex justify-between p-2">
            <Checkbox
                inputId="select-all-checkbox"
                checked={allSelected}
                onChange={(e) => onSelectAllChange(e.checked=true)}
            />
            <i
                className="pi pi-check"
                style={{
                    fontSize: '16px', // Matching the checkbox size
                    marginLeft: '2px', // Adding 2px distance between checkbox and tick mark
                    cursor: 'pointer',
                    color: 'black', // Simple black tick
                }}
                onClick={(e) => overlayPanelRef.current?.toggle(e)} // Open overlay on tick click
            />
            <OverlayPanel ref={overlayPanelRef}>
                <div className="p-field">
                    <label htmlFor="rows">Number of Rows to Toggle:</label>
                    <input
                        id="rows"
                        type="number"
                        value={rowCount}
                        onChange={(e) => setRowCount(parseInt(e.target.value, 10))}
                        min={1}
                        max={maxRows} // Maximum number of rows to toggle
                        className="p-inputtext p-component"
                    />
                    <Button
                        label="Submit"
                        className="p-mt-2"
                        onClick={toggleVisibleRows}
                    />
                </div>
            </OverlayPanel>
        </div>
    );
};

export default HeaderCheckbox