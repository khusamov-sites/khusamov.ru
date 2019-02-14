import React, {Component, Fragment} from 'react';
import {Helmet} from "react-helmet";
import Menu from '../components/Menu';

interface IRegularLayoutProps {
	title: string;
}

// Вместо Helmet можно заюзать next/head.
// https://nextjs.org/docs#populating-head
// https://github.com/zeit/next.js/blob/master/examples/with-typescript/components/Layout.tsx

export default class RegularLayout extends Component<IRegularLayoutProps> {
	render() {
		return (
			<Fragment>
				<Helmet>
					<title>{this.props.title}</title>
				</Helmet>

				<Menu/>

				<h1>{this.props.title}</h1>
				{this.props.children}
			</Fragment>
		);
	}
}