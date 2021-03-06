import React, { Component } from 'react';
import axios from 'axios';
import loadable from '@loadable/component';
// import { Link } from 'react-router-dom';
import moment from 'moment';
import {isEmpty} from 'lodash';
import { toast } from "react-toastify";
import LoaderDot from '../ui/progress/LoaderDot';
import { TooltipB } from '../lib/material-ui/Tooltip';
// import FullFeaturedCrudGrid from '../lib/material-ui/DataCrudGrid';
// import DataTableComponent from '../lib/dataDisplay/DataTableCompoenet';
const DataTableComponent = loadable(() => import('../lib/dataDisplay/DataTableCompoenet'), {
  fallback: <LoaderDot />
});
const FullFeaturedCrudGrid = loadable(() => import('../lib/material-ui/DataCrudGrid'), {
  fallback: <LoaderDot />
});
require('dotenv').config();
const crypto = require('crypto');
const solt = process.env.REACT_APP_HIDDEN_KEY;
class UserManagement extends Component {
  constructor(props) {
    console.log('props--', props);
    super(props);
    this.state = {
      password: '', // 첫번째 패스워드
      rePassword: '', // 두번째 패스워드
      pMessage:'패스워드를 입력하세요.', // 확인 메시지 (패스워드 일치여부를 사용자에게 알려주는 메시지)
      show: false,
      blindStyle: {
        width:'100%'
      },
      bodyEle: '',
      loading: true,
      dataList: [],
      groupType: '',
      columns: [],
      writeButton: '',
      isLoading: true,
      contentEl: '',
      editableItem: {}

    }; // 초기 state값을 셋팅해준다. 빈 스트링 값은 false를 뜻한다.
    this.setEditableItem = this.setEditableItem.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this._passwordForm = this._passwordForm.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
  }
  componentDidMount() {
    this._getList();
  }
  // componentDidUpdate() {
  //   if(this.state.groupType !== this.props.groupType) {
  //     this.setState({
  //       groupType: this.props.groupType,
  //     });
  //     this._getCateroeyList();
  //   }
  //   console.log('componentDidUpdate--', this.props);

  // }
  componentWillUnmount () {
    
  }
  handlePassword = (e) => {
    let list = [];
    debugger
    this.setState({
      [e.target.name]: e.target.value
    })
    console.log('password changed--', e);
    list = this.state.dataList;
    list.map(d => {
      if(d.id.toString() === e.target.name) {
        d.password = e.target.value;
      }
      return d;
    })
    this.setState({
      dataList: list
    })
  }

  _passwordForm(d) {
    const inputName = d.id.toString();
    this.setState({
      [inputName]: d.password
    })
    return (
      <div>
        <span>{d.password}</span>
        <input type="text" 
        className="form-control"
        style={{display: 'inline-block', width: '40%'}}
        name={inputName} 
        value={this.state[inputName]} 
        onChange={this.handlePassword} />
        <button type="button" className="btn btn-primary" id={d.id} onClick={this.passwordChange}>수정</button>
      </div>
    )
  }
  async userUpdate(e) {
    try {
      console.log('passwordChange--', e);
      const targetItem = this.state.dataList.find(d => d.id === e.id);
      console.log('targetItem--', targetItem);
      const changedPassword = e.password;
      const cipher = crypto.createCipher('aes192', solt);
      cipher.update(changedPassword, 'utf8', 'base64'); // javascript는 utf-8 라고 안 씀
      const output = cipher.final('base64');
      await axios.post('/api/user-update', {email: targetItem.email, password: output, grade: e.grade});
      toast.success('저장되었습니다.')

    } catch(e) {
      toast.error('저장실패');
      console.log(e)
    }

  }
 
  async passwordChange(e) {
    try {
      console.log('passwordChange--', e);
      const targetItem = this.state.dataList.find(d => d.id.toString() === e.target.id);
      console.log('targetItem--', targetItem);
      const changedPassword = this.state[e.target.id];
      const cipher = crypto.createCipher('aes192', solt);
      cipher.update(changedPassword, 'utf8', 'base64'); // javascript는 utf-8 라고 안 씀
      const output = cipher.final('base64');
      await axios.post('/api/user-password-change', {email: targetItem.email, password: output});
      toast.success('저장되었습니다.')

    } catch(e) {
      toast.error('저장실패');
      console.log(e)
    }

  }
  // _getDataColumns() {
  //   return [
  //     {
  //       name: "User Name",
  //       selector: row => `${row.username}`,
  //       sortable: true,
  //       grow: 1,
  //     },
  //     {
  //       name: "패스워드",
  //       selector: row => row.password,
  //       sortable: true,
  //       compact: false,
  //       grow: 8,
  //       cell: d => this._passwordForm(d)
  //     },
  //     {
  //       name: "가입일",
  //       selector: row => row.create_at,
  //       sortable: true,
  //       right: false,
  //       grow: 1,
  //       format: d => moment(d.create_at).format('YYYY.MM.DD'),
  //       // cell: d => <span>{moment(d.created_at).format('YYYY.MM.DD')}</span>,
  //     }
  //   ]
  // }
  _getDataColumns() {
    return [
      { field: 'id', headerName: 'Id', type: 'number', width: 50, },
      { field: 'username', headerName: 'User Name', width: 150, editable: true },
      { field: 'email', headerName: 'Email', width: 150, editable: true,
        renderCell: (params) => (
          <TooltipB title={params.row.email} >
          <span className="table-cell-trucate">{params.row.email}</span>
          </TooltipB>
        ),
      },
      { field: 'password', headerName: 'Password', width: 130, editable: true },
      { field: 'grade', headerName: 'Grade', width: 120, editable: true },
      { field: 'provided_app', headerName: 'Provided', width: 120, editable: true },
      {
        field: 'create_at',
        headerName: 'Date Created',
        type: 'date',
        width: 120,
      },
      {
        field: 'logout_at',
        headerName: 'Last Login',
        type: 'dateTime',
        width: 200,
        editable: true,
      },
    ]
  }
  _getPassword(pass) {
    const decipher = crypto.createDecipher('aes192', solt);
    decipher.update(pass, 'base64', 'utf8');
    const deoutput = decipher.final('utf8');
    console.log('복호화된 문자:'+deoutput);
    return deoutput;
  }
  
  _getList = async() => {
    const res = await axios.get('/api/users');
    console.log('users  _getList--', res);
    const tempList = res.data.result.map(d => {
      d.password = this._getPassword(d.password);
      d.create_at = new Date(d.create_at)
      d.logout_at = new Date(d.logout_at)
      return d;
    })
    this.setState({
      isLoading: false,
      dataList: tempList,
    });
    this.setState({
      columns: this._getDataColumns()
    });

    // this._setContents();
  }
  _setContents() {
    // this.setState({
    //   contentEl: <DataTableComponent columns={this.state.columns} 
    //   dataList={this.state.dataList} 
    //   isLoading={this.state.isLoading} 
    //   isSelectable={true} 
    //   onSelectedChagenItemCB={this.setEditableItem} />
    // // })
    // return <DataTableComponent columns={this.state.columns} 
    // dataList={this.state.dataList} 
    // isLoading={this.state.isLoading} 
    // isSelectable={true} 
    // onSelectedChagenItemCB={this.setEditableItem} />

    return <FullFeaturedCrudGrid columns={this.state.columns} 
    dataList={this.state.dataList} 
    isLoading={this.state.isLoading}
    onSelectedChagenItemCB={(d) => this.userUpdate(d)}
    />
  }
  setEditableItem(item) {
    this.setState({
      editableItem: item
    })
  }
  
  dateTimeFormat(date) {
    return moment(date).format('YYYY.MM.DD');
  }
  // goDetail() {
  //   return href="#home"
  // } 

  render() {
    return (
      <div className="card" style={{boxShadow: 'unset'}}>
        {this._setContents()}
      </div>
      
    );
  }
};

export default UserManagement;