import React, { Component } from 'react';
import axios from 'axios';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { toast } from "react-toastify";
import { isEmpty } from 'lodash';

class AdminContents extends Component {
  constructor(props) {
    console.log('AdminContents props--', props);
    super(props);
    this.state  = {
      category1: [],
      category2: [],
      category3: [],
      pNode1: '',
      pNode2: '',
      pNode3: '',
      categoryName1: '',
      categoryName2: '',
      categoryName3: '',
      categoryCd1: '',
      categoryCd2: '',
      categoryCd3: '',
      categoryUse1: '',
      categoryUse2: '',
      categoryUse3: '',
      classes: '',
    };
    this.classes = null;
    this._handleChange = this._handleChange.bind(this)
    this.textHandleChange = this.textHandleChange.bind(this);
    this.onAddClick = this.onAddClick.bind(this);
    this.onModifyClick = this.onModifyClick.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.radioHandleChange = this.radioHandleChange.bind(this);
 }
  componentDidMount() {
    this.setState({
      classes: makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
          minWidth: 120,
        },
      })),
    })
    // this.classes = this.useStyles();
    this._getCategory();
  }
  useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));
  _fieldReset() {
    this.setState({
      category1: [],
      category2: [],
      category3: [],
      pNode1: '',
      pNode2: '',
      pNode3: '',
      categoryCd1: '',
      categoryCd2: '',
      categoryCd3: '',
      categoryName1: '',
      categoryName2: '',
      categoryName3: '',
      categoryUse1: '',
      categoryUse2: '',
      categoryUse3: '',
    })
  }
  
  async _getCategory () {
    try {
      const res = await axios.get(`/api/category-group`);
      this.setState({
        category1: res.data.result
      })
    } catch(e) {
      console.log(e);
    }
  }
  _handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
    if(event.target.name !== 'pNode3') {
      this._getSubCategory(event.target.value);
    }
    this._setFieldValue(event.target.name, event.target.value);
  }
  textHandleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  radioHandleChange =  (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  _setFieldValue(name, value) {
    let targetItem = null;
    let targetList = null;
    let targetCode = null;
    let targetNm = null;
    let targetInputNm = null;
    if (name === 'pNode1') {
      targetList = this.state.category1;
      targetNm = 'categoryUse1';
      targetCode = 'categoryCd1';
      targetInputNm = 'categoryName1';
    } else if (name === 'pNode2') {
      targetList = this.state.category2;
      targetNm = 'categoryUse2';
      targetCode = 'categoryCd2';
      targetInputNm = 'categoryName2';
    } else if (name === 'pNode3') {
      targetList = this.state.category3;
      targetNm = 'categoryUse3';
      targetCode = 'categoryCd3';
      targetInputNm = 'categoryName3';
    }
    targetItem = targetList.find(d => d.node_id === value);
    this.setState({
      [targetNm]: targetItem.use_yn,
      [targetInputNm]: targetItem.node_nm,
      [targetCode]: targetItem.node_code,
    })
  }
 
  async _getSubCategory (pNodeId) {
    try {
      const res = await axios.get(`/api/category-sub-group?pNodeId=${pNodeId}`);
      if(!isEmpty(res.data.result)) {
        if(res.data.result[0].depth === 1) {
          this.setState({
            category2: res.data.result,
          })
        } else {
          this.setState({
            category3: res.data.result
          })
        }
      }
    } catch(e) {
      console.log(e);
    }
  }
  onAddClick = (event) => {
    this._registCategoryGroup(event.currentTarget.name);
  }
  onModifyClick = (event) => {
    this._updateCategoryGroup(event.currentTarget.name);
  }
  onDeleteClick = (event) => {
    // this._registCategoryGroup(event.currentTarget.name);
  }
  async _registCategoryGroup(type) {
    try {
      let pNodeId = 0;
      let nodeCode = this.state.categoryCd1;
      let nodeName = this.state.categoryName1;
      let nodePath =  this.state.categoryName1;
      let useYN =  this.state.categoryUse1;
      let depth = 0;
      if (type === 'category2') {
        pNodeId = this.state.pNode1;
        nodeCode = this.state.categoryCd2;
        nodeName = this.state.categoryName2;
        useYN =  this.state.categoryUse2;
        nodePath = ``;
        depth = 1;
      } else if (type === 'category3') {
        pNodeId = this.state.pNode2;
        nodeCode = this.state.categoryCd3;
        nodeName = this.state.categoryName3;
        useYN =  this.state.categoryUse3;
        nodePath = ``;
        depth = 2;
      }
      if(isEmpty(nodeName) || pNodeId === "") {
        toast.error('Empty Data')
        return;
      }
      const params = {
        pNodeId,
        nodeCode,
        nodeName,
        nodePath,
        depth,
        useYN
      }
      await axios.post('/api/regist-category', params);
      await axios.post('/api/update-sub-yn', {pNodeId, subYN: 'Y'});
      this._fieldReset();
      this._getCategory();
      toast.success('저장되었습니다.')

    } catch(e) {
      toast.error('저장실패');
      console.log(e)
    }

  }
  async _updateCategoryGroup(type) {
    try {
      let nodeId = this.state.pNode1;
      let nodeCode = this.state.categoryCd1;
      let nodeName = this.state.categoryName1;
      let useYN =  this.state.categoryUse1;
      if (type === 'category2') {
        nodeId = this.state.pNode2;
        nodeCode = this.state.categoryCd2;
        nodeName = this.state.categoryName2;
        useYN =  this.state.categoryUse2;
      } else if (type === 'category3') {
        nodeId = this.state.pNode3;
        nodeCode = this.state.categoryCd3;
        nodeName = this.state.categoryName3;
        useYN =  this.state.categoryUse3;
      }
      await axios.post('/api/modify-category', {nodeId, nodeCode, nodeName, useYN});
      toast.success('저장되었습니다.')

    } catch(e) {
      toast.error('저장실패');
      console.log(e)
    }

  }
  render() {
    return (
      <div>
        <FormControl className={this.state.classes.formControl} style={{marginRight: '20px'}}>
          <InputLabel id="pNode1">Category1</InputLabel>
          <Select
            labelId="pNode1"
            id="pNode1"
            name="pNode1"
            value={this.state.pNode1}
            onChange={this._handleChange}
          >
            {this.state.category1.map((item) => 
              <MenuItem key={item.node_id} value={item.node_id}>
              {item.node_nm}
            </MenuItem>
            )}
          </Select>
          <TextField
            label="메뉴구분 코드"
            name="categoryCd1"
            value={this.state.categoryCd1}
            onChange={this.textHandleChange} />
          <TextField
            label="메뉴구분명"
            name="categoryName1"
            value={this.state.categoryName1}
            onChange={this.textHandleChange} />
          <RadioGroup row aria-label="사용여부" name="categoryUse1" value={this.state.categoryUse1} onChange={this.radioHandleChange}>
            <FormControlLabel value="Y" control={<Radio color="primary" />} label="사용" />
            <FormControlLabel value="N" control={<Radio color="primary" />} label="미사용" />
          </RadioGroup>
          <Button name="category1" onClick={this.onAddClick}>Add</Button>
          <Button name="category1" onClick={this.onModifyClick}>Modify</Button>
          <Button name="category1" onClick={this.onDeleteClick}>Delete</Button>
        </FormControl>
        <FormControl className={this.state.classes.formControl} style={{marginRight: '20px'}}>
          <InputLabel id="pNode2">Category2</InputLabel>
          <Select
            labelId="pNode2"
            id="pNode2"
            name="pNode2"
            value={this.state.pNode2}
            onChange={this._handleChange}
          >
            {this.state.category2.map((item) => 
              <MenuItem key={item.node_id} value={item.node_id}>
                {item.node_nm}
              </MenuItem>
            )}
          </Select>
          <TextField
            label="메뉴코드1depth"
            name="categoryCd2"
            value={this.state.categoryCd2}
            onChange={this.textHandleChange} />
          <TextField
            label="메뉴명1depth"
            name="categoryName2"
            value={this.state.categoryName2}
            onChange={this.textHandleChange} />
          <RadioGroup row aria-label="사용여부" name="categoryUse2" value={this.state.categoryUse2} onChange={this.radioHandleChange}>
            <FormControlLabel value="Y" control={<Radio color="primary" />} label="사용" />
            <FormControlLabel value="N" control={<Radio color="primary" />} label="미사용" />
          </RadioGroup>
          <Button name="category2" onClick={this.onAddClick}>Add</Button>
          <Button name="category2" onClick={this.onModifyClick}>Modify</Button>
          <Button name="category2" onClick={this.onDeleteClick}>Delete</Button>
        </FormControl>
        <FormControl className={this.state.classes.formControl}>
          <InputLabel id="pNode3">Category3</InputLabel>
          <Select
            labelId="pNode3"
            id="pNode3"
            name="pNode3"
            value={this.state.pNode3}
            onChange={this._handleChange}
          >
            {this.state.category3.map((item) => 
              <MenuItem key={item.node_id} value={item.node_id}>
              {item.node_nm}
            </MenuItem>
            )}
          </Select>
          <TextField
            label="메뉴코드2depth"
            name="categoryCd3"
            value={this.state.categoryCd3}
            onChange={this.textHandleChange} />
          <TextField
            label="메뉴2depth"
            name="categoryName3"
            value={this.state.categoryName3}
            onChange={this.textHandleChange} />
          <RadioGroup row aria-label="사용여부" name="categoryUse3" value={this.state.categoryUse3} onChange={this.radioHandleChange}>
            <FormControlLabel value="Y" control={<Radio color="primary" />} label="사용" />
            <FormControlLabel value="N" control={<Radio color="primary" />} label="미사용" />
          </RadioGroup>
          <Button name="category3" onClick={this.onAddClick}>Add</Button>
          <Button name="category3" onClick={this.onModifyClick}>Modify</Button>
          <Button name="category3" onClick={this.onDeleteClick}>Delete</Button>
        </FormControl>
      </div>
    )
  } 
}

export default AdminContents;