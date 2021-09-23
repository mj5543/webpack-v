import React, { Component } from 'react';
import loadable from '@loadable/component';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {isEmpty} from 'lodash';
// import ThumbnailList from './ThumbnailList';
// import DataTableComponent from '../lib/dataDisplay/DataTableCompoenet';
import CategorySeletctList from './CategorySeletctList';
import { PostsApi, AxiosConfig as api } from '../../api';
import LoaderDot from '../ui/progress/LoaderDot';
const ThumbnailList = loadable(() => import('./ThumbnailList'), {
  fallback: <LoaderDot />
});
const DataTableComponent = loadable(() => import('../lib/dataDisplay/DataTableCompoenet'), {
  fallback: <LoaderDot />
});
moment.locale('ko');

const initialState = {
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
}// 초기 state값을 셋팅해준다. 빈 스트링 값은 false를 뜻한다.
class PostList extends Component {
  constructor(props) {
    console.log('props--', props);
    super(props);
    this.state = initialState;
  }
  componentDidMount() {
    this.setState({
      groupType: this.props.groupType,
      isLoading: true,
      columns: this._getDataColumns()
    });

    this._getCateroeyList();
    this._setWriteButton();
    // this._getList();
  }
  componentDidUpdate() {
    if(this.state.groupType !== this.props.groupType) {
      this.setState({
        groupType: this.props.groupType,
        isLoading: true,
      });
      this._setWriteButton();
      this._getCateroeyList();
    }
    console.log('componentDidUpdate--', this.props);

  }
  componentWillUnmount() {
    this.setState(initialState)
  }
  _setWriteButton() {
    if(isEmpty(this.props.userInfo)) {
      return;
    }
    let btnEl = ''
    if (this.props.groupType !== 'GUEST' && this.props.userInfo.grade === 'MASTER') {
      btnEl = <button type="button" className="btn btn-dark btn-sm btn-fr mt-20">
              <Link to={{pathname:`${this.props.pathInfo.url}/detail`, search: `?groupType=${this.props.groupType}`, state: this.props.location.state, hash:'#write'}} className="text-white" style={{textDecoration: 'none'}}>글쓰기</Link>
              {/* <Link to={`${this.props.pathInfo.url}?groupType=${this.props.groupType}#write`} className="text-white" style={{textDecoration: 'none'}}>글쓰기</Link> */}
              </button>
    } else if (this.props.groupType === 'GUEST') {
      btnEl = <button type="button" className="btn btn-dark btn-sm btn-fr mt-20">
              <Link to={{pathname:`${this.props.pathInfo.url}/detail`, search: `?groupType=${this.props.groupType}`, state: this.props.location.state, hash:'#write'}} className="text-white" style={{textDecoration: 'none'}}>글쓰기</Link>
              </button>
    }
    this.setState({
      writeButton: btnEl,
    })
  }
  _getDataColumns() {
    return [
      {
        name: "작성자",
        selector: row => `${row.name}`,
        sortable: true,
        grow: 1,
      },
      {
        name: "글 제목",
        selector: row => row.subject,
        sortable: true,
        compact: false,
        grow: 8,
        cell: d => 
        <Link to={{pathname:`${this.props.pathInfo.url}/detail`, search: `?id=${d.id}&groupType=${this.props.groupType}`, state: this.props.location.state}} className="nav-link text-dark">
          {d.subject} {d.comment_cnt !== 0 && (`(${d.comment_cnt})`)}
        </Link>
      
      },
      {
        name: "작성일",
        selector: row => row.created_at,
        sortable: true,
        right: false,
        grow: 1,
        format: d => moment(d.created_at).format('YYYY.MM.DD'),
        // cell: d => <span>{moment(d.created_at).format('YYYY.MM.DD')}</span>,
      }
    ]
  }
  
  _getList = async() => {
    const res = await api.getList(PostsApi.POST_LIST);
    console.log('_getList--', res)
    const bodyEle = this.boardList(res.data.result);
    this.setState({
      bodyEle: bodyEle,
      loading: false,
      dataList: res.data.result,
      // password: '',
    }) //사용자가 입력한 값이 재확인 비번과 일치하지 않을 경우
  // this.setState({ hello : res.data.hello })
  }
  _getCateroeyList = async() => {
    // this._setContents();
    const res = await api.getList(PostsApi.CATEGOTY_POST_LIST, {groupType: this.props.groupType});
    console.log('_getList--', res)
    // const bodyEle = this.boardList(res.data.result);
    this.setState({
      // bodyEle: bodyEle,
      loading: false,
      dataList: res,
      isLoading: false,
      // password: '',
    }) //사용자가 입력한 값이 재확인 비번과 일치하지 않을 경우
  } 
  _setContents() {
    let contentEl;
    if(this.state.isLoading && this.props.groupType === 'GALLERY') {
      return <LoaderDot />;
    }
    if(this.props.groupType === 'GALLERY') {
      contentEl = <ThumbnailList dataList={this.state.dataList} />
    } else {
      contentEl = <DataTableComponent columns={this.state.columns} dataList={this.state.dataList} isLoading={this.state.isLoading} isSelectable={false} />
    }
    // this.setState({
    //   contentEl: contentEl
    // })
    return contentEl;
  }
  boardList(list) {
    try{
      const listItems = list.map((item, index) =>
      <tr key={index}>
        {/* <td>{item.id}</td> */}
        <td>{item.name}</td>
        {/* <Nav.Link href={`${this.props.pathInfo.url}/detail#${item.id}`}>
          <td>{item.subject}</td>
        </Nav.Link> */}
        <Link to={{pathname: `${this.props.pathInfo.url}/detail`, search: `?id=${item.id}&groupType=${this.props.location.state.groupType}`, state: {groupType: this.props.location.state.groupType}}}
        className="nav-link text-dark">
          <td>{item.subject}</td>
        </Link>
        <td>{this.dateTimeFormat(item.created_at)}</td>
      </tr>
      );
      return (
        <tbody>{listItems}</tbody>
      );

    } catch(e) {
      console.log('boardList err', e);
    }
  } 
  dateTimeFormat(date) {
    return moment(date).format('YYYY.MM.DD');
  }
  // goDetail() {
  //   return href="#home"
  // } 
  handleConfirmPassword = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
    if (e.target.value !== '1234') {
      this.setState({
        pMessage: "패스워드가 일치하지 않습니다.",
        // password: '',
      }) //사용자가 입력한 값이 재확인 비번과 일치하지 않을 경우
    } else {
      this.setState({
        blindStyle: {
          width:'0%'
        }
        // password: '',
      }) //사용자가 입력한 값이 재확인 비번과 일치하지 않을 경우

    }
    console.log('password--', this.state.password);
  }

  render() {
    return (
      <div>
        {/* <Route path={`${this.props.pathInfo.url}/:type`} component={BoardDetail}/> */}
        <div className="clearfix content-btn-top mb-2">
         <CategorySeletctList location={this.props.location} categoryGroups={this.props.categoryGroups} isDisabled={true} groupType={this.props.groupType}/> 
         {this.state.writeButton}
          {/* <button type="button" className="btn btn-dark btn-sm btn-fr">
            <Link to={`${this.props.pathInfo.url}?groupType=${this.state.groupType}#write`} className="text-white" style={{textDecoration: 'none'}}>글쓰기</Link>
          </button> */}
        </div>
        <div className="card" style={{boxShadow: 'unset'}}>
          {this._setContents()}
          {/* {this.state.contentEl} */}
          {/* <Table striped bordered hover size="sm">
            <colgroup>
              <col width="20%"></col>
              <col width="65%"></col>
              <col width="15%"></col>
            </colgroup>
            <thead>
              <tr>
                <th>작성자</th>
                <th>글 제목</th>
                <th>작성일</th>
              </tr>
            </thead>
            {this.state.bodyEle}
          </Table> */}
        </div>
      
      </div>
    );
  }
};

export default PostList;