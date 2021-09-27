import React from 'react';
import loadable from '@loadable/component';
// import UserManagement from '../components/admin/UserManagement';
import ButtonSamples from '../components/animation/ButtonSamples';
import InputContents from '../components/login/InputContents';
import Emoji from '../components/ui/emoji/Emoji';
import LoaderSample from '../components/ui/progress/LoaderSample';
import LoaderSample2 from '../components/ui/progress/LoaderSample2';
import MaterialTable from '../components/lib/material-ui/MaterialTable';
const UserManagement = loadable(() => import('../components/admin/UserManagement'), {
  fallback: <div>loading..</div>
});
const emojiList = () => {
	let _elements = [];
	for (let i = 1; i < 30; i++) {
			_elements.push(
					<li key={i}>
							<Emoji type={'emoji-' + i} />
					</li>
			)
	}
	return _elements;
};
const Testing = (props) => {
  return (
    <div className="container">
      <UserManagement {...props} />
			{/* <MaterialTable /> */}
      <ButtonSamples />
			<LoaderSample />
			<LoaderSample2 />
      <main className="d-flex w-100">
		<div className="container d-flex flex-column">
			<div className="row vh-100">
				<div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
					<div className="d-table-cell align-middle">
						<div className="card">
							<div className="card-body">
								<ul className="emoji-icon-list">
									{emojiList()}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
    </div>
  )
}

export default Testing;