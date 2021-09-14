import axios from 'axios';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import SimpleBar from "simplebar";
import Particle from '../animation/Particle';
// import CoffeeMachine from '../animation/CoffeeMachine';
import * as _ from 'lodash';
function MenuPostCategory(props) {
  const {headerInfo, menuInfo, isMasterUser} = props;
  if(!isMasterUser && (menuInfo.use_yn === 'N' || headerInfo.use_yn === 'N')) {
    return null;
  }
  if(menuInfo.sub.length === 0) {
    return <NavLink to={`/posts?groupType=${menuInfo.node_code}`}
    isActive={(match, location) => {
      if(location.search.indexOf(menuInfo.node_code) > -1) {
        return true;
      } else {
        return false;
      }
    }}
    className="sidebar-item" activeClassName="active">
      <li className="sidebar-link">
          <span className="align-middle">{menuInfo.node_nm}</span>
      </li>
  </NavLink>
  } else if(menuInfo.sub.length > 0){
    return <li className="sidebar-item">
    <a data-bs-target={`#${headerInfo.node_code}`} data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">
      <span className="align-middle">{menuInfo.node_nm} </span>
    </a>
    <ul id={headerInfo.node_code} className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
      {menuInfo.sub.map((sub, index) => 
          <SubCategory key={index} menuInfo={menuInfo} sub={sub} isMasterUser={isMasterUser} />
                        // <NavLink key={index} to={{pathname:`/posts`, search:`?groupType=${sub.node_code}`, state:menuInfo.node_code}} 
        //   className="sidebar-item"
        //   isActive={(match, location) => {
        //     console.log('match, location', match, location)
        //     if(location.search.indexOf(sub.node_code) > -1) {
        //       return true;
        //     } else {
        //       return false;
        //     }
        //   }}
        //   > 
        //   <li className="sidebar-link">
        //     <span className="align-middle">{sub.node_nm}</span>
        //   </li>
        // </NavLink>
      )}
    </ul>
  </li>
  }
}
function SubCategory(props) {
  const { menuInfo, sub, isMasterUser} = props;
  if(!isMasterUser && sub.use_yn === 'N') {
    return null;
  } else {
    return <NavLink to={{pathname:`/posts`, search:`?groupType=${sub.node_code}`, state:menuInfo.node_code}} 
      className="sidebar-item"
      isActive={(match, location) => {
        console.log('match, location', match, location)
        if(location.search.indexOf(sub.node_code) > -1) {
          return true;
        } else {
          return false;
        }
      }}
      > 
      <li className="sidebar-link">
        <span className="align-middle">{sub.node_nm}</span>
      </li>
    </NavLink>
  }
}
function MenuSingleCategory(props) {
  const {headerInfo, menuInfo, isMasterUser} = props;
  if(!isMasterUser && (menuInfo.use_yn === 'N' || headerInfo.use_yn === 'N')) {
    return null;
  } else {
    return <NavLink exact to={`/${menuInfo.node_code}`} className="sidebar-item" activeClassName="active"> 
    <li className="sidebar-link">
      <span className="align-middle">{menuInfo.node_nm}</span>
    </li>
  </NavLink>
  }
}
function MenuHeader(props) {
  const {menuInfo, isMasterUser} = props;
  if(!isMasterUser && menuInfo.use_yn === 'N') {
    return null;
  } else {
    return <li className="sidebar-header">{menuInfo.node_nm}</li>
  }
}
class NavSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '', // 첫번째 비밀번호
      rePassword: '', // 두번째 비밀번호
      pMessage:'', // 확인 메시지 (비밀번호 일치여부를 사용자에게 알려주는 메시지)
      show: false,
      categoryList: [],
    };
  }

  componentDidMount() {
    this.initialize();
    this._getCategory();
  }

  initialize = () => {
    this.initializeSimplebar();
    this.initializeSidebarCollapse();
  }

  initializeSimplebar = () => {
    const simplebarElement = document.getElementsByClassName("js-simplebar")[0];
  
    if(simplebarElement){
      const simplebarInstance = new SimpleBar(document.getElementsByClassName("js-simplebar")[0]);
  
      /* Recalculate simplebar on sidebar dropdown toggle */
      const sidebarDropdowns = document.querySelectorAll(".js-sidebar [data-bs-parent]");
      
      sidebarDropdowns.forEach(link => {
        link.addEventListener("shown.bs.collapse", () => {
          simplebarInstance.recalculate();
        });
        link.addEventListener("hidden.bs.collapse", () => {
          simplebarInstance.recalculate();
        });
      });
    }
  }
  
  initializeSidebarCollapse = () => {
    const sidebarElement = document.getElementsByClassName("js-sidebar")[0];
    const sidebarToggleElement = document.getElementsByClassName("js-sidebar-toggle")[0];
  
    if(sidebarElement && sidebarToggleElement) {
      sidebarToggleElement.addEventListener("click", () => {
        sidebarElement.classList.toggle("collapsed");
  
        sidebarElement.addEventListener("transitionend", () => {
          window.dispatchEvent(new Event("resize"));
        });
      });
    }
  }
  async _getCategory () {
    try {
      const res = await axios.get(`/api/category-all`);
      const groups = _.groupBy(res.data.result, 'depth');
      const uniqLen = _.uniqBy(res.data.result, 'depth').length;
      let depth0 = [];
      let depth1 = [];
      let depth2 = [];
      for(let i = 0; uniqLen > i; i++) {
        const firstItem = groups[i][0];
        if(firstItem.depth === 0) {
          depth0 = groups[i];
        } else if (firstItem.depth === 1) {
          depth1 = groups[i];
        } else if (firstItem.depth === 2) {
          depth2 = groups[i];
        }
      }
      const categoryList = [];
      depth0.forEach(item => {
        const tempObj = {
          item,
        };
        const tmpArr1 = depth1.filter(d => d.pnode_id === item.node_id);
        tmpArr1.map(r => {
          const subList = depth2.filter(d => d.pnode_id === r.node_id);
          r.sub = subList;
          return r;
        })
        const obj = Object.assign(tempObj.item, {category: tmpArr1});
        categoryList.push(obj);
      })
      // const stateGroups = {
      //   depth0,
      //   depth1,
      //   depth2
      // }
      this.props.setCaterotyGroups(categoryList.find(d => d.node_code === 'posts'));
      this.setState({
        categoryList: categoryList
      })
    } catch(e) {
      console.log('_getCategory error', e);
    }
  }

  render() {
    return (
      <nav id="sidebar" className="sidebar js-sidebar">
			<div className="sidebar-content js-simplebar" style={{fontFamily: 'STIX Two Text', fontSize: '15px'}}>
      <NavLink exact to="/" className="sidebar-brand">
        <span className="align-middle">Minju's Blog</span>
      </NavLink>
				<ul className="sidebar-nav">
            {this.state.categoryList && this.state.categoryList.map((info, index) =>
              <div key={index}>
                <MenuHeader menuInfo={info} isMasterUser={this.props.isMasterUser} />
                {info.category.length > 0 && 
                  info.category.map((menu, index) => 
                    <div key={index}>
                      {info.node_code === 'posts' &&
                        <MenuPostCategory headerInfo={info} menuInfo={menu} isMasterUser={this.props.isMasterUser} />
                      }
                      {info.node_code !== 'posts' &&
                        <MenuSingleCategory headerInfo={info} menuInfo={menu} isMasterUser={this.props.isMasterUser} />
                      }
                    </div>
                  )
                }
                </div>
            )}
				</ul>
        {/* <div className="sidebar-cta">
					<div className="sidebar-cta-content">
						<CoffeeMachine />
					</div>
				</div> */}

			</div>
		</nav>
    )
  }
}

export default NavSidebar;
