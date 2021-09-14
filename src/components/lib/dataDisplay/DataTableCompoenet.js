import React, {useEffect, useState} from 'react';
import loadable from '@loadable/component';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
// import DataTable from "react-data-table-component";
import {isEmpty} from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import LoaderDot from '../../ui/progress/LoaderDot';
// import CircularProgress from '@material-ui/core/CircularProgress';
const DataTable = loadable(() => import('react-data-table-component'), {
  fallback: <div />
});

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  progress: {
    color: '#00acee'
  }
}));
const DataTableComponent = (props) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [selectedRowItem, setSelectedRowItem] = useState(null);
  const sortIcon = <ArrowDownward />;
  // const progress = <CircularProgress size={65} className={classes.progress} />;
  const progress = <LoaderDot />;
  const customStyles = () => {
    return {
      rows: {
        style: {
          minHeight: '35px', // override the row height
        }
      },
      headCells: {
        style: {
          minHeight: '40px', // override the row height
          paddingLeft: '8px', // override the cell padding for head cells
          paddingRight: '8px',
          fontSize: '13px',
          fontWeight: 'bold',
          lineHeight: '30px'
        },
      },
      cells: {
        style: {
          paddingLeft: '3px', // override the cell padding for data cells
          paddingRight: '3px',
        },
      },
    };
  }
  // const darkTheme = () => {
  //   return {
  //     title: {
  //       fontSize: '22px',
  //       fontColor: '#FFFFFF',
  //       backgroundColor: '#363640',
  //     },
  //     contextMenu: {
  //       backgroundColor: '#E91E63',
  //       fontColor: '#FFFFFF',
  //     },
  //     header: {
  //       fontSize: '12px',
  //       fontColor: '#FFFFFF',
  //       backgroundColor: '#363640',
  //     },
  //     rows: {
  //       fontColor: '#FFFFFF',
  //       backgroundColor: '#363640',
  //       borderColor: 'rgba(255, 255, 255, .12)',
  //       hoverFontColor: 'black',
  //       hoverBackgroundColor: 'rgba(0, 0, 0, .24)',
  //     },
  //     cells: {
  //       cellPadding: '5px',
  //     },
  //   }
  // }
  // useEffect(() => {
  //   setIsLoading(props.isLoading);
  // },[props.isLoading]);
  // useEffect(() => {
  //   setDataList(props.dataList);
  // },[props.dataList]);
  const selectedRowChange = (d) => {
    // if(d)
    setSelectedRowItem(d.selectedRows[0]);
    if(props.hasOwnProperty('onSelectedChagenItemCB')) {
      props.onSelectedChagenItemCB(d.selectedRows[0]);
    }
    console.log('selectedRowChange---', d);
  }
  return (
    <div>
    <DataTable
      columns={props.columns}
      data={props.dataList}
      noHeader={true}
      responsive={true}
      sortIcon={sortIcon}
      progressComponent={progress}
      // customTheme={this.darkTheme()}
      customStyles={customStyles()}
      defaultSortAsc={false}
      pagination
      paginationPerPage={15}
      highlightOnHover
      noDataComponent="등록된 글이 없습니다."
      progressPending={props.isLoading}
      selectableRows={props.isSelectable}
      onSelectedRowsChange={(d) => selectedRowChange(d)}
    />

    </div>
  );
}

export default DataTableComponent;
