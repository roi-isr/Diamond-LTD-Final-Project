
import React, { useState, useEffect } from 'react';
import ManagementTable from '../../../ManagementTable/jsx/ManagementTable'
import Button from 'react-bootstrap/Button'
import FormModal from '../../../UI-Elements/Modal/Modal'
import fetchGet from '../../../../ApiEndpoints/Get';
import fetchDelete from '../../../../ApiEndpoints/Delete';
import Loader from 'react-loader-spinner';
import '../css/SellTable.css';

const updateMap = new Map();

const inputFields = [
  { name: "מודל", type: 'text' },
  { name: "משקל", type: 'text' },
  { name: "מחיר לקראט", type: 'text' },
  { name: "קוד", type: 'text' },
  { name: "שם הקונה", type: 'text' },
  { name: "תאריך מכירה", type: 'date' },
  { name: "תשלום", type: 'text' },
];

const headers = ["קוד", "מודל", "משקל ", "מחיר לקראט ", "סה''כ", "שם הקונה", "תאריך מכירה ", "תשלום", "", ""];

export default function SellTable() {
  const [content, setContent] = useState([[]]);
  const [tableRender, setTableRender] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateModalId, setUpdateModalId] = useState(false);

  // Fecth data from DB
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let tempContent = [];
    content.forEach((item, index) => {
      if (item.length < headers.length - 1) {
        return;
      }
      const updateBtn =
        <Button
          key={Math.random() * index}
          variant="outline-warning"
          onClick={() => setUpdateModalId(item[0])}>
          עדכן
        </Button>;

      const deleteBtn =
        <Button
          key={Math.random() * index}
          onClick={() => deleteRow(index)}
          variant="outline-danger">
          הסר
       </Button>;

      const renderItems = item.slice(1);

      tempContent.push([...renderItems, updateBtn, deleteBtn]);
    })
    setTableRender(tempContent);
  }, [content])

  const updatePostUi = (newSell) => {
    const newSellFixed = [...newSell];
    // Add the total column
    newSellFixed.splice(5, 0, newSell[3] * newSell[4]);
    setContent(prevContent => [...prevContent, newSellFixed]);
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchGet('sells');
      renderData(fetchedData);

    } catch {
      console.log("Failed to fetch contact data from DB");
    } finally {
      setLoading(false);
    }
  }

  const deleteRow = async (index) => {
    const con = window.confirm("Are you sure that you want to delete the item?");
    if (!con) {
      return
    }
    try {
      // Delete from DB
      await fetchDelete(`sell/${content[index][0]}`);
      // Delete from UI
      setContent(prevContent => prevContent.filter((item, i) => index !== i));
    } catch {
      alert('Error in deletion...')
    }
  }

  const updatePutUi = (updatedItem) => {
    const tempContent = [...content];
    const wantedIndex = tempContent.findIndex((item) => item[0] === updatedItem[0]);
    const updatedItemFixed = [...updatedItem];
    updatedItemFixed.splice(5, 0, updatedItem[3] * updatedItem[4])
    tempContent[wantedIndex] = [...updatedItemFixed];
    updateMap[updatedItem[0]] = [
      { name: "קוד החבילה", content: updatedItem[1] },
      { name: "מודל", content: updatedItem[2] },
      { name: "משקל", content: updatedItem[3] },
      { name: "מחיר לקראט", content: updatedItem[4] },
      { name: "שם הקונה", content: updatedItem[5] },
      { name: "תאריך מכירה", content: updatedItem[6], type: 'date' },
      { name: "תשלום", content: updatedItem[7] },
    ];
    setContent(tempContent);
  }

  // Convert the data fetch for DB into renderable data
  const renderData = (data) => {
    const tempSell = []
    Object.values(data).forEach(sellValues => {
      const subTempSell = [];
      subTempSell.push(
        sellValues['sell_id'], sellValues['package_code'],
        sellValues['package_model'], sellValues['weight_in_carat'], sellValues['price_per_carat'],
        sellValues['weight_in_carat'] * sellValues['price_per_carat'],
        sellValues['buying_entity'], sellValues['payment_method'], sellValues['sell_date']
      );
      tempSell.push(subTempSell);

      updateMap[sellValues['sell_id']] = [
        { name: "קוד החבילה", content: sellValues['package_code'] },
        { name: "מודל", content: sellValues['package_model'] },
        { name: "משקל", content: sellValues['weight_in_carat'] },
        { name: "מחיר לקראט", content: sellValues['price_per_carat'] },
        { name: "שם הקונה", content: sellValues['buying_entity'] },
        { name: "תאריך מכירה", content: sellValues['sell_date'], type: 'date' },
        { name: "תשלום", content: sellValues['payment_method'] },
      ];
    });
    setContent(tempSell);

  }

  //Returns the table to our requested page.
  return (
    <div className="sell-main-div">
      {loading ?
        <Loader style={{ margin: 'auto' }}
          type='Bars'
          height={300}
          width={300}
          color="SlateBlue"
        /> :
        <ManagementTable
          headers={headers}
          content={tableRender}
          startIdx={1}
          contentController={{
            content,
            setContent
          }}
        />
      }
      {
        updateModalId &&
        <FormModal
          modalType="update-form"
          fields={updateMap[updateModalId]}
          autoShow={true}
          closeForm={() => setUpdateModalId(false)}
          popUpTitle="עדכון פרטי משלוח"
          apiPath={`sell/${updateModalId}`}
          updatePutUiFunc={updatePutUi}
        />
      }
      <FormModal
        fields={inputFields}
        modalType="input-form"
        popUpTitle="הוספת משלוח"
        apiPath="sell"
        updatePostUiFunc={updatePostUi}
      />

    </div>

  );
}
