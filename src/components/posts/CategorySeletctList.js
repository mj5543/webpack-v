import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { isEmpty } from 'lodash';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    // marginTop: theme.spacing(2),
  },
}));

const CategorySeletctList = (props) => {
  console.log('CategorySeletctList--', props);
  const classes = useStyles();
  const [state, setState] = React.useState({
    depth1: '',
    depth2: '',
    depth1List: [],
    depth2List: [],
  });
  useEffect(() => {
    if(isEmpty(props.categoryGroups)) {
      return;
    }
    let targetCode = props.groupType;
    let depth2 = '';
    if(!isEmpty(props.location.state)) {
      targetCode = props.location.state;
      depth2 = props.groupType;
    }
    let findCode = targetCode;
    if(targetCode instanceof Object ) {
      findCode = depth2
    }
    let targetCategory = props.categoryGroups.category.find(d => d.node_code === findCode);
    if(isEmpty(targetCategory)) {
      props.categoryGroups.category.forEach(item => {
        item.sub.forEach(d => {
          if(d.node_code === findCode) {
            targetCategory = item;
          }
        })
      })
    }
    if(isEmpty(targetCategory)) {
      return;
    }
    setState({
      ...state,
      depth1List: props.categoryGroups.category,
      depth1: targetCategory.node_code,
      depth2List: targetCategory.sub,
      depth2
    });

	}, [props.groupType])

  const handleChange = (event) => {
    const name = event.target.name;
    const targetCategory = props.categoryGroups.category.find(d => d.node_code === event.target.value);
    let depth2 = '';
    let sub = state.depth2List;
    let cbCode = event.target.value;
    if(name === 'depth1') {
      sub = targetCategory.sub;
      if(!isEmpty(sub)) {
        depth2 = sub[0].node_code
      }
    } else {
      depth2 = event.target.value
    }
    if(!isEmpty(depth2)) {
      cbCode = depth2
    }
    setState({
      ...state,
      [name]: event.target.value,
      depth2List: sub,
      depth2
    });
    if(props.hasOwnProperty('changedGroupCB')) {
      // let cbCode = state.depth1;
      // if(!isEmpty(state.depth2)) {
      //   cbCode = state.depth2
      // }
      props.changedGroupCB(cbCode);
    }
  };

  return (
    <div style={{width: '50%', float: 'left'}}>
      
      <FormControl className={classes.formControl} disabled={props.isDisabled}>
        <NativeSelect
          value={state.depth1}
          onChange={handleChange}
          name="depth1"
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'depth1' }}
        >
          {state.depth1List.map((item, index) => 
            <option key={index} value={item.node_code}>{item.node_nm}</option>
          )}
         
        </NativeSelect>
      </FormControl>
      <FormControl className={classes.formControl} disabled={props.isDisabled}>
        <NativeSelect
          value={state.depth2}
          onChange={handleChange}
          name="depth2"
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'depth2' }}
        >
          {state.depth2List.map((item, index) => 
            <option key={index} value={item.node_code}>{item.node_nm}</option>
          )}
        </NativeSelect>
      </FormControl>
     
    </div>
  );
}
export default CategorySeletctList;