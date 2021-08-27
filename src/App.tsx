import React, { useEffect, useState } from 'react';

import { BrowserRouter } from 'react-router-dom';
import SidebarLayout from './layouts/SidebarLayout';

import InitializationScreen from './components/common/InitializationScreen';
import Login from './views/common/Login';

import './assets/scss/ttu.scss';
import './assets/antd/ttu-theme.css';
import { message } from 'antd';
import axios from "axios";
import {API_ROOT} from "./apiConfig";

import AuthService from "./services/AuthService";

const authService = AuthService.getService();

axios.defaults.baseURL = API_ROOT;

export const api = axios.create({
	baseURL: API_ROOT
});

api.interceptors.request.use((config: any) => {
	if(authService.isAccessTokenValid()) {
		config.headers['authToken'] = authService.getAccessToken();

		return config;
	} else {
		return axios.get(`/user/refresh`, {
			params: {
				refreshToken: authService.getRefreshToken()
			}
		})
			.then((response) => {
				authService.setTokensSilently({accessToken: response.data.authToken, refreshToken: response.data.refreshToken});
				config.headers['authToken'] = response.data.authToken;
				return config;
			})
			.catch((error) => {
				message.error('Unable to validate authentication token. Please log in again.');
				authService.clearTokens();
				return Promise.reject(error);
			})
	}
});

const App = () => {
	const [initializing, setInitializing] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);

	const checkAuthStatus = () => {
		setAuthenticated(false);
		setInitializing(true);

		if(!authService.isTokensSet()) {
			setAuthenticated(false);
			setInitializing(false);

			return;
		}

		if(authService.isAccessTokenValid()) {
			setAuthenticated(true);
			setInitializing(false);
		} else {
			axios.get(`/user/refresh`, {
				params: {
					refreshToken: authService.getRefreshToken()
				}
			})
				.then((response) => {
					authService.setTokens({accessToken: response.data.authToken, refreshToken: response.data.refreshToken});
					setAuthenticated(true);
					setInitializing(false);
				})
				.catch((error) => {
					message.error('Unable to validate authentication token. Please log in again.');
					authService.clearTokensSilently();

					setAuthenticated(false);
					setInitializing(false);
				})
		}
	}

	useEffect(() => {
		window.addEventListener('authStorage', checkAuthStatus);

		checkAuthStatus();

		return () => {
			window.removeEventListener('authStorage', checkAuthStatus);
		}
	}, []);

	if(initializing) {
		return(
			<InitializationScreen />
		);
	}

	if(!authenticated) {
		return(
			<Login />
		);
	}

	return(
		<BrowserRouter>
			<SidebarLayout />
		</BrowserRouter>
	);
}

export default App;
