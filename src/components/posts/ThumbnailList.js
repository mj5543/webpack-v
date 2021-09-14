import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import {isEmpty} from 'lodash';
import 'bootstrap/dist/css/bootstrap.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { makeStyles } from '@material-ui/core/styles';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import ImageListItemBar from '@material-ui/core/ImageListItemBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  imageList: {
    // width: 500,
    height: 450,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

class ThumbnailList extends Component {
  constructor() {
    super();
    this.state = {
      imageList: []
    }
  }

  componentDidMount() {
    this.setState({
      imageList: this.props.dataList
    })
  }
  // componentWillUnmount() { 
  // }

  render() {
    return (
      <div>
        {/* <CardImageList imageList={this.state.imageList} /> */}
        <ImageItemList imageList={this.state.imageList} />
      </div>
    )
  }
}
function getPreText(item) {
  let contentText = item.content;
  contentText = contentText.replace(/<IMG(.*?)>/gi, '');
  contentText = contentText.replace(/(<([^>]+)>)/ig,"");
  contentText = contentText.replace(/\r\n|\n/g, '');
  return contentText;
}

const CardImageList = (props) => {
  return (
    <Row xs={2} md={6} className="g-3">
      {props.imageList.map((data,index) =>
         <Col key={index}>
         <Card style={{width:'100%'}}>
           <Card.Header style={{fontFamily: 'GothicB'}}>
             <h5>{data.subject}</h5>
           </Card.Header>
           <Link to={{pathname:`/posts/detail`, search: `?id=${data.id}&groupType=${data.group_type}`}} className="btn-text-s">
             <img src={data.image} className="card-img" alt="" style={{maxHeight: ''}} />
           </Link>
           <Card.Body>
             <Card.Text className="card-short-text">
               {getPreText(data)}
             </Card.Text>
           </Card.Body>
           
         </Card>
       </Col>
    )}
   </Row>
  )

}
const ImageItemList = (props) => {
  const classes = useStyles();
  return (
    // <div className={classes.root}>
    <Row xs={2} md={6} className="g-3">
      {props.imageList.map((data,index) =>
         <Col key={index}>
          <ImageListItem key={data.image} style={{height: '180px', listStyle: 'none'}}>
            <Link to={{pathname:`/posts/detail`, search: `?id=${data.id}&groupType=${data.group_type}`}} className="btn-text-s">
              <img src={data.image} className="card-img" alt={data.subject} style={{maxHeight: ''}} />
           </Link>
            {/* <img src={data.image} className="card-img" alt={data.subject} /> */}
            <ImageListItemBar
              title={data.subject}
              subtitle={<span>by: {data.name}</span>}
              actionIcon={
                <IconButton aria-label={`info about ${data.subject}`} className={classes.icon}>
                  <InfoIcon />
                </IconButton>
              }
            />
          </ImageListItem>

       </Col>
    )}
   </Row>
    // </div>
  );
}

export default ThumbnailList;