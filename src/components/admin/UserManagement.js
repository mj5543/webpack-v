import React, { Component } from 'react';
import axios from 'axios';
import loadable from '@loadable/component';
// import { Link } from 'react-router-dom';
import moment from 'moment';
import {isEmpty} from 'lodash';
import { toast } from "react-toastify";
import LoaderDot from '../ui/progress/LoaderDot';
// import DataTableComponent from '../lib/dataDisplay/DataTableCompoenet';
const DataTableComponent = loadable(() => import('../lib/dataDisplay/DataTableCompoenet'), {
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
  _getDataColumns() {
    return [
      {
        name: "User Name",
        selector: row => `${row.username}`,
        sortable: true,
        grow: 1,
      },
      {
        name: "패스워드",
        selector: row => row.password,
        sortable: true,
        compact: false,
        grow: 8,
        cell: d => this._passwordForm(d)
      },
      {
        name: "가입일",
        selector: row => row.create_at,
        sortable: true,
        right: false,
        grow: 1,
        format: d => moment(d.create_at).format('YYYY.MM.DD'),
        // cell: d => <span>{moment(d.created_at).format('YYYY.MM.DD')}</span>,
      }
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
    // })
    return <DataTableComponent columns={this.state.columns} 
    dataList={this.state.dataList} 
    isLoading={this.state.isLoading} 
    isSelectable={true} 
    onSelectedChagenItemCB={this.setEditableItem} />
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