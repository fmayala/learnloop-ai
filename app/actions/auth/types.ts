// OAuth2 Token Types
// Define or import the types
type OAuth2TokenRequest = RefreshTokenRequest;

interface BaseRequest {
  grant_type: 'authorization_code' | 'refresh_token' | 'client_credentials';
  client_id: string;
  client_secret: string;
}

interface RefreshTokenRequest extends BaseRequest {
  grant_type: 'refresh_token';
  refresh_token: string;
}

interface BaseResponse {
  access_token: string | null;
  token_type: string;
  expires_in: number;
}

interface CodeOrRefreshTokenResponse extends BaseResponse {
  user: {
    id: number;
    name: string;
  };
  refresh_token?: string;
  canvas_region?: string;
}

type OAuth2TokenResponse = CodeOrRefreshTokenResponse;