import Home from "../views/common/Home";
import StudentTools from "../views/topLevel/StudentTools";
import {adminRoutes} from "./admin";

export interface RouteDefinition {
	name: string;
	path: string;
	exact: boolean;
	component: any;
	permissionKey?: string;
}

export const homeRoute = {
	name: "Home",
	path: "/",
	exact: true,
	component: Home
}

export const studentToolsRoute = {
	name: "Tools",
	path: "/stutools",
	exact: true,
	component: StudentTools
}

export const statsRoute = {
	name: "Statistics",
	path: "/stats",
	exact: false,
	component: Home
}

export const indexRoutes = [statsRoute, studentToolsRoute, homeRoute];

export const routes = [...adminRoutes, ...indexRoutes];