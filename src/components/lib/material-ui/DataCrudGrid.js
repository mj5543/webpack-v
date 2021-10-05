import React, {useCallback, useState} from 'react';
// import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbar,
  useGridSlotComponentProps,
} from '@mui/x-data-grid';
import { createTheme, makeStyles } from '@material-ui/core/styles';
import {RefreshingLoader} from '../../ui/progress/LoaderSample';

const defaultTheme = createTheme();

const useStyles = makeStyles(
  (theme) => ({
    actions: {
      color: theme.palette.text.secondary,
    },
    textPrimary: {
      color: theme.palette.text.primary,
    },
    floatLeft: {
      float: 'left'
    },
    floatRight: {
      float: 'right'
    },
  }),
  { defaultTheme },
);

function LoadingBar() {
  return (
    <RefreshingLoader isShow={true} />
  )
}
function NoData() {
  return (
    <div>데이터가 없습니다.</div>
  )
}

function EditToolbar() {
  const compProps = useGridSlotComponentProps();

  const handleClick = () => {
    const rowModels = compProps.apiRef.current.getRowModels()
    const lastModel = rowModels.get(rowModels.size);
    const id = lastModel.id + 1;
    console.log('rowModels--', rowModels)
    // const id = 2;
    // compProps.apiRef.current.setEditRowsModel([{ id, isNew: true }]);
    compProps.apiRef.current.setRows([...compProps.rows, { id, isNew: true }]);
    compProps.apiRef.current.setRowMode(id, 'edit');
    // Wait for the grid to render with the new row
    setTimeout(() => {
      compProps.apiRef.current.scrollToIndexes({
        rowIndex: compProps.apiRef.current.getRowsCount() - 1,
      });
      compProps.apiRef.current.setCellFocus(id, 'username');
    }, 150);
  };
  const classes = useStyles();

  return (
    <GridToolbarContainer className={classes.floatRight}>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}
function CustomToolbar() {
  const classes = useStyles();
  return (
    <div>
      <GridToolbar className={classes.floatLeft} />
      <EditToolbar />
    </div>
  )
}
function EditIconAction(props) {
  // let id;
  // compProps.apiRef.current.getSelectedRows().forEach((value, key) => {
  //   id = key
  // })
  const handleEditClick = (event) => {
    const id = Number(event.currentTarget.id);
    props.apiRef.current.setRowMode(id, 'edit');
    // Wait for the grid to render with the new row
    setTimeout(() => {
      props.apiRef.current.scrollToIndexes({
        rowIndex: props.apiRef.current.getRowsCount() - 1,
      });

      props.apiRef.current.setCellFocus(id, 'username');
    }, 150);
  };
  const handleDeleteClick = (event) => {
    const id = Number(event.currentTarget.id);
    props.apiRef.current.updateRows([{ id, _action: 'delete' }]);
  };
  return [
    <IconButton
      children={<EditIcon />}
      label="Edit"
      id={props.id}
      onClick={handleEditClick}
      color="inherit"
    />,
    <IconButton
      children={<DeleteIcon />}
      label="Delete"
      id={props.id}
      onClick={handleDeleteClick}
      color="inherit"
    />,
  ]
}
function SaveIconAction(props) {
  // let id;
  // compProps.apiRef.current.getSelectedRows().forEach((value, key) => {
  //   id = key
  // })
  const handleSaveClick = (event) => {
    const id = Number(event.currentTarget.id);
    props.apiRef.current.commitRowChange(id);
    props.apiRef.current.setRowMode(id, 'view');

    const row = props.apiRef.current.getRow(id);
    props.apiRef.current.updateRows([{ ...row, isNew: false }]);
    setTimeout(() => {
      const rowData = props.apiRef.current.getRow(id)
      props.onSelectedChagenItemCB(rowData)
      console.log('saveRow', rowData)
    })
  };
  const handleCancelClick = (event) => {
    const id = Number(event.currentTarget.id);
    props.apiRef.current.setRowMode(id, 'view');

    const row = props.apiRef.current.getRow(id);
    if (row.isNew) {
      props.apiRef.current.updateRows([{ id, _action: 'delete' }]);
    } else {
      const preItem = props.dataList.find(d => d.id === id);
      props.apiRef.current.updateRows([{ ...preItem}]);
    }
  };
  return [
    <IconButton
      children={<SaveIcon />}
      id={props.id}
      label="Save"
      onClick={handleSaveClick}
      color="primary"
    />,
    <IconButton
      children={<CancelIcon />}
      id={props.id}
      label="Cancel"
      onClick={handleCancelClick}
      color="inherit"
    />,
  ]
}
function ActionIcons(props) {
  const compProps = useGridSlotComponentProps();
  console.log('ActionIcons--', props)
  const isInEditMode = compProps.apiRef.current.getRowMode(props.id) === 'edit';
  // const editKey = `edit${props.id}`
  if(isInEditMode) {
    return <SaveIconAction {...props} apiRef={compProps.apiRef} />
  } else {
    return <EditIconAction {...props} apiRef={compProps.apiRef} />
  }
}
// EditToolbar.propTypes = {
//   apiRef: PropTypes.shape({
//     current: PropTypes.object.isRequired,
//   }).isRequired,
//   selectedCellParams: PropTypes.any,
// };

export default function FullFeaturedCrudGrid(props) {
  const classes = useStyles();
  // const apiRef = useGridApiRef();
  // const {rowParams} = GridRowParams;

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const rows = props.dataList;
  const [editRowsModel, setEditRowsModel] = useState({});
  const handleCellEditChange = useCallback(
    (newModel) => {
      const updatedModel = { ...newModel };
      // const [firstName, lastName] = value.toString().split(' ');
      const updatedRows = rows.map((row) => {
        // if (row.id === id) {
        //   return { ...row, firstName, lastName };
        // }
        return row;
      });
      setEditRowsModel(updatedModel);
      // setRows(updatedRows);
      // if (field === 'fullName') {
      //   const [firstName, lastName] = value.toString().split(' ');
      //   const updatedRows = rows.map((row) => {
      //     if (row.id === id) {
      //       return { ...row, firstName, lastName };
      //     }
      //     return row;
      //   });
      //   setRows(updatedRows);
      // }
    },
    [],
  );
  const columns = [
    ...props.columns,
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: classes.actions,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        console.log('renderCell--', params)
        return <ActionIcons {...params} {...props} />
      },
      // getActions: (params) => {
      //   console.log('getActions--', params)
      //   return <ActionIcons key={params.id} {...params} {...props} />
      // }
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <RefreshingLoader isShow={props.isLoading} />
      {!props.isLoading && 
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowHeight={30}
        editRowsModel={editRowsModel}
        onEditRowsModelChange={handleCellEditChange}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: LoadingBar,
          NoRowsOverlay: NoData
        }}
        // componentsProps={{
        //   toolbar: { apiRef },
        // }}
      />
      }
      {/* <div>
         {JSON.stringify(rows)}
    </div> */}
    </div>

  );
}
