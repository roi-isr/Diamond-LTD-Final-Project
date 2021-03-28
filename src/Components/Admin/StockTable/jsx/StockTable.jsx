import React, { useState, useEffect } from 'react';
import '../css/StockTable.css'
import { CircularProgressbar } from 'react-circular-progressbar'
import ManagementTable from '../../../ManagementTable/jsx/ManagementTable'
import Button from 'react-bootstrap/Button';
import fetchGet from '../../../../ApiEndpoints/Get';
import fetchDelete from '../../../../ApiEndpoints/Delete';
import FormModal from '../../../UI-Elements/Modal/Modal'
import Loader from 'react-loader-spinner';
import fetchPut from '../../../../ApiEndpoints/Put';

const updateMap = new Map();

const inputFields = [
  { name: "מודל", type: 'text' },
  { name: "משקל החבילה", type: 'text' },
  { name: "עלות", type: 'text' },
  { name: "ניקיון", type: 'text' },
  { name: "צבע", type: 'text' },
  { name: "קוד", type: 'text' },
  { name: "הערות", type: 'text' },
  { name: "תאריך קנייה - תשלום", type: 'date' },
  {
    name: "סטטוס", select: true,
    options: [{ value: 'בחנות', label: 'בחנות' }, { value: 'לא בחנות', label: 'לא בחנות' }]
  },
];

const offerModalFields = ["מודל היהלום", "קוד היהלום", "שם הפונה", "טלפון", "מייל", "משקל מוצע", "מחיר מוצע", "הערות"]

const headers = ["מודל", "משקל", "עלות", "נקיון", "צבע", "קוד", "הערות", "תאריך קנייה - תשלום", "סטטוס", "מלאי", "כמות פניות", "", ""];

export default function StockTable() {
  const [content, setContent] = useState([[]]);
  const [tableRender, setTableRender] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateModalId, setUpdateModalId] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState();
  const [currOfferPagination, setCurrOfferPagination] = useState();
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
      const watchOffersBtn =
        <Button
          key={Math.random() * index}
          variant="outline-info"
          disabled={item[11] === 0}
          onClick={() => getOfferData(item[0])}
        >
          צפה בפניות!
      </Button>;

      const confirmBtn =
        <Button
          key={Math.random() * index}
          variant={content[index][9] === 'בחנות' ? "outline-danger" : "outline-success"}
          onClick={() => moveInOutStoreHandler(index)}>
          {item[9] === 'בחנות' ? 'הוצא מהחנות' : 'העבר לחנות'}
        </Button>;

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
      tempContent.push([...renderItems, watchOffersBtn, confirmBtn, updateBtn, deleteBtn]);
    })
    setTableRender(tempContent)
  }, [content])

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchGet('stocks');
      const fetchOfferCounter = await fetchGet('stocks-to-offers-counter');
      renderData(fetchedData, fetchOfferCounter);

    } catch {
      console.log("Failed to fetch contact data from DB");
    } finally {
      setLoading(false);
    }
  }

  const updatePostUi = (newStock) => {
    const newStockFixed = [...newStock, newStock[2] * newStock[3], 0]
    setContent(prevContent => [...prevContent, newStockFixed]);
  }

  const updatePutUi = (updatedStock) => {
    const tempContent = [...content];
    const wantedIndex = tempContent.findIndex((item) => item[0] === updatedStock[0]);
    const wantedItem = tempContent[wantedIndex];
    tempContent[wantedIndex] = [...updatedStock, wantedItem[wantedItem.length - 2], updatedStock[2] * updatedStock[3]];
    updateMap[updatedStock[0]] = [
      { name: "מודל", content: updatedStock[1] },
      { name: "משקל", content: updatedStock[2] },
      { name: "עלות", content: updatedStock[3] },
      { name: "נקיון", content: updatedStock[4] },
      { name: "צבע", content: updatedStock[5] },
      { name: "קוד", content: updatedStock[6] },
      { name: "הערות", content: updatedStock[7] },
      { name: "תאריך קנייה - תשלום", content: updatedStock[8], type: 'date' },
    ];
    setContent(tempContent);
  }

  const renderData = (data, offerCounterData) => {
    const tempStock = []
    Object.values(data).forEach(stockValues => {
      const subTempStock = [];
      subTempStock.push(
        stockValues['stock_id'], stockValues['package_model'],
        stockValues['weight_in_karat'], stockValues['cost_per_karat'],
        stockValues['clearance'], stockValues['color'],
        stockValues['code'], stockValues['comments'],
        stockValues['sell_date'], stockValues['status'],
        stockValues['weight_in_karat'] * stockValues['cost_per_karat'],
        offerCounterData[stockValues['stock_id']] ?? 0
      );
      tempStock.push(subTempStock);

      updateMap[stockValues['stock_id']] = [
        { name: "מודל", content: stockValues['package_model'] },
        { name: "משקל", content: stockValues['weight_in_karat'] },
        { name: "עלות", content: stockValues['cost_per_karat'] },
        { name: "נקיון", content: stockValues['clearance'] },
        { name: "צבע", content: stockValues['color'] },
        { name: "קוד", content: stockValues['code'] },
        { name: "הערות", content: stockValues['comments'] },
        { name: "תאריך קנייה - תשלום", content: stockValues['sell_date'], type: 'date' },
      ];
    });
    setContent(tempStock);
  }

  const deleteRow = async (index) => {
    const con = window.confirm("Are you sure that you want to delete the item?");
    if (!con) {
      return
    }
    try {
      await fetchDelete(`stock/${content[index][0]}`);
      setContent(prevContent => prevContent.filter((item, i) => index !== i));
    } catch {
      alert('Error in deletion...')
    }
  }

  // Move an item in or out of the store
  const moveInOutStoreHandler = async (index) => {
    const userConfirm = window.confirm(`האם אתה בטוח שברצונך ${content[index][9] === 'בחנות' ? 'להוציא' : 'להכניס'} את הפריט ${content[index][9] === 'בחנות' ? 'מה' : 'אל ה'}חנות?`);
    if (!userConfirm) {
      return;
    }
    const nextStatus = content[index][9] === 'בחנות' ? 'לא בחנות' : 'בחנות';
    try {
      await fetchPut(`stock/update-status/${content[index][0]}`, { status: nextStatus })
      const tempContent = [...content];
      tempContent[index][9] = nextStatus;
      setContent(tempContent);
      alert(`הפריט הועבר ${content[index][9] === 'בחנות' ? 'אל ה' : 'מה'}חנות בהצלחה!`)
    }
    catch {
      alert(`בעיה בהעברת פריט ${content[index][9] === 'בחנות' ? 'מה' : 'אל ה'}`);
    }
  }

  const getOfferData = async (offerId) => {
    window.offerData = await fetchGet(`stock-to-offers/${offerId}`);
    setCurrOfferPagination(0);
    setShowOffersModal({
      id: offerId,
      data: [
        { name: "מודל", content: window.offerData[0]['package_model'] },
        { name: "קוד", content: window.offerData[0]['code'] },
        { name: "שם הפונה", content: window.offerData[0]['name'] },
        { name: "טלפון", content: window.offerData[0]['phone'] },
        { name: "מייל", content: window.offerData[0]['email'] },
        { name: "משקל מוצע", content: window.offerData[0]['offered_weight'] },
        { name: "מחיר מוצע", content: window.offerData[0]['offered_price'] },
        { name: "הערות", content: window.offerData[0]['additional_comments'], multiline: true },
        // { name: "תאריך קנייה - תשלום", content: stockValues['sell_date'], type: 'date' },
      ]
    });
  }

  const offerPagePagination = (operation) => {
    let nextPage;
    if (operation === '+') {
      nextPage = currOfferPagination + 1;
    }
    else {
      nextPage = currOfferPagination - 1;
    }

    if (!window.offerData[nextPage]) {
      alert('No more data');
      return;
    }
    setShowOffersModal(lastState => {
      return (
        {
          ...lastState,
          data: [
            { name: "מודל", content: window.offerData[nextPage]['package_model'] },
            { name: "קוד", content: window.offerData[nextPage]['code'] },
            { name: "שם הפונה", content: window.offerData[nextPage]['name'] },
            { name: "טלפון", content: window.offerData[nextPage]['phone'] },
            { name: "מייל", content: window.offerData[nextPage]['email'] },
            { name: "משקל מוצע", content: window.offerData[nextPage]['offered_weight'] },
            { name: "מחיר מוצע", content: window.offerData[nextPage]['offered_price'] },
            { name: "הערות", content: window.offerData[nextPage]['additional_comments'], multiline: true },
            // { name: "תאריך קנייה - תשלום", content: stockValues['sell_date'], type: 'date' },
          ]
        });
    });
    setCurrOfferPagination(nextPage);
  }
  //Returns the table to our requested page, shows us all the company's current inventory.
  //Another element gives an indication to the business owner, what the status of his credit line at a given moment.
  return (
    <div className="stock-main-div">
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
          popUpTitle="עדכון פרטי מלאי"
          apiPath={`stock/${updateModalId}`}
          updatePutUiFunc={updatePutUi}
        />
      }
      {
        showOffersModal &&
        <FormModal
          modalType="offer-info-form"
          fields={showOffersModal.data}
          autoShow={true}
          closeForm={() => setShowOffersModal(false)}
          popUpTitle="פרטי ההצעה"
          updatePutUiFunc={updatePutUi}
          pagePagination={offerPagePagination}
        />
      }

      <FormModal
        fields={inputFields}
        modalType="input-form"
        popUpTitle="הוספת מלאי"
        apiPath="stock"
        updatePostUiFunc={updatePostUi}
      />

      <div className="progress-stock-wrapper">
        <label>ניצול מסגרת האשראי</label>
        <CircularProgressbar
          maxValue={100}
          value={10}
          percentage={10}
          text={`${10}%`} />
      </div>
    </div >
  );
}
