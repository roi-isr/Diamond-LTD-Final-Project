import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Icon from '@material-ui/core/Icon';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import ManagementTable from '../../../ManagementTable/jsx/ManagementTable'
import Button from 'react-bootstrap/Button'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const englishTitles = ['id', 'weigth', 'from_country', 'delivery_comany', 'contact_name', 'date'];





export default function SellTable() {
  const classes = useStyles();

  // //Function of deleting a row from the table, at the click of a button the row is deleted from the database.
  // const deleteBtn = (ind) => {
  //   const con = window.confirm("Are you sure?");
  //   if (!con)
  //     return;
  //   setRows(currRow =>
  //     currRow.filter((item, index) => index !== ind));
  // }



  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const add_form = () => {
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Open form dialog
        </Button>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address here. We will send updates
              occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );

  }
  const delete_btn = <Button name="delete" variant="outline-danger">הסר</Button>;

  const confirm_btn = <Button name="confirm" variant="outline-success">אישור הגעה</Button>;

  const headers = ["מספר החבילה", "משקל החבילה", "מהיכן המשלוח", "חברת השילוח", "שם השולח ", "תאריך המשלוח"];
  const content = [
    ['R-101', '160.25', 'ישראל', '625', 'ADIV', 'רועי ישראלי', '1/1/21', delete_btn, confirm_btn],
    ['R-102', '152.25', 'ישראל', '625', 'ADIV', 'רועי ישראלי', '1/1/21', delete_btn, confirm_btn],
    ['R-103', '158.25', 'ישראל', '625', 'ADIV', 'רועי ישראלי', '1/1/21', delete_btn, confirm_btn],
    ['R-104', '150.25', 'ישראל', '625', 'ADIV', 'רועי ישראלי', '1/1/21', delete_btn, confirm_btn],

  ];
  //Returns the table to our requested page.
  return (
    <ManagementTable headers={headers} content={content} />
    // <div style={{textAlign:'center'}}>
    //   {/* <AddForm /> */}
    //   <TableContainer component={Paper}>
    //     <Table className={classes.table} aria-label="simple table" style={{ direction: 'rtl' }}>
    //       <TableHead>
    //         <TableRow>
    //           {titles.map((item, index) => (
    //             <TableCell key={index} align="left">
    //               {item}
    //             </TableCell>
    //           ))}
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {rows.map((row, index2) => (
    //           <TableRow key={index2}>

    //             {Object.keys(row)
    //               // .filter((filItem) => filItem !== 'name')
    //               .map((item, index3) =>
    //                 <TableCell
    //                   key={index3}
    //                   align="left">
    //                   {row[englishTitles[index3]]}
    //                 </TableCell>
    //               )}

    //             <Button
    //               variant="contained"
    //               size="small"
    //               color="primary"
    //               onClick={() => deleteBtn(index2)}
    //               className={"delete_btn"}

    //             >
    //               אישור הגעה
    //   </Button>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    //   <Fab color="primary" aria-label="add" style={{margin:"auto"}} >
    //     <AddIcon />
    //   </Fab>
    // </div>
  );
}
