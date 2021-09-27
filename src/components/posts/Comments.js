import React, { Component } from 'react';
import loadable from '@loadable/component';
import {isEmpty} from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import { toast } from "react-toastify";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
// import CreateIcon from '@material-ui/icons/Create';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
// import FavoriteIcon from '@material-ui/icons/Favorite';
// import DraftEditor from '../lib/editor/DraftEditor';
import { PostsApi, AxiosConfig as api } from '../../api';
import moment from 'moment';
const DraftEditor = loadable(() => import('../lib/editor/DraftEditor'), {
  fallback: <div>loading..</div>
});
moment.locale('ko');

const initialState = {
  dataList: [],
  content: '',
  editItem: {},
  editContent: '',
  placeholder: '댓글을 입력해주세요',
  isShowEditor: false,
}

class Comments extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.setContent = this.setContent.bind(this);
    this.setEditContent = this.setEditContent.bind(this);
    this.onRegistClick = this.onRegistClick.bind(this);
    this.editComent = this.editComent.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.onEditSave = this.onEditSave.bind(this);
    this.changedContent = this.changedContent.bind(this);
  }

  componentDidMount() {
    if(isEmpty(this.props.userInfo)) {
      this.setState({
        placeholder: '로그인을 해주세요.'
      })
    }
    this._getData();
  }
  componentWillUnmount() {
    this.setState(initialState)
  }
  _getData = async() => {
    try {
      const res = await api.getList(PostsApi.COMMENT_LIST, {id: this.props.postId});
      console.log('/api/posts/comment-list', res)
      if(res.length > 0) {
        res.map(d => d.isEditing = false);
      }
      this.setState({
        dataList: res,
        content: '',
        editItem: {},
        editContent: '',
        isShowEditor: true
      })
    } catch(e) {
      toast.error('error');
    }
  }
  onRegistClick() {
    this._registContent();
  }
  _contentStateInit() {
    this.setState({
      dataList: [],
      content: '',
      editItem: {},
      editContent: '',
      isShowEditor: false,
    });
  }
  async _registContent() {
    const now = new Date();
    const params = {
      userId: this.props.userInfo.id,
      postId: Number(this.props.postId),
      content: this.state.content,
      ip: this.props.ip,
      now: now,

    }
    await api.getPost(PostsApi.COMMENT_REGIST, params);
    this._contentStateInit();
    toast.success('저장되었습니다.');
    console.log('complete!');
    this._getData();
  }
  onEditSave(item) {
    if(isEmpty(this.state.editItem) || this.state.editItem.id !== item.id) {
      return;;
    }
    this._editContent();
  }
  async _editContent() {
    try {
      const editItem = this.state.editItem;
      const now = new Date();
      const params = {
        id: editItem.id,
        content: this.state.editContent,
        ip: this.props.ip,
        now: moment(now).format('YYYY-MM-DD HH:mm:ss'),
      }
      await api.getUpdate(PostsApi.COMMNET_UPDATE, params);
      toast.success('저장되었습니다.')
      console.log('complete!');
      this._getData();
  
    } catch(e) {
      toast.error('저장실패');
    }
  }
  deleteComment(item) {
    this._deleteComment(item);
  }
  async _deleteComment(item) {
    try {
      await api.getDelete(PostsApi.COMMENT_DELETE, {id: item.id, postId: item.post_id});
      // await axios.delete(`/api/comment/delete?id=${item.id}&postId=${item.post_id}`);
      toast.success('삭제되었습니다.')
      this._getData();
    } catch(e) {
      console.log(e)
    }
  }
 
  dateTimeFormat(date) {
    return moment(date).format('YYYY.MM.DD');
  }
  editComent(item) {
    console.log('editComent--',item);
    const itemList = this.state.dataList;
    itemList.map(d => {
      if(item.id === d.id) {
        d.isEditing = true;
      }
      return d;
    })
    this.setState({
      dataList: itemList,
      editItem: item,
      editContent: item.content
    })
  }
  changedContent(obj) {
    // let imageUrl = this.state.image;
    // if(!isEmpty(obj.image)) {
    //   imageUrl = `${process.env.REACT_APP_IMAGE_PATH}/${obj.image}`;
    // }
    this.setState({
      content: obj.content,
      // image: imageUrl
    });
  }
  setEditContent(obj) {
    this.setState({
      editContent: obj.content
    });
  }
  setContent(e) {
    this.setState({
      content: e.target.value
    });
  }

  render() {
    return (
      <div className="mt-20">
         <h5>댓글 {this.state.dataList.length}</h5>
          {this.state.dataList.map((data, index) => 
            <div key={index} className="mt-10">
              <div className="d-flex align-items-start">
                <img src={data.userImage} width="26" height="26" className="rounded-circle me-2" alt="" />
                <div className="flex-grow-1">
                  {/* <small className="float-end text-navy">5m ago</small> */}
                  <strong>{data.userName}</strong> 
                  <div style={{float: 'right'}}>
                    {data.isEditing &&
                      <IconButton aria-label="save" size="small" onClick={() => this.onEditSave(data)}>
                        <SaveIcon />
                      </IconButton>
                    }
                    <UpdateBtns item={data} userInfo={this.props.userInfo} onEdit={this.editComent} onDelete={this.deleteComment} />
                    <small className="text-muted">{this.dateTimeFormat(data.created_at)}</small>
                  </div>
                  <br />
                  {!data.isEditing &&
                    <div className="mt-10">
                      {/* <HtmlContent content={data.content} /> */}
                      <div dangerouslySetInnerHTML={ {__html: data.content} } />
                      {/* <CommunicationBtns /> */}
                    </div>
                  }
                  {data.isEditing &&
                    <div>
                    <DraftEditor
                      height="100px"
                      placeholder={this.state.placeholder}
                      editContent={this.state.editContent}
                      onTemperatureChange={this.setEditContent}
                      toolbarHidden={true}
                    />
                    </div>
                  }
                  

                </div>
              </div>
              <hr />
            </div>
          )}
          <div className="card box-shadow-02">
            {this.props.userInfo.username &&
            <div style={{padding: '10px 10px 0px 10px'}}>
              <img src={this.props.userInfo.app_image_url} width="26" height="26" className="rounded-circle me-2" alt="" />
              {this.props.userInfo.username}
            </div>
            }
            <div className="content-s">
              {this.state.isShowEditor &&
                <DraftEditor
                height="100px"
                placeholder={this.state.placeholder}
                editContent={this.state.content}
                onTemperatureChange={this.changedContent}
                toolbarHidden={true}
              />
              }
              <div className="bg-transparent border-light mt-10">
                <Button variant="outlined" size="small" className="btn-fr"
                disabled={!this.props.logged}
                onClick={this.onRegistClick}>등록</Button>
              </div>
            </div>
          </div>
      </div>
    )
  }
}
const HtmlContent = (props) => {
  return (
    <div dangerouslySetInnerHTML={ {__html: props.content} } />

  )
}
const UpdateBtns = (props) => {
  let cotent = '';
  if(props.item.writer_id === props.userInfo.id || props.userInfo.grade === 'MASTER') {
    cotent = <div>
    <IconButton aria-label="update" size="small" data-param={props.item.id} onClick={() => props.onEdit(props.item)}>
      <EditIcon />
    </IconButton>
    <IconButton aria-label="delete" size="small" onClick={() => props.onDelete(props.item)}>
      <DeleteIcon />
    </IconButton>
  </div>
  }
  return (
    <div className="inblock">
    {cotent}
    </div>
  )
}
const CommunicationBtns = (props) => {
return (
  <div className="top-line mt-10">
  <IconButton size="small">
    <InsertCommentIcon />
  </IconButton>
    <IconButton size="small">
    <FavoriteBorderIcon />
  </IconButton>
  </div>

)  
}

export default Comments;