import React from 'react';
import { Route } from 'react-router-dom';

export interface CPTRouteProps {
	path: string;
	component: any;
}

const TTURoute = (props: CPTRouteProps) => {
	let { component: Component, ...rest } = props;

	return (
		<Route
			{ ...rest }
			render={props => {
				return <Component {...props} />;
			}}
		/>
	);
}

export default TTURoute;