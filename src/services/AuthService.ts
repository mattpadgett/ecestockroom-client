import jwt_decode from "jwt-decode";

interface TokenObject {
    accessToken: string;
    refreshToken: string;
}

const AuthService = (function() {
    let _service: any;

    const _getService = () => {
        if(!_service) {
            _service = AuthService;
            return _service;
        }

        return _service;
    }

    const _setTokens = (tokenObj: TokenObject) => {
        localStorage.setItem('accessToken', tokenObj.accessToken);
        localStorage.setItem('refreshToken', tokenObj.refreshToken);

        window.dispatchEvent(new Event('authStorage'));
    }

    const _setTokensSilently = (tokenObj: TokenObject) => {
        localStorage.setItem('accessToken', tokenObj.accessToken);
        localStorage.setItem('refreshToken', tokenObj.refreshToken);
    }

    const _getAccessToken = () => {
        return localStorage.getItem('accessToken');
    }

    const _getRefreshToken = () => {
        return localStorage.getItem('refreshToken');
    }

    const _clearTokens = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        window.dispatchEvent(new Event('authStorage'));
    }

    const _clearTokensSilently = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    const _getDecodedAccessToken = () => {
        let token = localStorage.getItem('accessToken');

        if(!token) {
            return undefined;
        }

        return jwt_decode(token);
    }

    const _getDecodedRefreshToken = () => {
        let token = localStorage.getItem('refreshToken');

        if(!token) {
            return undefined;
        }

        return jwt_decode(token);
    }

    const _isAccessTokenValid = () => {
        let decodedToken: any = _getDecodedAccessToken();
        if(decodedToken === undefined) {
            return false;
        }

        if (
            decodedToken.exp <= Math.floor(new Date().getTime() / 1000) ||
            decodedToken.nbf >= Math.floor(new Date().getTime() / 1000) ||
            decodedToken.iss !== 'ecestockroom-api'
        ) {
            return false;
        }

        return true;
    }

    const _isTokensSet = () => {
        return !(localStorage.getItem('accessToken') === null || localStorage.getItem('refreshToken') === null);
    }

    const _checkAccess = (key: string) => {
        let decoded: any = _getDecodedAccessToken();

        if(decoded === undefined) return false;

        return decoded.permissionKeys.toLowerCase().split(',').includes(key.toLowerCase());
    }

    return {
        getService: _getService,
        setTokens: _setTokens,
        setTokensSilently: _setTokensSilently,
        clearTokens: _clearTokens,
        clearTokensSilently: _clearTokensSilently,
        getAccessToken: _getAccessToken,
        getRefreshToken: _getRefreshToken,
        getDecodedAccessToken: _getDecodedAccessToken,
        getDecodedRefreshToken: _getDecodedRefreshToken,
        isAccessTokenValid: _isAccessTokenValid,
        isTokensSet: _isTokensSet,
        checkAccess: _checkAccess,
    }
})();

export default AuthService;