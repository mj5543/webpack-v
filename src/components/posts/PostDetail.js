import React, { Component } from 'react';
import loadable from '@loadable/component';
import Modal from 'react-bootstrap/Modal'
// import { uploadFile } from 'react-s3';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isEmpty } from 'lodash';
import queryString from 'query-string';
// import ToastUIEditor from '../lib/editor/ToastUIEditor';
import * as userActions from "../../redux/modules/users";
import { toast } from "react-toastify";
import CategorySeletctList from './CategorySeletctList';
import Comments from './Comments';
import { PostsApi, AxiosConfig as api } from '../../api';
import {BasicSpinner} from '../ui/progress/LoaderSample';
// import DraftEditor from '../lib/editor/DraftEditor';
// const ToastUIEditor = React.lazy(() => import('../lib/editor/ToastUIEditor'));
const ToastUIEditor = loadable(() => import('../lib/editor/ToastUIEditor'), {
  fallback: <div>loading..</div>
});
const DraftEditor = loadable(() => import('../lib/editor/DraftEditor'), {
  fallback: <div>loading..</div>
});

const initialState = {
  title: '',
  content: '',
  file: null,
  image: '',
  email: '',
  commentCnt: 0,
  editContent: '',
  mode: 'read',
  saveButtonText: '수정',
  actionButtonText: '목록',
  id: '',
  modalShow: false,
  updateBtnEl: '',
  deleteBtnEl: '',
  isDisabledCategoty: true,
  isLoading: true,
};

class PostDetail extends Component {
  constructor(props) {
    console.log('PostDetail props--', props, process.env);
    super(props);
    this.state = initialState;
    // this.childRef = useRef();
    // this.callChildFunc = useCallback(() => {
    //   console.log(childRef.current.getAlert()); // 자식 컴포넌트 함수 호출
    //   console.log(childRef.current.getRowId()); // 자식 컴포넌트 데이터 가져오기
    // });
    this.modeChange = this.modeChange.bind(this);
    this.actionModeChange = this.actionModeChange.bind(this);
    this.changedContent = this.changedContent.bind(this);
    this.deletePost = this.deletePost.bind(this);
    // this.titleChanged = this.titleChanged.bind(this);
  }
  componentDidMount() {
    const {location, history} = this.props;
    //TODO
    const query = queryString.parse(location.search);
    // if(!state){
    //   history.push('/');
    // }
    console.log('PostDetail - componentDidMount ::', location, history, query);
    if(!isEmpty(location.hash) && location.hash === '#write' && isEmpty(this.props.userInfo)) {
      history.push('/auth/login');
    }

    this.setState({groupType: query.groupType});
    // if(!isEmpty(this.props.location.state) && this.props.location.state.groupType) {
    //   this.setState({groupType: query.groupType});
    // }

    if(this.props.postId) {
      this._getData();
    } else {
      const updateBtnEl = <button type="button" className="btn btn-dark btn-sm btn-fr ms-1" onClick={this.modeChange}>저장</button>;
      this.setState({
        mode: 'modify',
        saveButtonText: '저장',
        actionButtonText: '취소',
        updateBtnEl: updateBtnEl,
        isDisabledCategoty: false,
        isLoading: false
      })
    }
  }
  componentWillUnmount() {
    this.setState(initialState)
  }
  _getData = async() => {
    this.setState({isDisabledCategoty: true});
    const res = await api.getList(PostsApi.POST_DETAIL, {id: this.props.postId});
    console.log('PostsApi.POST_DETAIL', PostsApi.POST_DETAIL, res)
    let deleteBtnEl = '';
    let updateBtnEl = '';
    if(res.length > 0) {
      // updateBtnEl = <button type="button" className="btn btn-dark btn-sm float-end ms-1" onClick={this.modeChange}>{this.state.saveButtonText}</button>;
      if(!isEmpty(this.props.userInfo) && (this.props.userInfo.email === res[0].email || this.props.userInfo.grade === 'MASTER')) {
        updateBtnEl = <button type="button" className="btn btn-dark btn-sm btn-fr ms-1" onClick={this.modeChange}>{this.state.saveButtonText}</button>;
        deleteBtnEl = <button type="button" className="btn btn-dark btn-sm btn-fr ms-1" onClick={this.deletePost}>삭제</button>;
      }
      document.title = res[0].subject;
      this.setState({
        title: res[0].subject,
        content: res[0].content,
        id: res[0].id,
        image: res[0].image,
        email: res[0].email,
        commentCnt: res[0].comment_cnt,
        updateBtnEl: updateBtnEl,
        deleteBtnEl: deleteBtnEl,
        isLoading: false,
      }) 
    
    }
  }
  async deletePost() {
    try {
      await api.getDelete(PostsApi.DELETE_POST, {id: this.props.postId});
      this.props.history.push({pathname: '/posts', search: `?groupType=${this.state.groupType}`});
      toast.success('삭제되었습니다.')
    } catch(e) {
      console.log(e)
    }

  }
 
  changedContent(obj) {
    let imageUrl = this.state.image;
    if(!isEmpty(obj.image)) {
      imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/${obj.image}`;
    }
    this.setState({
      content: obj.content,
      image: imageUrl
    });
  }
  actionModeChange() {
    const {history} = this.props;
    if(this.state.actionButtonText === '목록') {
      // history.push(this.props.matchUrl);
      history.push({pathname: '/posts', search: `?groupType=${this.state.groupType}`, state: this.props.location.state});
    } else {
      this.setModalShow(true);
    }
  }
  goList() {
    const {history} = this.props;
    this.setModalShow(false);
    history.push({pathname: '/posts', search: `?groupType=${this.props.groupType}`, state: this.props.location.state});
  
  }
  modeChange() {
    if(this.state.mode === 'read') {
      this.setState({
        mode: 'modify',
        saveButtonText: '저장',
        isDisabledCategoty: false
      })
    } else {
      if(this.props.isRegist) {
        this._registContent();
      } else {
        this._updateContent();
      }
    }
  }  
  titleChanged = (e) => {
    this.setState({
      title: e.target.value
    })
  }
  _contentValidation() {
    if(isEmpty(this.state.title)) {
      toast.error("글 제목을 입력하세요.");
      return false;
    }
    if(isEmpty(this.state.content)) {
      toast.error("내용을 입력하세요.");
      return false;
    }
    const newText = this.state.content.replace(/(<([^>]+)>)/ig,"");
    if(newText.length < 30 && this.state.groupType !== 'GALLERY') {
      toast.error("내용을 30자 이상 입력하세요.");
      return false;
    }
    return true;
  }
  async _registContent() {
    if(!this._contentValidation()) {
      return;
    }
    const now = new Date();
    const params = {
      name: this.props.userInfo.username,
      email: this.props.userInfo.email,
      password: '',
      subject: this.state.title,
      content: this.state.content,
      ip: this.props.ipInfo.IPv4,
      created_at: now,
      groupType: this.state.groupType,
      image: this.state.image

    }
    await api.getPost(PostsApi.REGIST_POST, params);
    toast.success('저장되었습니다.')
    console.log('complete!');
    const {history} = this.props;
    history.push({pathname: this.props.matchUrl, search: `?groupType=${this.state.groupType}`, state: this.props.location.state});
    // history.push(`${this.props.matchUrl}?groupType=${this.state.groupType}`);
  }
  async _updateContent() {
    // const params = {
    //   title: this.state.title,
    //   content: this.state.content,
    //   id: this.state.id,
    //   file: this.state.file
    // }
    // const formData = new FormData();
    // formData.append(`name`, this.props.userInfo.username);
    // formData.append(`email`, this.props.userInfo.email);
    // formData.append(`file`, this.state.file);
    // formData.append(`title`, this.state.title);
    // formData.append(`content`, this.state.content);
    // formData.append(`ip`, this.props.ipInfo.IPv4);
    // formData.append(`id`, this.state.id);
    // formData.append(`image`, this.state.image);
    // const config = {
    //   headers: {
    //     'content-type': 'multipart/form-data'
    //   }
    // }
    const params = {
      name: this.props.userInfo.username,
      email: this.props.userInfo.email,
      groupType: this.state.groupType,
      file: this.state.file,
      title: this.state.title,
      content: this.state.content,
      ip: this.props.ipInfo.IPv4,
      id: this.state.id,
      image: this.state.image
    }
    await api.getUpdate(PostsApi.UPDATE_POST, params);
    this.setState({
      mode: 'read',
      saveButtonText: '수정'
    });
    this._getData();
    toast.success('저장되었습니다.');
    console.log('complete!');
  }
  _editorElement() {
    let editEl;
    if(this.state.groupType === 'GALLERY') {
      editEl = 
        <DraftEditor
          height="100vh"
          editContent={this.state.content}
          onTemperatureChange={this.changedContent}
          toolbarHidden={false}
          placeholder='내용을 입력해주세요'
        />

    } else {
      editEl =
       <ToastUIEditor
        editContent={this.state.content}
        onTemperatureChange={this.changedContent}
        />
    }
    return <div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="inputGroup-sizing-default">Title</span>
                <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" 
                  value={this.state.title}
                  onChange={this.titleChanged}
                />
              </div>
              {editEl}
          </div>
  }

  setModalShow(isShow) {
    this.setState({
      modalShow: isShow
    })
  }
  setCurrentGroupType(group) {
    this.setState({groupType: group});
  }
  getContents() {
    let contentElement;
    // if(this.state.isLoading) {
    //   contentElement = <BasicSpinner />
    // } else 
    if(this.state.mode !== 'read') {
      contentElement = this._editorElement();
    } else {
      contentElement = <div>
        <div style={{marginBottom: '20px'}}><h2>{this.state.title}</h2></div>
        <div dangerouslySetInnerHTML={ {__html: this.state.content} } />
        {/* 댓글 {this.state.commentCnt} */}
        <Comments ip={this.props.ipInfo.IPv4}
          userInfo={this.props.userInfo}
          postId={this.props.postId}
          logged={this.props.logged}
          commentCnt={this.state.commentCnt} />
        </div>;
    }
    return contentElement;
  }
  render(){
    return (
      <div>
        <BasicSpinner isShow={this.state.isLoading} />
        <div className="clearfix mb-2">
        <CategorySeletctList 
          location={this.props.location} 
          categoryGroups={this.props.categoryGroups} 
          isDisabled={this.state.isDisabledCategoty} 
          groupType={this.props.groupType}
          changedGroupCB={(code) => this.setCurrentGroupType(code)}
        /> 
          {this.state.deleteBtnEl}
          {this.state.updateBtnEl}
          <button type="button" className="btn btn-dark btn-sm btn-fr ms-1" onClick={this.actionModeChange}>{this.state.actionButtonText}</button>
        </div>
        {this.getContents()}
        <MyVerticallyCenteredModal
          show={this.state.modalShow}
          // onHide={() => this.setModalShow(false)}
          onHideConfirm={() => this.goList()}
        />
        {/* <div dangerouslySetInnerHTML={ {__html: this.state.content} }></div> */}
      </div>
    )
  }
}
function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header> */}
      <Modal.Body>
        <h4>글 작성 취소</h4>
        <p>
          글 작성을 취소하시겠습니까?
        </p>
      </Modal.Body>
      <Modal.Footer>
      <button type="button" className="btn btn-dark btn-sm btn-fr ms-1" onClick={props.onHide}>취소</button>
        <button type="button" className="btn btn-dark btn-sm btn-fr ms-1" onClick={props.onHideConfirm}>확인</button>
        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}
const mapStateToProps = state => ({
  logged: state.users.logged,
  userInfo: state.users.userInfo,
  ipInfo: state.users.ipInfo
});
const mapDispatchToProps = dispatch => {
  return {
    getIpInfo: () => dispatch(userActions.actionCreators.getIpInfo())
  };
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PostDetail)
);
// export default PostDetail;