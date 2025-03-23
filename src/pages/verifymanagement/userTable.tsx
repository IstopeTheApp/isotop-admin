import React, { useState, useEffect } from 'react';
import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { users } from '@/types/users.type';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from 'primereact/dropdown';
import updateUserStatus from '@/actions/verifymanagement/updateUserStatus';

const iconStyles = `
  .pi-plus:before {
    content: '+';
    font-weight: bold;
  }
  .pi-minus:before {
    content: '-';
    font-weight: bold;
  }
`;

interface Users {
    users: users[] | any;
    selectUser: (uid: string) => void;
};

const UserTable = ({ users, selectUser }: Users) => {
    const [datas, setDatas] = useState<users[]>([]);
    const [row, setRow] = useState<users | null>(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => setDatas(users), [users]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setZoomLevel(1);
        setDisplayDialog(true);
    };

    // Zoom controls
    const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
    const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));

    // Define action options for dropdown
    const actionOptions = [
        { label: 'Verified', value: true },
        { label: 'Unverified', value: false },
    ];

    // Handle action selection for a specific user
    const handleActionChange = async (e, rowData) => {
        const selectedAction = e.value;
        if (selectedAction==null) return;

        let data = {
            is_verified:selectedAction,
            uid:rowData.uid
        }

        const response = await updateUserStatus(data)

        if(response.ok){
            setDatas(currentData =>
                currentData.map(user =>
                    user.uid === rowData.uid
                        ? { ...user, is_verified: selectedAction }
                        : user
                )
            );
        }

    };

    // Action dropdown template
    const actionBodyTemplate = (rowData) => {

        return (
            <Dropdown
                options={actionOptions}
                onChange={(e) => handleActionChange(e, rowData)}
                placeholder="Actions"
                value={null}
                className="w-full"
            />
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <img
                src={rowData.selfie}
                alt={rowData.name}
                style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    cursor: 'pointer'
                }}
                onClick={() => handleImageClick(rowData.selfie)}
            />
        );
    };

    const checkStatus = (rowData)=>{
        return (
            <span>{rowData.is_verified==true?'Verified':'Unverified'}</span>
        );
    };

    const renderImageDialog = () => {
        const dialogFooter = (
            <div className="flex justify-content-between align-items-center">
                <div>
                    <Button className="p-button-text" onClick={zoomOut}>
                        <i className="pi pi-minus"></i>
                    </Button>
                    <span className="mx-2">{Math.round(zoomLevel * 100)}%</span>
                    <Button className="p-button-text" onClick={zoomIn}>
                        <i className="pi pi-plus"></i>
                    </Button>
                </div>
                <Button label="Close" onClick={() => setDisplayDialog(false)} className="p-button-text" />
            </div>
        );

        return (
            <Dialog
                visible={displayDialog}
                onHide={() => setDisplayDialog(false)}
                header="Image Preview"
                footer={dialogFooter}
                style={{ maxWidth: '70vw' }}
                maximizable
            >
                <div className="flex justify-content-center overflow-hidden" style={{ height: '60vh' }}>
                    <div style={{
                        transform: `scale(${zoomLevel})`,
                        transition: 'transform 0.2s',
                        transformOrigin: 'center center'
                    }}>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            style={{
                                maxHeight: '60vh',
                                objectFit: 'contain'
                            }}
                        />
                    </div>
                </div>
            </Dialog>
        );
    };

    return (
        <div className="card usertable">
            <style>{iconStyles}</style>

            <DataTable
                value={datas}
                selectionMode="single"
                selection={row!}
                onSelectionChange={(e) => setRow(e.value as users)}
                dataKey="uid"
                metaKeySelection={false}
                tableStyle={{ minWidth: '16rem' }}
            >
                <Column field="id" header="S/N" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column body={imageBodyTemplate} header="Selfie" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column field="email" header="Email" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column field="phone" header="Phone Number" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column field="name" header="Name" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column field="gender" header="Gender" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column field="age" header="Age" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column body={checkStatus} header="Is Verified" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
                <Column body={actionBodyTemplate} header="Actions" className='sm:text-base text-sm sm:py-2 sm:px-4'></Column>
            </DataTable>
            {renderImageDialog()}
        </div>
    );
};

export default UserTable;