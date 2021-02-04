import React, { Component, useEffect } from "react";
import { Table } from 'react-bootstrap';
import '../css/ManagementTable.css'

function ManagementTable({ headers, content }) {
    return (
        <div className="man-table-wrapper">
            <Table dir="rtl"
                style={{ textAlign: 'right', fontSize: '1.2rem', textAlign:'center' }}
                striped bordered hover
            >
                <thead>
                    <tr>
                        {headers.map((item, index) =>
                            <th
                                key={Math.random() * index}>
                                {item}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {content.map((row, index) =>
                        <tr
                            key={Math.random() * index}>
                            {row.map((item, idx) =>
                                <td
                                    key={Math.random() * idx}>
                                    {item}
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </Table >
        </div>
    );
}
export default ManagementTable;
