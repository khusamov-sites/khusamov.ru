import React, {Component} from 'react';
import {NextPageContext} from 'next';
import HttpStatus from 'http-status';
import ErrorLayout from '../layouts/ErrorLayout';

type TStatusCode = keyof HttpStatus;

interface IErrorProps {
	statusCode: TStatusCode;
	uri: string;
}

export default class ErrorPage extends Component<IErrorProps> {
	public static getInitialProps({req, res, err}: NextPageContext): IErrorProps {
		const statusCode: TStatusCode = (
			res && res.statusCode
				? res.statusCode as TStatusCode
				: err ? err.statusCode as TStatusCode : 404
		);
		const uri: string = (
			req
				? (req.url ? req.url : '')
				: location.href
		);
		return {statusCode, uri};
	}
	public render() {
		const {statusCode, uri} = this.props;
		const title: string = (
			statusCode === 404
				? `Страница ${uri} не найдена`
				: (
					statusCode in HttpStatus
						? String(HttpStatus[statusCode])
						: 'Произошла непредвиденная ошибка'
				)
		);
		return (
			<ErrorLayout title={title}>
				<p>{statusCode}: {title}.</p>
			</ErrorLayout>
		);
	}
}